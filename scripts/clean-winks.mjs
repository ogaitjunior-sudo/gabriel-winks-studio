import fs from "node:fs/promises";
import path from "node:path";

import {
  WINK_KINDS,
  assertWithinRoot,
  ensureWinkStructure,
  getWinkPaths,
  relativeToProject,
} from "./wink-config.mjs";
import { writeWinksManifest } from "./wink-manifest.mjs";

function parseArgs(argv) {
  const targetArgIndex = argv.indexOf("--target");
  const kindArgIndex = argv.indexOf("--kind");

  return {
    kind: kindArgIndex >= 0 ? argv[kindArgIndex + 1] ?? "all" : "all",
    target: targetArgIndex >= 0 ? argv[targetArgIndex + 1] ?? "all" : "all",
  };
}

async function cleanFrameDirectories(paths) {
  const entries = await fs.readdir(paths.framesDir, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const targetPath = path.join(paths.framesDir, entry.name);
        assertWithinRoot(paths.framesDir, targetPath);
        await fs.rm(targetPath, { force: true, recursive: true });
      })
  );
}

async function cleanApngFiles(paths) {
  const entries = await fs.readdir(paths.apngDir, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".apng")
      .map(async (entry) => {
        const targetPath = path.join(paths.apngDir, entry.name);
        assertWithinRoot(paths.apngDir, targetPath);
        await fs.unlink(targetPath);
      })
  );
}

async function main() {
  const { kind, target } = parseArgs(process.argv.slice(2));
  const kinds = kind === "all" ? WINK_KINDS : [kind];

  if (!["all", "apng", "frames"].includes(target)) {
    throw new Error(`Unsupported clean target "${target}".`);
  }

  for (const nextKind of kinds) {
    const paths = await ensureWinkStructure(nextKind);

    if (target === "all" || target === "frames") {
      await cleanFrameDirectories(paths);
      console.log(`Cleaned frame directories in ${relativeToProject(paths.framesDir)}`);
    }

    if (target === "all" || target === "apng") {
      await cleanApngFiles(paths);
      console.log(`Cleaned APNG files in ${relativeToProject(paths.apngDir)}`);
    }
  }

  await writeWinksManifest();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
