import fs from "node:fs/promises";
import path from "node:path";

import { PROJECT_ROOT, WINK_SPECS, relativeToProject } from "./wink-config.mjs";
import { WINKS_MANIFEST_PATH } from "./wink-manifest.mjs";

const REPORT_PATH = path.join(PROJECT_ROOT, "reports", "cc213-final-delivery-status.md");
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function toPublicFilePath(assetPath) {
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

function categoryLabel(category) {
  return category ?? "Uncategorized";
}

function renderBulletList(items, emptyMessage) {
  if (items.length === 0) {
    return [`- ${emptyMessage}`];
  }

  return items.map((item) => `- ${item}`);
}

function parseApng(buffer) {
  if (!buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error("Invalid PNG signature.");
  }

  let offset = PNG_SIGNATURE.length;
  let width = null;
  let height = null;
  let colorType = null;
  let hasAnimationChunk = false;
  let hasTransparencyChunk = false;

  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (dataEnd + 4 > buffer.length) {
      throw new Error(`Corrupt PNG/APNG chunk "${type}".`);
    }

    if (type === "IHDR") {
      width = buffer.readUInt32BE(dataStart);
      height = buffer.readUInt32BE(dataStart + 4);
      colorType = buffer[dataStart + 9];
    }

    if (type === "acTL") {
      hasAnimationChunk = true;
    }

    if (type === "tRNS") {
      hasTransparencyChunk = true;
    }

    offset = dataEnd + 4;

    if (type === "IEND") {
      break;
    }
  }

  return {
    animated: hasAnimationChunk,
    height,
    transparent: colorType === 4 || colorType === 6 || hasTransparencyChunk,
    width,
  };
}

function hasRasterLottieAsset(asset) {
  return Boolean(asset && (asset.p || asset.u || asset.e === 1));
}

function parseLottie(json) {
  const assets = Array.isArray(json.assets) ? json.assets : [];

  return {
    height: Number.isFinite(json.h) ? json.h : null,
    transparent: !(typeof json.bg === "string" && json.bg.trim().length > 0),
    vectorOnly: !assets.some(hasRasterLottieAsset),
    width: Number.isFinite(json.w) ? json.w : null,
  };
}

async function buildSourceSvgAudit(item, kind) {
  const svgPath = item.svg?.path ?? null;
  const filePath = svgPath ? toPublicFilePath(svgPath) : null;
  const exists = filePath ? await pathExists(filePath) : false;

  return {
    exists,
    filePath,
    item,
    kind,
    path: svgPath,
  };
}

async function buildChatAudit(item) {
  const sourceSvg = await buildSourceSvgAudit(item, "chat");
  const apngPath = item.apng?.path ?? null;
  const filePath = apngPath ? toPublicFilePath(apngPath) : null;
  const exists = filePath ? await pathExists(filePath) : false;
  let parsed = null;

  if (exists && filePath) {
    parsed = parseApng(await fs.readFile(filePath));
  }

  return {
    apng: {
      animated: parsed?.animated ?? false,
      exists,
      filePath,
      height: parsed?.height ?? null,
      path: apngPath,
      transparent: parsed?.transparent ?? false,
      width: parsed?.width ?? null,
    },
    item,
    sourceSvg,
  };
}

async function buildEffectAudit(item) {
  const sourceSvg = await buildSourceSvgAudit(item, "effect");
  const lottiePath = item.lottiePath ?? null;
  const filePath = lottiePath ? toPublicFilePath(lottiePath) : null;
  const exists = filePath ? await pathExists(filePath) : false;
  let parsed = null;

  if (exists && filePath) {
    parsed = parseLottie(JSON.parse(await fs.readFile(filePath, "utf8")));
  }

  return {
    item,
    lottie: {
      exists,
      filePath,
      height: parsed?.height ?? null,
      path: lottiePath,
      transparent: parsed?.transparent ?? false,
      vectorOnly: parsed?.vectorOnly ?? false,
      width: parsed?.width ?? null,
    },
    sourceSvg,
  };
}

function isDimensionMatch(width, height, expectedWidth, expectedHeight) {
  return width === expectedWidth && height === expectedHeight;
}

function formatMissingFormatLine(kindLabel, audit, finalPath) {
  return `\`${audit.item.id}\` - ${audit.item.name} (${categoryLabel(audit.item.category)}) - ${kindLabel} missing${finalPath ? `: expected ${finalPath}` : ""}`;
}

function formatBrokenPathLine(prefix, item, assetPath) {
  return `\`${item.kind}/${item.id}\` - ${prefix}: ${assetPath}`;
}

function formatLowQualityLine(audit) {
  return `\`${audit.item.id}\` - ${audit.item.name} (${categoryLabel(audit.item.category)}) - \`${audit.item.lottieQuality}\`${audit.lottie.path ? ` - ${audit.lottie.path}` : ""}`;
}

