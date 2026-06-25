import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer-core";

import { WINK_SPECS, assertWithinRoot, getWinkPaths, relativeToProject } from "./wink-config.mjs";

const SVG_NS = "http://www.w3.org/2000/svg";
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';
const CONTENT_GROUP_ID = "content";
const LEGACY_NORMALIZED_WRAPPER_ATTR = "data-preview-normalized";
const LEGACY_NORMALIZED_WRAPPER_VALUES = new Set(["effect-safe-area", "chat-safe-area"]);
const LEGACY_NORMALIZED_CONTENT_ATTR = "data-preview-content";
const NON_SCENE_TAGS = new Set(["defs", "desc", "metadata", "style", "title"]);
const EDGE_FADE_ATTR = "data-wink-edge-fade";
const EDGE_FADE_MASK_ID = "wink-edge-fade-mask";
const EDGE_FADE_RATIO = 0.1;
const SAMPLE_FRACTIONS = [0, 0.12, 0.24, 0.38, 0.52, 0.68, 0.82];
const TARGET_FRAME_SCALE = {
  chat: 0.74,
  effect: 0.76,
};
const MAX_SCALE = {
  chat: 2.6,
  effect: 2.8,
};
const MIN_SCALE = 0.18;
const CHROME_CANDIDATES = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

function normalizeXmlSource(source) {
  return source.replace(/^\uFEFF/, "").replace(/^<\?xml[^>]*>\s*/i, "");
}

async function resolveChromeExecutable() {
  for (const candidate of CHROME_CANDIDATES) {
    if (!candidate) {
      continue;
    }

    try {
      const stat = await fs.stat(candidate);
      if (stat.isFile()) {
        return candidate;
      }
    } catch {
      // Try the next candidate.
    }
  }

  throw new Error(
    "Could not find a Chrome or Edge executable for SVG normalization. Set PUPPETEER_EXECUTABLE_PATH or CHROME_PATH."
  );
}

function parseArgs(argv) {
  const kinds = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--kind" && next) {
      kinds.push(
        ...next
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      );
      index += 1;
    }
  }

  return kinds.length > 0 ? kinds : ["effect", "chat"];
}

function isDirectExecution() {
  return process.argv[1] === fileURLToPath(import.meta.url);
}

export async function listWinkSvgFiles(kind) {
  if (!WINK_SPECS[kind]) {
    throw new Error(`Unsupported wink kind "${kind}".`);
  }

  const { root, svgDir } = getWinkPaths(kind);
  assertWithinRoot(root, svgDir);
  const entries = await fs.readdir(svgDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".svg")
    .map((entry) => path.join(svgDir, entry.name))
    .sort((left, right) => left.localeCompare(right, undefined, { sensitivity: "base" }));
}

