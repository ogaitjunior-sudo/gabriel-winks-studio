import fs from "node:fs/promises";
import path from "node:path";

import { JSDOM } from "jsdom";

import {
  FALLBACK_WINK_FORMAT,
  PRIMARY_WINK_FORMAT,
  PROJECT_ROOT,
  RECOMMENDED_APNG_FPS,
  RECOMMENDED_DURATION_MS,
  WINKS_ROOT,
  WINK_KINDS,
  WINK_SPECS,
  collectCssTimes,
  durationToFrameCount,
  ensureWinkStructure,
  formatBytes,
  getWinkPaths,
  parseCssTimeToMs,
  relativeToProject,
  sortIds,
  titleFromId,
} from "./wink-config.mjs";

export const WINKS_MANIFEST_PATH = path.join(WINKS_ROOT, "manifest.json");

function normalizeDimension(value) {
  if (!value) return Number.NaN;
  return Number.parseFloat(String(value).replace(/px$/i, "").trim());
}

function parseViewBox(viewBox) {
  if (!viewBox) return null;

  const parts = viewBox
    .trim()
    .split(/\s+/)
    .map((part) => Number.parseFloat(part));

  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) {
    return null;
  }

  return {
    height: parts[3],
    width: parts[2],
    x: parts[0],
    y: parts[1],
  };
}

function arrayBufferFromBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function estimateDurationMs(svg, fileContents) {
  const rootDuration =
    svg.getAttribute("data-wink-duration") ??
    svg.getAttribute("data-duration") ??
    svg.getAttribute("data-duration-ms");

  const parsedRootDuration = parseCssTimeToMs(rootDuration);
  if (parsedRootDuration > 0) {
    return parsedRootDuration;
  }

  const durations = [];

  for (const element of svg.querySelectorAll("[style], [dur], [begin]")) {
    for (const attributeName of ["style", "dur", "begin"]) {
      const value = element.getAttribute(attributeName);
      durations.push(...collectCssTimes(value));
    }
  }

  durations.push(...collectCssTimes(fileContents));

  return durations.length > 0 ? Math.max(...durations) : null;
}

export function parseSvgMetrics(fileContents, spec) {
  const dom = new JSDOM(fileContents, { contentType: "image/svg+xml" });
  const { document } = dom.window;
  const svg =
    document.documentElement.localName === "svg"
      ? document.documentElement
      : document.querySelector("svg");

  if (!svg) {
    throw new Error("SVG root element not found.");
  }

  const viewBox = svg.getAttribute("viewBox");
  const parsedViewBox = parseViewBox(viewBox);
  const width = normalizeDimension(svg.getAttribute("width"));
  const height = normalizeDimension(svg.getAttribute("height"));

  return {
    category: svg.getAttribute("data-wink-category") ?? null,
    durationMs: estimateDurationMs(svg, fileContents),
    height: Number.isFinite(height) ? height : parsedViewBox?.height ?? spec.height,
    name:
      svg.getAttribute("data-wink-name") ??
      svg.getAttribute("aria-label") ??
      svg.getAttribute("id") ??
      null,
    viewBox: viewBox?.trim() ?? spec.viewBox,
    width: Number.isFinite(width) ? width : parsedViewBox?.width ?? spec.width,
  };
}

async function countPngFrames(framesRoot, id) {
  const frameDirectory = path.join(framesRoot, id);

  try {
    const entries = await fs.readdir(frameDirectory, { withFileTypes: true });
    return entries.filter(
      (entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".png"
    ).length;
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return 0;
    }
    throw error;
  }
}

async function loadEffectMetadata(paths) {
  const metadata = await readJsonIfExists(paths.metadataPath);
  const entries = Array.isArray(metadata?.effects) ? metadata.effects : [];

  return new Map(entries.map((entry) => [entry.id, entry]));
}