async function main() {
  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });

  const manifest = JSON.parse(await fs.readFile(WINKS_MANIFEST_PATH, "utf8"));
  const chatItems = manifest.groups.chat.items;
  const effectItems = manifest.groups.effect.items;
  const chatExpected = WINK_SPECS.chat;
  const effectExpected = WINK_SPECS.effect;

  const [chatAudits, effectAudits] = await Promise.all([
    Promise.all(chatItems.map(buildChatAudit)),
    Promise.all(effectItems.map(buildEffectAudit)),
  ]);

  const chatWithApngDeclared = chatAudits.filter((audit) => Boolean(audit.apng.path));
  const chatApngFilesFound = chatAudits.filter((audit) => audit.apng.exists);
  const chatMissingApng = chatAudits.filter((audit) => !audit.apng.exists);
  const chatInvalidDimensions = chatApngFilesFound.filter(
    (audit) =>
      !isDimensionMatch(
        audit.apng.width,
        audit.apng.height,
        chatExpected.width,
        chatExpected.height
      )
  );
  const chatInvalidTransparency = chatApngFilesFound.filter((audit) => !audit.apng.transparent);
  const chatNotAnimated = chatApngFilesFound.filter((audit) => !audit.apng.animated);

  const effectWithLottieDeclared = effectAudits.filter((audit) => Boolean(audit.lottie.path));
  const effectLottieFilesFound = effectAudits.filter((audit) => audit.lottie.exists);
  const effectMissingLottie = effectAudits.filter((audit) => !audit.lottie.exists);
  const effectInvalidDimensions = effectLottieFilesFound.filter(
    (audit) =>
      !isDimensionMatch(
        audit.lottie.width,
        audit.lottie.height,
        effectExpected.width,
        effectExpected.height
      )
  );
  const effectInvalidTransparency = effectLottieFilesFound.filter(
    (audit) => !audit.lottie.transparent
  );
  const effectNotVectorOnly = effectLottieFilesFound.filter((audit) => !audit.lottie.vectorOnly);
  const lowQualityLotties = effectAudits.filter(
    (audit) => audit.item.lottieQuality === "low" && audit.lottie.exists
  );

  const brokenPaths = [
    ...chatAudits.flatMap((audit) => {
      const entries = [];
      if (audit.sourceSvg.path && !audit.sourceSvg.exists) {
        entries.push(formatBrokenPathLine("svg", audit.item, audit.sourceSvg.path));
      }
      if (audit.apng.path && !audit.apng.exists) {
        entries.push(formatBrokenPathLine("apng", audit.item, audit.apng.path));
      }
      return entries;
    }),
    ...effectAudits.flatMap((audit) => {
      const entries = [];
      if (audit.sourceSvg.path && !audit.sourceSvg.exists) {
        entries.push(formatBrokenPathLine("svg", audit.item, audit.sourceSvg.path));
      }
      if (audit.lottie.path && !audit.lottie.exists) {
        entries.push(formatBrokenPathLine("lottie", audit.item, audit.lottie.path));
      }
      return entries;
    }),
  ];

  const lines = [
    "# CC-213 Final Delivery Status",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Manifest generatedAt: ${manifest.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Chat Winks total: ${chatItems.length}`,
    `- Effect / Full Bingo Winks total: ${effectItems.length}`,
    `- Chat Winks with APNG declared in manifest: ${chatWithApngDeclared.length}/${chatItems.length}`,
    `- Chat Winks with APNG files found on disk: ${chatApngFilesFound.length}/${chatItems.length}`,
    `- Effect / Full Bingo Winks with Lottie JSON declared in manifest: ${effectWithLottieDeclared.length}/${effectItems.length}`,
    `- Effect / Full Bingo Winks with Lottie JSON files found on disk: ${effectLottieFilesFound.length}/${effectItems.length}`,
    `- Effect / Full Bingo Winks missing Lottie JSON final export: ${effectMissingLottie.length}/${effectItems.length}`,
    `- Broken source/final asset paths: ${brokenPaths.length}`,
    `- Low-quality Lottie files present: ${lowQualityLotties.length}`,
    "",
    "## 1. Chat Winks",
    "",
    `- Total Chat Winks: ${chatItems.length}`,
    `- APNG final export confirmed for every Chat Wink: ${chatApngFilesFound.length === chatItems.length ? "Yes" : "No"} (${chatApngFilesFound.length}/${chatItems.length})`,
    `- APNG paths valid on disk: ${chatApngFilesFound.length}/${chatWithApngDeclared.length}`,
    `- APNG dimensions 768x1024: ${chatApngFilesFound.length - chatInvalidDimensions.length}/${chatApngFilesFound.length}`,
    `- APNG transparent background requirement: ${chatApngFilesFound.length - chatInvalidTransparency.length}/${chatApngFilesFound.length}`,
    `- APNG animation chunk present: ${chatApngFilesFound.length - chatNotAnimated.length}/${chatApngFilesFound.length}`,
    "",
    "## 2. Effect / Full Bingo Winks",
    "",
    `- Total Effect / Full Bingo Winks: ${effectItems.length}`,
    `- Effect / Full Bingo Winks with Lottie JSON: ${effectWithLottieDeclared.length}/${effectItems.length}`,
    `- Effect / Full Bingo Winks missing Lottie JSON: ${effectMissingLottie.length}/${effectItems.length}`,
    `- Lottie paths valid on disk: ${effectLottieFilesFound.length}/${effectWithLottieDeclared.length}`,
    `- Lottie dimensions 1920x1080: ${effectLottieFilesFound.length - effectInvalidDimensions.length}/${effectLottieFilesFound.length}`,
    `- Lottie transparent background requirement: ${effectLottieFilesFound.length - effectInvalidTransparency.length}/${effectLottieFilesFound.length}`,
    `- Lottie vector-only check: ${effectLottieFilesFound.length - effectNotVectorOnly.length}/${effectLottieFilesFound.length}`,
    "",
    "## 3. Missing Formats",
    "",
    "### Chat Winks missing APNG",
    "",
    ...renderBulletList(
      chatMissingApng.map((audit) =>
        formatMissingFormatLine("APNG", audit, audit.apng.path ?? `/winks/chat/apng/${audit.item.id}.apng`)
      ),
      "None."
    ),
    "",
    "### Effect Winks missing Lottie",
    "",
    ...renderBulletList(
      effectMissingLottie.map((audit) =>
        formatMissingFormatLine(
          "Lottie JSON",
          audit,
          audit.lottie.path ?? `/lottie/effect-winks/${audit.item.id}.json`
        )
      ),
      "None."
    ),
    "",
    "### Broken paths",
    "",
    ...renderBulletList(brokenPaths, "None. Every source SVG and final delivery asset path resolves on disk."),
    "",
    "### Low-quality Lottie files",
    "",
    ...renderBulletList(
      lowQualityLotties.map(formatLowQualityLine),
      "None."
    ),
    "",
    "## Validation Notes",
    "",
    `- Chat Wink APNG target: ${chatExpected.width}x${chatExpected.height}, transparent, animated APNG final export.`,
    `- Effect Wink Lottie target: ${effectExpected.width}x${effectExpected.height}, transparent, vector-only JSON final export.`,
    "",
    "## Exceptions",
    "",
    "### Chat Wink dimension issues",
    "",
    ...renderBulletList(
      chatInvalidDimensions.map(
        (audit) =>
          `\`${audit.item.id}\` - ${audit.apng.width}x${audit.apng.height} at ${audit.apng.path}`
      ),
      "None."
    ),
    "",
    "### Chat Wink transparency issues",
    "",
    ...renderBulletList(
      chatInvalidTransparency.map(
        (audit) => `\`${audit.item.id}\` - transparency not detected in ${audit.apng.path}`
      ),
      "None."
    ),
    "",
    "### Chat Wink APNG animation issues",
    "",
    ...renderBulletList(
      chatNotAnimated.map(
        (audit) => `\`${audit.item.id}\` - APNG animation chunk missing in ${audit.apng.path}`
      ),
      "None."
    ),
    "",
    "### Effect Wink Lottie dimension issues",
    "",
    ...renderBulletList(
      effectInvalidDimensions.map(
        (audit) =>
          `\`${audit.item.id}\` - ${audit.lottie.width}x${audit.lottie.height} at ${audit.lottie.path}`
      ),
      "None."
    ),
    "",
    "### Effect Wink Lottie transparency issues",
    "",
    ...renderBulletList(
      effectInvalidTransparency.map(
        (audit) => `\`${audit.item.id}\` - background color detected in ${audit.lottie.path}`
      ),
      "None."
    ),
    "",
    "### Effect Wink Lottie vector-only issues",
    "",
    ...renderBulletList(
      effectNotVectorOnly.map(
        (audit) => `\`${audit.item.id}\` - raster asset reference detected in ${audit.lottie.path}`
      ),
      "None."
    ),
    "",
  ];

  await fs.writeFile(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");

  console.log(`Wrote ${relativeToProject(REPORT_PATH)}.`);
  console.log(`Chat Winks: ${chatItems.length}`);
  console.log(`Effect Winks: ${effectItems.length}`);
  console.log(`Chat APNG files found: ${chatApngFilesFound.length}/${chatItems.length}`);
  console.log(
    `Effect Lottie files found: ${effectLottieFilesFound.length}/${effectItems.length}`
  );
  console.log(`Effect missing Lottie: ${effectMissingLottie.length}`);
  console.log(`Broken paths: ${brokenPaths.length}`);
  console.log(`Low-quality Lottie files: ${lowQualityLotties.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
