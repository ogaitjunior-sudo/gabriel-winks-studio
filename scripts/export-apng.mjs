import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

import ffmpegPath from "ffmpeg-static";
import puppeteer from "puppeteer-core";

import {
  PROJECT_ROOT,
  RECOMMENDED_APNG_FPS,
  WINK_KINDS,
  WINK_SPECS,
  assertWithinRoot,
  createFrameTimes,
  durationToFrameCount,
  ensureWinkStructure,
  getWinkPaths,
  relativeToProject,
  sortIds,
} from "./wink-config.mjs";
import { scanWinkKind, writeWinksManifest } from "./wink-manifest.mjs";

const DEFAULT_DURATION_MS = 3000;
const FRAME_FILE_RE = /^frame-\d{4}\.png$/i;
const CHROME_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);

function parseArgs(argv) {
  const args = { kind: "all", only: null };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--kind" && next) {
      args.kind = next;
      index += 1;
      continue;
    }

    if (arg === "--only" && next) {
      args.only = next
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      index += 1;
    }
  }

  return args;
}

async function findBrowserExecutable() {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try the next browser candidate.
    }
  }

  throw new Error(
    "Could not find a Chromium browser executable. Set CHROME_PATH or PUPPETEER_EXECUTABLE_PATH."
  );
}

function createSnapshotHtml(svgMarkup, width, height) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        background: transparent;
      }

      body {
        display: grid;
        place-items: stretch;
      }

      svg {
        display: block;
        width: ${width}px;
        height: ${height}px;
      }
    </style>
  </head>
  <body>${svgMarkup}</body>
</html>`;
}

async function waitForPaint(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      })
  );
}

async function pauseAtTime(page, timeMs) {
  await page.evaluate((targetTimeMs) => {
    const svg = document.querySelector("svg");
    const animations = svg?.getAnimations?.({ subtree: true }) ?? document.getAnimations();

    for (const animation of animations) {
      animation.pause();
      animation.currentTime = targetTimeMs;
    }
  }, timeMs);

  await waitForPaint(page);
}

async function clearFrameDirectory(frameDirectory, framesRoot) {
  assertWithinRoot(framesRoot, frameDirectory);
  await fs.mkdir(frameDirectory, { recursive: true });

  const entries = await fs.readdir(frameDirectory, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && FRAME_FILE_RE.test(entry.name))
      .map((entry) => fs.unlink(path.join(frameDirectory, entry.name)))
  );
}

async function renderFrames(page, frameDirectory, svgMarkup, width, height, frameTimes) {
  await page.setViewport({ deviceScaleFactor: 1, height, width });
  await page.setContent(createSnapshotHtml(svgMarkup, width, height), {
    waitUntil: "load",
  });

  await pauseAtTime(page, 0);

  for (let index = 0; index < frameTimes.length; index += 1) {
    const frameNumber = String(index).padStart(4, "0");
    const framePath = path.join(frameDirectory, `frame-${frameNumber}.png`);

    await pauseAtTime(page, frameTimes[index]);
    await page.screenshot({
      omitBackground: true,
      path: framePath,
      type: "png",
    });
  }
}

function runProcess(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: PROJECT_ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stderr = "";
    let stdout = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stderr, stdout });
        return;
      }

      reject(
        new Error(
          `${path.basename(command)} exited with code ${code}.\n${stderr.trim() || stdout.trim()}`
        )
      );
    });
  });
}

async function encodeFramesAsApng(frameDirectory, outputPath, fps) {
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static did not resolve a local ffmpeg binary.");
  }

  const inputPattern = path.join(frameDirectory, "frame-%04d.png");

  await runProcess(ffmpegPath, [
    "-y",
    "-framerate",
    `${fps}`,
    "-i",
    inputPattern,
    "-plays",
    "0",
    "-compression_level",
    "9",
    outputPath,
  ]);
}

async function exportAssetApng(page, kind, item) {
  const spec = WINK_SPECS[kind];
  const paths = getWinkPaths(kind);

  if (!item.svg) {
    throw new Error("Missing SVG source file.");
  }

  const svgFilePath = path.join(paths.svgDir, item.svg.fileName);
  const frameDirectory = path.join(paths.framesDir, item.id);
  const outputPath = path.join(paths.apngDir, `${item.id}.apng`);
  const durationMs = item.durationMs ?? DEFAULT_DURATION_MS;
  const fps = spec.apngFrameRate || RECOMMENDED_APNG_FPS;
  const frameCount = durationToFrameCount(durationMs, fps);
  const frameTimes = createFrameTimes(durationMs, frameCount);

  assertWithinRoot(paths.framesDir, frameDirectory);
  assertWithinRoot(paths.apngDir, outputPath);

  await clearFrameDirectory(frameDirectory, paths.framesDir);
  await fs.mkdir(paths.apngDir, { recursive: true });

  const svgMarkup = await fs.readFile(svgFilePath, "utf8");

  await renderFrames(page, frameDirectory, svgMarkup, item.width, item.height, frameTimes);
  await encodeFramesAsApng(frameDirectory, outputPath, fps);

  const apngStat = await fs.stat(outputPath);
  return {
    bytes: apngStat.size,
    durationMs,
    file: relativeToProject(outputPath),
    fps,
    frameCount,
  };
}

async function main() {
  const { kind, only } = parseArgs(process.argv.slice(2));
  const kinds = kind === "all" ? WINK_KINDS : [kind];
  const invalidKinds = kinds.filter((value) => !WINK_SPECS[value]);

  if (invalidKinds.length > 0) {
    throw new Error(`Unsupported kind(s): ${invalidKinds.join(", ")}`);
  }

  for (const nextKind of kinds) {
    await ensureWinkStructure(nextKind);
  }

  const browserPath = await findBrowserExecutable();
  const browser = await puppeteer.launch({
    args: ["--allow-file-access-from-files", "--disable-gpu"],
    executablePath: browserPath,
    headless: true,
  });

  const page = await browser.newPage();
  const failures = [];
  const successes = [];

  try {
    for (const nextKind of kinds) {
      const group = await scanWinkKind(nextKind);
      const items = group.items
        .filter((item) => item.svg)
        .filter((item) => !only || only.includes(item.id))
        .sort((left, right) => sortIds(left.id, right.id));

      if (items.length === 0) {
        console.log(`No SVG assets found for ${nextKind}.`);
        continue;
      }

      console.log(`Exporting ${items.length} ${nextKind} APNG fallback files...`);

      for (const item of items) {
        try {
          const result = await exportAssetApng(page, nextKind, item);
          successes.push({ id: item.id, kind: nextKind, ...result });
          console.log(
            `  OK ${nextKind}/${item.id} -> ${result.file} (${result.frameCount} frames @ ${result.fps} FPS)`
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          failures.push(`${nextKind}/${item.id}: ${message}`);
          console.error(`  FAIL ${nextKind}/${item.id}: ${message}`);
        }
      }
    }
  } finally {
    await page.close();
    await browser.close();
  }

  const manifest = await writeWinksManifest();
  console.log(
    `Updated wink manifest at ${relativeToProject(path.join(PROJECT_ROOT, "public", "winks", "manifest.json"))}.`
  );

  if (failures.length > 0) {
    console.error("\nAPNG export finished with failures:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
  } else {
    console.log(
      `Exported ${successes.length} APNG files across ${Object.keys(manifest.groups).length} wink groups.`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
