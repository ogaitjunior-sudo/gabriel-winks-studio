import fs from "node:fs/promises";
import path from "node:path";

import UPNG from "upng-js";

import {
  RECOMMENDED_APNG_FPS,
  RECOMMENDED_DURATION_MS,
  WINK_KINDS,
  WINK_SPECS,
  getWinkPaths,
  relativeToProject,
} from "./wink-config.mjs";
import {
  WINKS_MANIFEST_PATH,
  getProjectDocCandidates,
  parseSvgMetrics,
  toArrayBuffer,
  writeWinksManifest,
} from "./wink-manifest.mjs";

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function expectedFrameCount(durationMs, fps) {
  if (!durationMs || !Number.isFinite(durationMs) || !fps || !Number.isFinite(fps)) {
    return null;
  }

  return Math.max(2, Math.round((durationMs / 1000) * fps));
}

function ratioMatches(width, height, expectedWidth, expectedHeight, tolerance = 0.02) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || !height) {
    return false;
  }

  const actual = width / height;
  const expected = expectedWidth / expectedHeight;
  return Math.abs(actual - expected) <= tolerance;
}

function lineContainsUnsafeRecommendation(line) {
  const normalized = line.toLowerCase();
  const hasTarget = normalized.includes("gif") || normalized.includes("webm");
  const hasRecommendationWord =
    normalized.includes("recommend") ||
    normalized.includes("production") ||
    normalized.includes("fallback") ||
    normalized.includes("use ") ||
    normalized.includes("export");
  const hasNegativeContext =
    normalized.includes("avoid") ||
    normalized.includes("avoided") ||
    normalized.includes("do not") ||
    normalized.includes("don't") ||
    normalized.includes("not recommend") ||
    normalized.includes("not be recommended") ||
    normalized.includes("should not") ||
    normalized.includes("unreliable");

  return hasTarget && hasRecommendationWord && !hasNegativeContext;
}