async function normalizeSvgMarkup(page, kind, source, filePath) {
  const spec = WINK_SPECS[kind];
  const targetFrameScale = TARGET_FRAME_SCALE[kind] ?? 0.74;
  const targetWidth = spec.width;
  const targetHeight = spec.height;
  const inlineSvg = normalizeXmlSource(source);

  await page.setViewport({
    deviceScaleFactor: 1,
    height: targetHeight,
    width: targetWidth,
  });
  await page.setContent(
    `<html><body style="margin:0;background:transparent;">${inlineSvg}</body></html>`,
    { waitUntil: "load" }
  );

  const result = await page.evaluate(
    async ({
      contentGroupId,
      edgeFadeAttr,
      edgeFadeMaskId,
      edgeFadeRatio,
      legacyContentAttr,
      legacyWrapperAttr,
      legacyWrapperValues,
      maxScale,
      minScale,
      nonSceneTags,
      sampleFractions,
      svgNs,
      targetCenterX,
      targetCenterY,
      targetFrameHeight,
      targetFrameWidth,
      targetHeight,
      targetViewBox,
      targetWidth,
    }) => {
      const svg = document.querySelector("svg");
      if (!(svg instanceof SVGSVGElement)) {
        throw new Error("SVG root not found.");
      }

      function nextAnimationFrame() {
        return new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        });
      }

      function unwrapNormalizedGroups() {
        const directChildren = Array.from(svg.children);
        const wrappers = directChildren.filter((child) => {
          if (!(child instanceof SVGGElement)) {
            return false;
          }

          if (child.id === contentGroupId) {
            return true;
          }

          const legacyValue = child.getAttribute(legacyWrapperAttr);
          return legacyValue ? legacyWrapperValues.includes(legacyValue) : false;
        });

        for (const wrapper of wrappers) {
          const legacyContent = wrapper.querySelector(
            `g[${legacyContentAttr}]`
          );
          const sourceNode =
            wrapper.id === contentGroupId
              ? wrapper
              : legacyContent instanceof SVGGElement
                ? legacyContent
                : wrapper;
          const restoredNodes = Array.from(sourceNode.childNodes);

          for (const node of restoredNodes) {
            svg.insertBefore(node, wrapper);
          }

          wrapper.remove();
        }
      }

      function removeExistingEdgeFade() {
        for (const node of Array.from(svg.querySelectorAll(`[${edgeFadeAttr}]`))) {
          node.remove();
        }

        for (const node of Array.from(svg.querySelectorAll("[mask]"))) {
          if (node.getAttribute("mask") === `url(#${edgeFadeMaskId})`) {
            node.removeAttribute("mask");
          }
        }
      }

      function createSvgElement(name, attributes = {}) {
        const element = document.createElementNS(svgNs, name);

        for (const [attribute, value] of Object.entries(attributes)) {
          element.setAttribute(attribute, `${value}`);
        }

        return element;
      }

      function appendStop(gradient, offset, color) {
        gradient.appendChild(createSvgElement("stop", { offset, "stop-color": color }));
      }

      function appendLinearGradient(defs, id, attributes, firstColor, secondColor) {
        const gradient = createSvgElement("linearGradient", {
          ...attributes,
          [edgeFadeAttr]: "true",
          id,
        });
        appendStop(gradient, "0%", firstColor);
        appendStop(gradient, "100%", secondColor);
        defs.appendChild(gradient);
      }

      function appendRadialGradient(defs, id, attributes) {
        const gradient = createSvgElement("radialGradient", {
          ...attributes,
          [edgeFadeAttr]: "true",
          id,
        });
        appendStop(gradient, "0%", "#fff");
        appendStop(gradient, "100%", "#000");
        defs.appendChild(gradient);
      }

      function appendMaskRect(mask, x, y, width, height, fill) {
        mask.appendChild(
          createSvgElement("rect", {
            fill,
            height,
            width,
            x,
            y,
          })
        );
      }

      function applyEdgeFadeMask(contentGroup) {
        const fadeX = targetWidth * edgeFadeRatio;
        const fadeY = targetHeight * edgeFadeRatio;
        const centerWidth = Math.max(targetWidth - fadeX * 2, 1);
        const centerHeight = Math.max(targetHeight - fadeY * 2, 1);
        let defs = Array.from(svg.children).find((child) => child.localName === "defs");

        if (!defs) {
          defs = createSvgElement("defs");
          svg.insertBefore(defs, svg.firstChild);
        }

        const ids = {
          bottom: `${edgeFadeMaskId}-bottom`,
          bottomLeft: `${edgeFadeMaskId}-bottom-left`,
          bottomRight: `${edgeFadeMaskId}-bottom-right`,
          left: `${edgeFadeMaskId}-left`,
          right: `${edgeFadeMaskId}-right`,
          top: `${edgeFadeMaskId}-top`,
          topLeft: `${edgeFadeMaskId}-top-left`,
          topRight: `${edgeFadeMaskId}-top-right`,
        };

        appendLinearGradient(defs, ids.top, { x1: 0, x2: 0, y1: 0, y2: 1 }, "#000", "#fff");
        appendLinearGradient(defs, ids.bottom, { x1: 0, x2: 0, y1: 0, y2: 1 }, "#fff", "#000");
        appendLinearGradient(defs, ids.left, { x1: 0, x2: 1, y1: 0, y2: 0 }, "#000", "#fff");
        appendLinearGradient(defs, ids.right, { x1: 0, x2: 1, y1: 0, y2: 0 }, "#fff", "#000");
        appendRadialGradient(defs, ids.topLeft, { cx: "100%", cy: "100%", r: "100%" });
        appendRadialGradient(defs, ids.topRight, { cx: "0%", cy: "100%", r: "100%" });
        appendRadialGradient(defs, ids.bottomLeft, { cx: "100%", cy: "0%", r: "100%" });
        appendRadialGradient(defs, ids.bottomRight, { cx: "0%", cy: "0%", r: "100%" });

        const mask = createSvgElement("mask", {
          [edgeFadeAttr]: "true",
          height: targetHeight,
          id: edgeFadeMaskId,
          maskContentUnits: "userSpaceOnUse",
          maskUnits: "userSpaceOnUse",
          "mask-type": "alpha",
          width: targetWidth,
          x: 0,
          y: 0,
        });

        appendMaskRect(mask, 0, 0, targetWidth, targetHeight, "#000");
        appendMaskRect(mask, fadeX, fadeY, centerWidth, centerHeight, "#fff");
        appendMaskRect(mask, fadeX, 0, centerWidth, fadeY, `url(#${ids.top})`);
        appendMaskRect(mask, fadeX, targetHeight - fadeY, centerWidth, fadeY, `url(#${ids.bottom})`);
        appendMaskRect(mask, 0, fadeY, fadeX, centerHeight, `url(#${ids.left})`);
        appendMaskRect(mask, targetWidth - fadeX, fadeY, fadeX, centerHeight, `url(#${ids.right})`);
        appendMaskRect(mask, 0, 0, fadeX, fadeY, `url(#${ids.topLeft})`);
        appendMaskRect(mask, targetWidth - fadeX, 0, fadeX, fadeY, `url(#${ids.topRight})`);
        appendMaskRect(mask, 0, targetHeight - fadeY, fadeX, fadeY, `url(#${ids.bottomLeft})`);
        appendMaskRect(mask, targetWidth - fadeX, targetHeight - fadeY, fadeX, fadeY, `url(#${ids.bottomRight})`);

        defs.appendChild(mask);
        contentGroup.setAttribute("mask", `url(#${edgeFadeMaskId})`);
      }

      function getSceneNodes() {
        return Array.from(svg.childNodes).filter((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent?.trim().length;
          }

          if (node.nodeType !== Node.ELEMENT_NODE) {
            return false;
          }

          return !nonSceneTags.includes(node.nodeName.toLowerCase());
        });
      }

      function rectToBounds(rect) {
        return {
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          top: rect.top,
          width: rect.width,
        };
      }

      function mergeBounds(bounds, nextBounds) {
        if (!bounds) {
          return { ...nextBounds };
        }

        return {
          bottom: Math.max(bounds.bottom, nextBounds.bottom),
          height: 0,
          left: Math.min(bounds.left, nextBounds.left),
          right: Math.max(bounds.right, nextBounds.right),
          top: Math.min(bounds.top, nextBounds.top),
          width: 0,
        };
      }

      function finalizeBounds(bounds) {
        if (!bounds) {
          return null;
        }

        return {
          ...bounds,
          height: Math.max(bounds.bottom - bounds.top, 1),
          width: Math.max(bounds.right - bounds.left, 1),
          x: bounds.left,
          y: bounds.top,
        };
      }

      unwrapNormalizedGroups();
      removeExistingEdgeFade();

      const sceneNodes = getSceneNodes();

      if (sceneNodes.length === 0) {
        svg.setAttribute("viewBox", targetViewBox);
        svg.setAttribute("width", `${targetWidth}`);
        svg.setAttribute("height", `${targetHeight}`);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        return {
          bounds: null,
          markup: new XMLSerializer().serializeToString(svg),
          scale: 1,
        };
      }

      const measureGroup = document.createElementNS(svgNs, "g");
      measureGroup.setAttribute("data-framing-measure", "true");

      for (const node of sceneNodes) {
        measureGroup.appendChild(node);
      }

      svg.appendChild(measureGroup);

      const animations = svg.getAnimations?.({ subtree: true }) ?? [];
      for (const animation of animations) {
        animation.pause();
      }

      let animatedBounds = null;

      if (animations.length > 0) {
        for (const fraction of sampleFractions) {
          for (const animation of animations) {
            const timing = animation.effect?.getTiming?.();
            const duration =
              typeof timing?.duration === "number" && Number.isFinite(timing.duration)
                ? timing.duration
                : 0;
            animation.currentTime = duration > 0 ? duration * fraction : 0;
          }

          await nextAnimationFrame();
          const rect = measureGroup.getBoundingClientRect();

          if (rect.width > 0 && rect.height > 0) {
            animatedBounds = mergeBounds(animatedBounds, rectToBounds(rect));
          }
        }
      }

      const finalizedAnimatedBounds = finalizeBounds(animatedBounds);
      const staticBBox = measureGroup.getBBox();
      const staticBounds = {
        height: Math.max(staticBBox.height, 1),
        width: Math.max(staticBBox.width, 1),
        x: staticBBox.x,
        y: staticBBox.y,
      };
      const framingBounds = finalizedAnimatedBounds ?? staticBounds;
      const boundsCenterX = framingBounds.x + framingBounds.width / 2;
      const boundsCenterY = framingBounds.y + framingBounds.height / 2;
      const rawScale = Math.min(
        targetFrameWidth / Math.max(framingBounds.width, 1),
        targetFrameHeight / Math.max(framingBounds.height, 1)
      );
      const scale = Math.min(Math.max(rawScale, minScale), maxScale);

      const contentGroup = document.createElementNS(svgNs, "g");
      contentGroup.setAttribute("id", contentGroupId);
      contentGroup.setAttribute(
        "transform",
        `translate(${targetCenterX} ${targetCenterY}) scale(${scale}) translate(${-boundsCenterX} ${-boundsCenterY})`
      );

      while (measureGroup.firstChild) {
        contentGroup.appendChild(measureGroup.firstChild);
      }

      measureGroup.remove();
      svg.appendChild(contentGroup);
      applyEdgeFadeMask(contentGroup);

      svg.setAttribute("viewBox", targetViewBox);
      svg.setAttribute("width", `${targetWidth}`);
      svg.setAttribute("height", `${targetHeight}`);
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

      return {
        bounds: framingBounds,
        markup: new XMLSerializer().serializeToString(svg),
        scale,
      };
    },
    {
      contentGroupId: CONTENT_GROUP_ID,
      edgeFadeAttr: EDGE_FADE_ATTR,
      edgeFadeMaskId: EDGE_FADE_MASK_ID,
      edgeFadeRatio: EDGE_FADE_RATIO,
      legacyContentAttr: LEGACY_NORMALIZED_CONTENT_ATTR,
      legacyWrapperAttr: LEGACY_NORMALIZED_WRAPPER_ATTR,
      legacyWrapperValues: [...LEGACY_NORMALIZED_WRAPPER_VALUES],
      maxScale: MAX_SCALE[kind] ?? 2.4,
      minScale: MIN_SCALE,
      nonSceneTags: [...NON_SCENE_TAGS],
      sampleFractions: SAMPLE_FRACTIONS,
      svgNs: SVG_NS,
      targetCenterX: spec.width / 2,
      targetCenterY: spec.height / 2,
      targetFrameHeight: spec.height * targetFrameScale,
      targetFrameWidth: spec.width * targetFrameScale,
      targetHeight: spec.height,
      targetViewBox: spec.viewBox,
      targetWidth: spec.width,
    }
  );

  return {
    ...result,
    markup: `${XML_HEADER}${result.markup}\n`,
    path: filePath,
  };
}

