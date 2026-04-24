import fs from "node:fs/promises";
import path from "node:path";

import * as esbuild from "esbuild";

const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"];
const INDEX_FILES = ["index.ts", "index.tsx", "index.js", "index.jsx", "index.mjs"];

async function resolveExistingPath(basePath) {
  for (const extension of EXTENSIONS) {
    const candidate = `${basePath}${extension}`;
    try {
      const stat = await fs.stat(candidate);
      if (stat.isFile()) return candidate;
    } catch {
      // Try the next extension.
    }
  }

  try {
    const stat = await fs.stat(basePath);
    if (!stat.isDirectory()) return null;
  } catch {
    return null;
  }

  for (const indexFile of INDEX_FILES) {
    const candidate = path.join(basePath, indexFile);
    try {
      const stat = await fs.stat(candidate);
      if (stat.isFile()) return candidate;
    } catch {
      // Try the next index filename.
    }
  }

  return null;
}

function aliasPlugin(projectRoot) {
  return {
    name: "effect-winks-alias",
    setup(build) {
      build.onResolve({ filter: /^@\// }, async (args) => {
        const resolved = await resolveExistingPath(
          path.join(projectRoot, "src", args.path.slice(2))
        );

        if (!resolved) {
          return { errors: [{ text: `Could not resolve ${args.path}` }] };
        }

        return { path: resolved };
      });
    },
  };
}

export async function loadEffectWinkModules(projectRoot) {
  const result = await esbuild.build({
    bundle: true,
    format: "esm",
    jsx: "automatic",
    jsxImportSource: "react",
    logLevel: "silent",
    platform: "node",
    plugins: [aliasPlugin(projectRoot)],
    sourcemap: false,
    stdin: {
      contents: `
        export { EFFECTS } from "./src/data/effects";
        export * from "./src/lib/effectWinkExport";
      `,
      loader: "ts",
      resolveDir: projectRoot,
      sourcefile: "effect-winks-entry.ts",
    },
    target: "es2020",
    write: false,
  });

  const bundle = result.outputFiles[0]?.text;
  if (!bundle) {
    throw new Error("Failed to build Gabriel Winks effect catalog bundle.");
  }

  const encoded = Buffer.from(bundle, "utf8").toString("base64");
  return import(`data:text/javascript;base64,${encoded}`);
}