async function validateDocumentation() {
  for (const docPath of getProjectDocCandidates()) {
    try {
      const contents = await fs.readFile(docPath, "utf8");
      const lines = contents.split(/\r?\n/g);

      lines.forEach((line, index) => {
        if (lineContainsUnsafeRecommendation(line)) {
          fail(
            `${relativeToProject(docPath)}:${index + 1} contains a GIF/WebM production recommendation.`
          );
        }
      });
    } catch (error) {
      if (error && typeof error === "object" && error.code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }
}

async function validateApngFile(item, apngFilePath) {
  const fileBuffer = await fs.readFile(apngFilePath);
  const decoded = UPNG.decode(toArrayBuffer(fileBuffer));
  const frames = UPNG.toRGBA8(decoded);
  const playCount = decoded.tabs?.acTL?.num_plays;
  const actualFrameCount = frames.length;
  const averageDelay =
    Array.isArray(decoded.frames) && decoded.frames.length > 0
      ? decoded.frames.reduce((sum, frame) => sum + (frame.delay || 0), 0) / decoded.frames.length
      : null;
  const expectedFrames = expectedFrameCount(item.durationMs, item.apng?.fps ?? RECOMMENDED_APNG_FPS);

  if (actualFrameCount < 2) {
    fail(`${item.kind}/${item.id}.apng must contain more than one frame.`);
  }

  if (playCount !== 0) {
    fail(`${item.kind}/${item.id}.apng must loop infinitely (num_plays must be 0).`);
  }

  if (item.apng?.frameCount !== actualFrameCount) {
    fail(
      `${item.kind}/${item.id}.apng manifest frameCount (${item.apng?.frameCount}) does not match the decoded APNG frame count (${actualFrameCount}).`
    );
  }

  if (expectedFrames && actualFrameCount !== expectedFrames) {
    fail(
      `${item.kind}/${item.id}.apng frame count (${actualFrameCount}) does not match the expected duration/FPS result (${expectedFrames}).`
    );
  }

  if (averageDelay && Math.abs(averageDelay - 1000 / RECOMMENDED_APNG_FPS) > 25) {
    warn(
      `${item.kind}/${item.id}.apng averages ${averageDelay.toFixed(
        1
      )} ms per frame instead of roughly ${Math.round(1000 / RECOMMENDED_APNG_FPS)} ms.`
    );
  }

  frames.forEach((frameBuffer, frameIndex) => {
    const rgba = new Uint8Array(frameBuffer);
    let hasTransparentPixel = false;

    for (let pixelIndex = 3; pixelIndex < rgba.length; pixelIndex += 4) {
      if (rgba[pixelIndex] < 255) {
        hasTransparentPixel = true;
        break;
      }
    }

    if (!hasTransparentPixel) {
      fail(`${item.kind}/${item.id}.apng frame ${frameIndex + 1} appears fully opaque.`);
    }
  });
}

async function validateKind(kind, manifest) {
  const spec = WINK_SPECS[kind];
  const paths = getWinkPaths(kind);
  const group = manifest.groups[kind];

  if (!group) {
    fail(`Manifest is missing the ${kind} group.`);
    return;
  }

  for (const item of group.items) {
    if (item.svg && !item.svg.sizeLabel) {
      fail(`${kind}/${item.id}.svg is missing a display size label in the manifest.`);
    }

    if (item.apng && !item.apng.sizeLabel) {
      fail(`${kind}/${item.id}.apng is missing a display size label in the manifest.`);
    }

    if (item.svg) {
      const expectedSvgFileName = `${item.id}.svg`;
      const expectedSvgPath = `/winks/${kind}/svg/${expectedSvgFileName}`;

      if (item.svg.fileName !== expectedSvgFileName) {
        fail(`${kind}/${item.id}.svg fileName must be ${expectedSvgFileName}.`);
      }

      if (item.svg.path !== expectedSvgPath) {
        fail(`${kind}/${item.id}.svg path must be ${expectedSvgPath}.`);
      }
    }

    if (item.svg && !item.apng) {
      fail(`${kind}/${item.id}.svg does not have a matching APNG fallback.`);
    }

    if (item.apng && !item.svg) {
      fail(`${kind}/${item.id}.apng does not have a matching SVG source.`);
    }

    if (item.apng && item.svg) {
      const svgBaseName = path.basename(item.svg.fileName, ".svg");
      const apngBaseName = path.basename(item.apng.fileName, ".apng");
      const expectedApngFileName = `${svgBaseName}.apng`;
      const expectedApngPath = `/winks/${kind}/apng/${expectedApngFileName}`;
      const expectedFrames = expectedFrameCount(item.durationMs, item.apng.fps);

      if (apngBaseName !== svgBaseName) {
        fail(`${kind}/${item.id}.apng must share the same base filename as its SVG source.`);
      }

      if (item.apng.fileName !== expectedApngFileName) {
        fail(`${kind}/${item.id}.apng fileName must be ${expectedApngFileName}.`);
      }

      if (item.apng.path !== expectedApngPath) {
        fail(`${kind}/${item.id}.apng path must be ${expectedApngPath}.`);
      }

      if (!expectedFrames) {
        fail(`${kind}/${item.id} is missing the duration or FPS needed to calculate APNG frames.`);
      } else if (item.apng.frameCount !== expectedFrames) {
        fail(
          `${kind}/${item.id}.apng frameCount (${item.apng.frameCount}) must equal durationSeconds * fps (${expectedFrames}).`
        );
      }
    }

    if (item.durationMs && item.durationMs < RECOMMENDED_DURATION_MS.min) {
      warn(`${kind}/${item.id} runs shorter than the recommended 2 seconds.`);
    }

    if (item.durationMs && item.durationMs > RECOMMENDED_DURATION_MS.max) {
      warn(`${kind}/${item.id} runs longer than the recommended 4 seconds.`);
    }

    if (!item.svg) {
      continue;
    }

    const svgFilePath = path.join(paths.svgDir, item.svg.fileName);
    const svgMetrics = parseSvgMetrics(await fs.readFile(svgFilePath, "utf8"), spec);

    if (!ratioMatches(svgMetrics.width, svgMetrics.height, spec.width, spec.height)) {
      fail(
        `${kind}/${item.id}.svg dimensions (${svgMetrics.width}x${svgMetrics.height}) do not match the ${spec.aspectRatio} artboard.`
      );
    }

    if (!ratioMatches(item.width, item.height, spec.width, spec.height)) {
      fail(
        `${kind}/${item.id} manifest dimensions (${item.width}x${item.height}) do not match the ${spec.aspectRatio} artboard.`
      );
    }

    if (item.apng) {
      const apngFilePath = path.join(paths.apngDir, item.apng.fileName);
      await validateApngFile(item, apngFilePath);
    }
  }
}

async function main() {
  const manifest = await writeWinksManifest();

  if (manifest.schemaVersion !== 1) {
    fail("Manifest schemaVersion must be 1.");
  }

  for (const kind of WINK_KINDS) {
    await validateKind(kind, manifest);
  }

  await validateDocumentation();

  if (warnings.length > 0) {
    console.warn("Validation warnings:");
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error(`Validation failed for ${relativeToProject(WINKS_MANIFEST_PATH)}:`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Validated wink SVG and APNG exports.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
