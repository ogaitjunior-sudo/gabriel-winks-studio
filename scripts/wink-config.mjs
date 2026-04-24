import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CSS_TIME_RE = /(-?\d*\.?\d+)\s*(ms|s)\b/gi;

export const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
export const WINKS_ROOT = path.join(PROJECT_ROOT, "public", "winks");

export const PRIMARY_WINK_FORMAT = "svg-animation";
export const FALLBACK_WINK_FORMAT = "apng";
export const RECOMMENDED_APNG_FPS = 15;
export const RECOMMENDED_DURATION_MS = {
  max: 4000,
  min: 2000,
};

export const WINK_SPECS = {
  effect: {
    apngFrameRate: RECOMMENDED_APNG_FPS,
    aspectRatio: "16:9",
    edgeGuidance: null,
    height: 1080,
    kind: "effect",
    label: "Gabriel Winks Effects",
    safeArea: "centered",
    safeAreaGuidance: "Keep key action inside a centered safe area.",
    typeLabel: "Overlay / Full Screen",
    viewBox: "0 0 1920 1080",
    width: 1920,
  },
  chat: {
    apngFrameRate: RECOMMENDED_APNG_FPS,
    aspectRatio: "3:4",
    edgeGuidance: "Avoid placing important elements too close to the top and bottom edges.",
    height: 1024,
    kind: "chat",
    label: "Gabriel Winks Chat",
    safeArea: "centered",
    safeAreaGuidance:
      "Keep key action inside a centered safe area and leave breathing room near the top and bottom edges.",
    typeLabel: "Portrait / Chat Overlay",
    viewBox: "0 0 768 1024",
    width: 768,
  },
};

export const WINK_KINDS = Object.freeze(Object.keys(WINK_SPECS));

export function getWinkPaths(kind) {
  if (!WINK_SPECS[kind]) {
    throw new Error(`Unsupported wink kind "${kind}".`);
  }

  const root = path.join(WINKS_ROOT, kind);
  return {
    apngDir: path.join(root, "apng"),
    framesDir: path.join(root, "frames"),
    metadataPath: path.join(root, "metadata.json"),
    root,
    svgDir: path.join(root, "svg"),
  };
}

export function assertWithinRoot(allowedRoot, targetPath) {
  const resolvedRoot = path.resolve(allowedRoot);
  const resolvedTarget = path.resolve(targetPath);

  if (
    resolvedTarget !== resolvedRoot &&
    !resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)
  ) {
    throw new Error(`Refusing to operate outside ${resolvedRoot}: ${resolvedTarget}`);
  }
}

export async function ensureWinkStructure(kind) {
  const paths = getWinkPaths(kind);
  await Promise.all(
    [paths.root, paths.svgDir, paths.apngDir, paths.framesDir].map(async (directoryPath) => {
      assertWithinRoot(paths.root, directoryPath);
      await fs.mkdir(directoryPath, { recursive: true });
    })
  );
  return paths;
}

export async function listFilesRecursive(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(entryPath)));
      continue;
    }

    files.push(entryPath);
  }

  return files;
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function relativeToProject(targetPath) {
  return path.relative(PROJECT_ROOT, targetPath).replaceAll("\\", "/");
}

export function titleFromId(id) {
  return id
    .split(/[-_]+/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function parseCssTimeToMs(value) {
  if (!value) return 0;

  const match = String(value).trim().match(/^(-?\d*\.?\d+)\s*(ms|s)$/i);
  if (!match) return 0;

  const amount = Number.parseFloat(match[1]);
  if (!Number.isFinite(amount)) return 0;

  return match[2].toLowerCase() === "s" ? amount * 1000 : amount;
}

export function collectCssTimes(input) {
  if (!input) return [];

  const matches = [];
  for (const match of String(input).matchAll(CSS_TIME_RE)) {
    const time = parseCssTimeToMs(`${match[1]}${match[2]}`);
    if (time > 0) {
      matches.push(time);
    }
  }

  return matches;
}

export function durationToFrameCount(durationMs, fps = RECOMMENDED_APNG_FPS) {
  const frameCount = Math.ceil((durationMs / 1000) * fps);
  return Math.max(frameCount, 2);
}

export function createFrameTimes(durationMs, frameCount) {
  const totalFrames = Math.max(frameCount, 2);
  const step = durationMs / totalFrames;

  return Array.from({ length: totalFrames }, (_, index) =>
    Math.max(0, Math.round(index * step))
  );
}

export function sortIds(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
