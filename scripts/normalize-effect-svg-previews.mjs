import { normalizeWinkSvgDirectory, normalizeWinkSvgFiles, listWinkSvgFiles } from "./normalize-wink-svgs.mjs";

export async function listEffectSvgFiles() {
  return listWinkSvgFiles("effect");
}

export async function normalizeEffectSvgFiles(filePaths) {
  return normalizeWinkSvgFiles("effect", filePaths);
}

export async function normalizeEffectSvgDirectory() {
  return normalizeWinkSvgDirectory("effect");
}
