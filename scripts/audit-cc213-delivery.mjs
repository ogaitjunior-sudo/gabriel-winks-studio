import fs from "node:fs/promises";
import path from "node:path";

import { PROJECT_ROOT, relativeToProject } from "./wink-config.mjs";
import { WINKS_MANIFEST_PATH } from "./wink-manifest.mjs";

const REPORT_PATH = path.join(PROJECT_ROOT, "reports", "cc213-delivery-checklist.md");
const TARGET_DIRECTORIES = [
  "public/source-svg/chat-winks",
  "public/source-svg/effect-winks",
  "public/apng/chat-winks",
  "public/lottie/effect-winks",
];

function toAssetFilePath(assetPath) {
  return path.join(PROJECT_ROOT, "public", assetPath.replace(/^\/+/, ""));
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

function renderBulletList(items, emptyMessage) {
  if (items.length === 0) {
    return [`- ${emptyMessage}`];
  }

  return items.map((item) => `- ${item}`);
}

function renderTable(headers, rows) {
  const headerRow = `| ${headers.join(" | ")} |`;
  const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;
  const bodyRows = rows.map((row) => `| ${row.join(" | ")} |`);
  return [headerRow, separatorRow, ...bodyRows];
}

function statusLabel(value) {
  return value ? "Ready" : "Missing";
}

function categoryLabel(category) {
  return category ?? "Uncategorized";
}

async function buildItemAudit(item) {
  const svgPath = item.svg?.path ?? null;
  const apngPath = item.apng?.path ?? null;
  const lottiePath = item.lottiePath ?? null;
  const soundPath = item.soundPath ?? null;
  const soundCuePaths = Array.isArray(item.soundCues) ? item.soundCues.map((cue) => cue.sound) : [];

  const svgExists = svgPath ? await pathExists(toAssetFilePath(svgPath)) : false;
  const apngExists = apngPath ? await pathExists(toAssetFilePath(apngPath)) : false;
  const lottieExists = lottiePath ? await pathExists(toAssetFilePath(lottiePath)) : false;
  const soundExists = soundPath ? await pathExists(toAssetFilePath(soundPath)) : false;
  const soundCueChecks = await Promise.all(
    soundCuePaths.map(async (cuePath) => ({
      exists: await pathExists(toAssetFilePath(cuePath)),
      path: cuePath,
    }))
  );

  const brokenPaths = [];

  if (svgPath && !svgExists) {
    brokenPaths.push(`svg: ${svgPath}`);
  }

  if (apngPath && !apngExists) {
    brokenPaths.push(`apng: ${apngPath}`);
  }

  if (lottiePath && !lottieExists) {
    brokenPaths.push(`lottie: ${lottiePath}`);
  }

  if (soundPath && !soundExists) {
    brokenPaths.push(`sound: ${soundPath}`);
  }

  for (const cueCheck of soundCueChecks) {
    if (!cueCheck.exists) {
      brokenPaths.push(`sound cue: ${cueCheck.path}`);
    }
  }

  return {
    apngExists,
    brokenPaths,
    item,
    lottieExists,
    svgExists,
  };
}

function formatItemLine(audit, options) {
  const finalStatus = options.finalExists ? "ready" : "missing";
  return `\`${audit.item.id}\` - ${audit.item.name} (${categoryLabel(audit.item.category)}) - ${options.finalLabel} ${finalStatus}`;
}

async function main() {
  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });

  const manifest = JSON.parse(await fs.readFile(WINKS_MANIFEST_PATH, "utf8"));
  const chatItems = manifest.groups.chat.items;
  const effectItems = manifest.groups.effect.items;

  const chatAudits = await Promise.all(chatItems.map(buildItemAudit));
  const effectAudits = await Promise.all(effectItems.map(buildItemAudit));

  const chatMissingApng = chatAudits.filter((audit) => !audit.apngExists);
  const effectMissingLottie = effectAudits.filter((audit) => !audit.lottieExists);
  const missingSourceSvg = [...chatAudits, ...effectAudits].filter((audit) => !audit.svgExists);
  const brokenPathEntries = [...chatAudits, ...effectAudits].flatMap((audit) =>
    audit.brokenPaths.map((brokenPath) => `${audit.item.kind}/${audit.item.id} - ${brokenPath}`)
  );

  const chatRows = chatAudits.map((audit) => [
    `\`${audit.item.id}\``,
    audit.item.name,
    categoryLabel(audit.item.category),
    statusLabel(audit.svgExists),
    statusLabel(audit.apngExists),
    audit.brokenPaths.length > 0 ? audit.brokenPaths.join("<br>") : "OK",
  ]);
  const effectRows = effectAudits.map((audit) => [
    `\`${audit.item.id}\``,
    audit.item.name,
    categoryLabel(audit.item.category),
    statusLabel(audit.svgExists),
    statusLabel(audit.lottieExists),
    audit.brokenPaths.length > 0 ? audit.brokenPaths.join("<br>") : "OK",
  ]);

  const lines = [
    "# CC-213 Delivery Checklist",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Classification Summary",
    "",
    `- Total animations in manifest: ${chatItems.length + effectItems.length}`,
    `- Chat Winks: ${chatItems.length}`,
    `- Effect / Full Bingo Winks: ${effectItems.length}`,
    `- Chat Winks with APNG final export available: ${chatItems.length - chatMissingApng.length}/${chatItems.length}`,
    `- Effect / Full Bingo Winks with Lottie JSON final export available: ${effectItems.length - effectMissingLottie.length}/${effectItems.length}`,
    `- Animations with SVG source available: ${chatItems.length + effectItems.length - missingSourceSvg.length}/${chatItems.length + effectItems.length}`,
    `- Broken manifest asset paths: ${brokenPathEntries.length}`,
    "",
    "## Target Delivery Folders",
    "",
    ...TARGET_DIRECTORIES.map((directory) => `- \`${directory}\``),
    "",
    "These folders were created as CC-213 delivery staging targets. Existing asset files remain in their current locations so no previews or source assets are disturbed.",
    "",
    "## Chat Winks Still Needing APNG Export",
    "",
    ...renderBulletList(
      chatMissingApng.map((audit) =>
        formatItemLine(audit, { finalExists: audit.apngExists, finalLabel: "APNG final" })
      ),
      "None. Every classified Chat Wink already has an APNG export in the current project structure."
    ),
    "",
    "## Effect / Full Bingo Winks Still Needing Lottie JSON Export",
    "",
    ...renderBulletList(
      effectMissingLottie.map((audit) =>
        formatItemLine(audit, { finalExists: audit.lottieExists, finalLabel: "Lottie final" })
      ),
      "None."
    ),
    "",
    "## SVG Source Files Available",
    "",
    `- Chat Winks with SVG source: ${chatAudits.filter((audit) => audit.svgExists).length}/${chatItems.length}`,
    `- Effect / Full Bingo Winks with SVG source: ${effectAudits.filter((audit) => audit.svgExists).length}/${effectItems.length}`,
    "",
    "### Chat Wink SVG Sources",
    "",
    ...renderBulletList(
      chatAudits
        .filter((audit) => audit.svgExists)
        .map((audit) => `\`${audit.item.id}\` - ${audit.item.svg.path}`),
      "None."
    ),
    "",
    "### Effect / Full Bingo Wink SVG Sources",
    "",
    ...renderBulletList(
      effectAudits
        .filter((audit) => audit.svgExists)
        .map((audit) => `\`${audit.item.id}\` - ${audit.item.svg.path}`),
      "None."
    ),
    "",
    "## Missing Files",
    "",
    "### Missing SVG Source Files",
    "",
    ...renderBulletList(
      missingSourceSvg.map((audit) => `\`${audit.item.id}\` - expected ${audit.item.svg?.path ?? "manifest svg asset"}`),
      "None."
    ),
    "",
    "### Missing Final Delivery Files",
    "",
    `- Chat Winks missing APNG final export: ${chatMissingApng.length}`,
    `- Effect / Full Bingo Winks missing Lottie JSON final export: ${effectMissingLottie.length}`,
    "",
    "## Broken Paths",
    "",
    ...renderBulletList(brokenPathEntries, "None. Every manifest-referenced asset path resolves on disk."),
    "",
    "## Chat Wink Inventory",
    "",
    ...renderTable(
      ["ID", "Name", "Category", "Source SVG", "APNG Final", "Notes"],
      chatRows
    ),
    "",
    "## Effect / Full Bingo Wink Inventory",
    "",
    ...renderTable(
      ["ID", "Name", "Category", "Source SVG", "Lottie Final", "Notes"],
      effectRows
    ),
    "",
  ];

  await fs.writeFile(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");

  console.log(`Wrote CC-213 delivery checklist to ${relativeToProject(REPORT_PATH)}.`);
  console.log(`Chat missing APNG: ${chatMissingApng.length}`);
  console.log(`Effect missing Lottie: ${effectMissingLottie.length}`);
  console.log(`Missing source SVG: ${missingSourceSvg.length}`);
  console.log(`Broken paths: ${brokenPathEntries.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