export async function normalizeWinkSvgFiles(kind, filePaths) {
  if (!WINK_SPECS[kind]) {
    throw new Error(`Unsupported wink kind "${kind}".`);
  }

  if (!filePaths.length) {
    return [];
  }

  const chromeExecutable = await resolveChromeExecutable();
  const browser = await puppeteer.launch({
    args: ["--allow-file-access-from-files", "--disable-gpu"],
    executablePath: chromeExecutable,
    headless: "new",
    protocolTimeout: 120000,
    timeout: 120000,
  });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);
    page.setDefaultTimeout(120000);
    const stats = [];

    for (const filePath of filePaths) {
      const source = await fs.readFile(filePath, "utf8");
      const normalized = await normalizeSvgMarkup(page, kind, source, filePath);
      await fs.writeFile(filePath, normalized.markup, "utf8");
      stats.push({
        bounds: normalized.bounds,
        kind,
        path: filePath,
        scale: normalized.scale,
      });
    }

    await page.close();
    return stats;
  } finally {
    await browser.close();
  }
}

export async function normalizeWinkSvgDirectory(kind) {
  const filePaths = await listWinkSvgFiles(kind);
  return normalizeWinkSvgFiles(kind, filePaths);
}

export async function normalizeAllWinkSvgDirectories(kinds = ["effect", "chat"]) {
  const normalizedKinds = kinds.filter((kind, index) => kinds.indexOf(kind) === index);
  const allStats = [];

  for (const kind of normalizedKinds) {
    allStats.push(...(await normalizeWinkSvgDirectory(kind)));
  }

  return allStats;
}

async function main() {
  const kinds = parseArgs(process.argv.slice(2));
  const invalidKinds = kinds.filter((kind) => !WINK_SPECS[kind]);

  if (invalidKinds.length > 0) {
    throw new Error(`Unsupported kind(s): ${invalidKinds.join(", ")}`);
  }

  const stats = await normalizeAllWinkSvgDirectories(kinds);

  for (const kind of kinds) {
    const kindStats = stats.filter((entry) => entry.kind === kind);
    console.log(
      `Normalized ${kindStats.length} ${kind} SVG files inside ${relativeToProject(
        getWinkPaths(kind).svgDir
      )}.`
    );
  }

  const sample = stats
    .slice(0, 6)
    .map((entry) => `${path.basename(entry.path)} x${entry.scale.toFixed(2)}`)
    .join(", ");

  if (sample) {
    console.log(`Sample scales: ${sample}`);
  }
}

if (isDirectExecution()) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
