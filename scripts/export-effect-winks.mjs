import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";

import { loadEffectWinkModules } from "./load-effect-winks.mjs";
import {
  PRIMARY_WINK_FORMAT,
  RECOMMENDED_APNG_FPS,
  RECOMMENDED_DURATION_MS,
  ensureWinkStructure,
  getWinkPaths,
} from "./wink-config.mjs";
import { normalizeWinkSvgFiles } from "./normalize-wink-svgs.mjs";
import { writeWinksManifest } from "./wink-manifest.mjs";

const SVG_NS = "http://www.w3.org/2000/svg";
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const exportPaths = getWinkPaths("effect");
const exportRoot = exportPaths.root;
const svgOutputDir = exportPaths.svgDir;
const metadataPath = exportPaths.metadataPath;

function assertExportPath(targetPath) {
  const resolved = path.resolve(targetPath);
  const allowedRoot = path.resolve(exportRoot);

  if (resolved !== allowedRoot && !resolved.startsWith(`${allowedRoot}${path.sep}`)) {
    throw new Error(`Refusing to write outside export root: ${resolved}`);
  }
}

function serializeEffectSvg(effect, config) {
  const markup = renderToStaticMarkup(createElement(effect.Component, { playing: true }));
  const dom = new JSDOM(markup, { contentType: "image/svg+xml" });
  const { document, XMLSerializer } = dom.window;
  const svg =
    document.documentElement.localName === "svg"
      ? document.documentElement
      : document.querySelector("svg");

  if (!svg) {
    throw new Error(`Effect "${effect.id}" did not render an SVG root.`);
  }

  svg.setAttribute("xmlns", SVG_NS);
  svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  svg.setAttribute("viewBox", config.EFFECT_WINK_VIEW_BOX);
  svg.setAttribute("width", `${config.EFFECT_WINK_WIDTH}`);
  svg.setAttribute("height", `${config.EFFECT_WINK_HEIGHT}`);

  for (const element of svg.querySelectorAll("[class]")) {
    element.removeAttribute("class");
  }
  svg.removeAttribute("class");

  const styleEl = document.createElementNS(SVG_NS, "style");
  styleEl.textContent = config.EFFECT_KEYFRAMES_CSS;
  svg.insertBefore(styleEl, svg.firstChild);

  return `${XML_HEADER}${new XMLSerializer().serializeToString(svg)}\n`;
}

async function removeExistingSvgFiles() {
  await fs.mkdir(svgOutputDir, { recursive: true });
  const entries = await fs.readdir(svgOutputDir, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".svg")
      .map((entry) => {
        const targetPath = path.join(svgOutputDir, entry.name);
        assertExportPath(targetPath);
        return fs.unlink(targetPath);
      })
  );
}

async function main() {
  assertExportPath(svgOutputDir);
  assertExportPath(metadataPath);

  const config = await loadEffectWinkModules(projectRoot);
  const { EFFECTS } = config;

  await ensureWinkStructure("effect");
  await removeExistingSvgFiles();

  const metadata = EFFECTS.map((effect) => config.createEffectWinkMetadata(effect));

  await fs.mkdir(exportRoot, { recursive: true });
  await fs.writeFile(
    metadataPath,
    `${JSON.stringify(
      {
        schemaVersion: 2,
        type: config.EFFECT_WINK_TYPE,
        format: config.EFFECT_WINK_FORMAT,
        primaryFormat: PRIMARY_WINK_FORMAT,
        fallbackFormat: "apng",
        width: config.EFFECT_WINK_WIDTH,
        height: config.EFFECT_WINK_HEIGHT,
        aspectRatio: config.EFFECT_WINK_ASPECT_RATIO,
        transparent: true,
        safeArea: config.EFFECT_WINK_SAFE_AREA,
        safeAreaGuidance: "Keep key action inside a centered safe area.",
        recommendedApngFps: RECOMMENDED_APNG_FPS,
        recommendedDurationMs: RECOMMENDED_DURATION_MS,
        loop: "infinite",
        effects: metadata,
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const writtenSvgPaths = EFFECTS.map((effect) => path.join(svgOutputDir, `${effect.id}.svg`));

  await Promise.all(
    EFFECTS.map(async (effect) => {
      const outputPath = path.join(svgOutputDir, `${effect.id}.svg`);
      assertExportPath(outputPath);
      await fs.writeFile(outputPath, serializeEffectSvg(effect, config), "utf8");
    })
  );

  await normalizeWinkSvgFiles("effect", writtenSvgPaths);

  const manifest = await writeWinksManifest();

  console.log(
    `Exported ${EFFECTS.length} Gabriel Winks effects to ${path.relative(projectRoot, svgOutputDir)}`
  );
  console.log(`Wrote metadata to ${path.relative(projectRoot, metadataPath)}`);
  console.log(
    `Updated wink manifest with ${manifest.groups.effect.items.length} effect entries.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