async function buildItem(kind, id, spec, paths, metadataMap) {
  const svgPath = path.join(paths.svgDir, `${id}.svg`);
  const apngPath = path.join(paths.apngDir, `${id}.apng`);

  const [svgStat, apngStat, frameCount] = await Promise.all([
    fs.stat(svgPath).catch(() => null),
    fs.stat(apngPath).catch(() => null),
    countPngFrames(paths.framesDir, id),
  ]);

  let svgMetrics = null;
  if (svgStat) {
    svgMetrics = parseSvgMetrics(await fs.readFile(svgPath, "utf8"), spec);
  }

  const metadata = metadataMap.get(id) ?? null;
  const durationMs = metadata?.durationMs ?? svgMetrics?.durationMs ?? null;
  const calculatedFrameCount = durationMs
    ? durationToFrameCount(durationMs, spec.apngFrameRate)
    : null;

  return {
    apng: apngStat
      ? {
          bytes: apngStat.size,
          fileName: path.basename(apngPath),
          fps: spec.apngFrameRate,
          frameCount: frameCount || calculatedFrameCount,
          path: `/winks/${kind}/apng/${path.basename(apngPath)}`,
          sizeLabel: formatBytes(apngStat.size),
          transparent: true,
        }
      : null,
    aspectRatio: spec.aspectRatio,
    category: metadata?.category ?? svgMetrics?.category ?? null,
    durationMs,
    edgeGuidance: spec.edgeGuidance,
    height: svgMetrics?.height ?? metadata?.height ?? spec.height,
    id,
    kind,
    name: metadata?.name ?? svgMetrics?.name ?? titleFromId(id),
    safeArea: spec.safeArea,
    safeAreaGuidance: spec.safeAreaGuidance,
    svg: svgStat
      ? {
          bytes: svgStat.size,
          fileName: path.basename(svgPath),
          path: `/winks/${kind}/svg/${path.basename(svgPath)}`,
          sizeLabel: formatBytes(svgStat.size),
        }
      : null,
    typeLabel: spec.typeLabel,
    viewBox: svgMetrics?.viewBox ?? spec.viewBox,
    width: svgMetrics?.width ?? metadata?.width ?? spec.width,
  };
}

export async function scanWinkKind(kind) {
  const spec = WINK_SPECS[kind];
  const paths = await ensureWinkStructure(kind);
  const metadataMap = kind === "effect" ? await loadEffectMetadata(paths) : new Map();

  const [svgEntries, apngEntries] = await Promise.all([
    fs.readdir(paths.svgDir, { withFileTypes: true }),
    fs.readdir(paths.apngDir, { withFileTypes: true }),
  ]);

  const ids = new Set();

  for (const entry of svgEntries) {
    if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".svg") {
      ids.add(path.basename(entry.name, ".svg"));
    }
  }

  for (const entry of apngEntries) {
    if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".apng") {
      ids.add(path.basename(entry.name, ".apng"));
    }
  }

  for (const id of metadataMap.keys()) {
    ids.add(id);
  }

  const sortedIds = [...ids].sort(sortIds);
  const items = await Promise.all(
    sortedIds.map((id) => buildItem(kind, id, spec, paths, metadataMap))
  );

  return {
    edgeGuidance: spec.edgeGuidance,
    height: spec.height,
    items,
    kind,
    label: spec.label,
    safeArea: spec.safeArea,
    safeAreaGuidance: spec.safeAreaGuidance,
    width: spec.width,
  };
}

export async function buildWinksManifest() {
  const groups = Object.fromEntries(
    await Promise.all(
      WINK_KINDS.map(async (kind) => [kind, await scanWinkKind(kind)])
    )
  );

  const tooling = {
    encoder: "ffmpeg-static",
    fallbackFormat: FALLBACK_WINK_FORMAT,
    optionalOptimizers: {
      oxipng: false,
      pngquant: false,
    },
    primaryFormat: PRIMARY_WINK_FORMAT,
    renderer: "puppeteer-core + system Chrome",
  };

  return {
    generatedAt: new Date().toISOString(),
    groups,
    recommendations: {
      cc213: true,
      fallbackFormat: FALLBACK_WINK_FORMAT,
      loop: "infinite",
      primaryFormat: PRIMARY_WINK_FORMAT,
      recommendedApngFps: RECOMMENDED_APNG_FPS,
      recommendedDurationMs: RECOMMENDED_DURATION_MS,
      transparencyRequired: true,
    },
    schemaVersion: 1,
    tooling,
  };
}

export async function writeWinksManifest() {
  await fs.mkdir(WINKS_ROOT, { recursive: true });
  const manifest = await buildWinksManifest();
  await fs.writeFile(
    WINKS_MANIFEST_PATH,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
  return manifest;
}

export async function readManifestOrBuild() {
  const manifest = await readJsonIfExists(WINKS_MANIFEST_PATH);
  return manifest ?? writeWinksManifest();
}

export function getProjectDocCandidates() {
  return ["README.md"].map((fileName) => path.join(PROJECT_ROOT, fileName));
}

export function toArrayBuffer(buffer) {
  return arrayBufferFromBuffer(buffer);
}

export function describePath(targetPath) {
  return relativeToProject(targetPath);
}
