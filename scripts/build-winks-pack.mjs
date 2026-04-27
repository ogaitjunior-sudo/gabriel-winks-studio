import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

import { WINKS_ROOT, relativeToProject } from "./wink-config.mjs";

const DOWNLOADS_ROOT = path.join(WINKS_ROOT, "downloads");
const STAGE_ROOT = path.join(DOWNLOADS_ROOT, "gabriel-winks-full-pack");
const ZIP_PATH = path.join(DOWNLOADS_ROOT, "gabriel-winks-full-pack.zip");

function runPowerShell(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      ["-NoProfile", "-Command", command],
      {
        cwd: WINKS_ROOT,
        stdio: ["ignore", "pipe", "pipe"],
      }
    );

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
          `PowerShell exited with code ${code}.\n${stderr.trim() || stdout.trim()}`
        )
      );
    });
  });
}

async function copyDirectory(sourcePath, targetPath) {
  await fs.cp(sourcePath, targetPath, {
    filter: (nextPath) => path.basename(nextPath) !== ".gitkeep",
    force: true,
    recursive: true,
  });
}

async function main() {
  await fs.rm(STAGE_ROOT, { force: true, recursive: true });
  await fs.rm(ZIP_PATH, { force: true });
  await fs.mkdir(DOWNLOADS_ROOT, { recursive: true });

  await copyDirectory(path.join(WINKS_ROOT, "effect", "svg"), path.join(STAGE_ROOT, "effect", "svg"));
  await copyDirectory(path.join(WINKS_ROOT, "effect", "apng"), path.join(STAGE_ROOT, "effect", "apng"));
  await copyDirectory(path.join(WINKS_ROOT, "chat", "svg"), path.join(STAGE_ROOT, "chat", "svg"));
  await copyDirectory(path.join(WINKS_ROOT, "chat", "apng"), path.join(STAGE_ROOT, "chat", "apng"));
  await fs.copyFile(path.join(WINKS_ROOT, "manifest.json"), path.join(STAGE_ROOT, "manifest.json"));

  await runPowerShell(
    `Compress-Archive -LiteralPath '${STAGE_ROOT}' -DestinationPath '${ZIP_PATH}' -Force`
  );

  await fs.rm(STAGE_ROOT, { force: true, recursive: true });

  console.log(`Wrote ${relativeToProject(ZIP_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
