import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { applyPlaybackSpeed, stripPlaybackMetadata } from "@/lib/effectPlayback";
import {
  EFFECT_KEYFRAMES_CSS,
  EFFECT_WINK_HEIGHT,
  EFFECT_WINK_VIEW_BOX,
  EFFECT_WINK_WIDTH,
} from "@/lib/effectWinkExport";

export type ExportBackground = "transparent" | "black" | "white";

interface ExportSvgOptions {
  background?: ExportBackground;
  speed?: number;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getSvgBounds(svg: SVGSVGElement) {
  const viewBox = svg
    .getAttribute("viewBox")
    ?.trim()
    .split(/\s+/)
    .map((part) => Number.parseFloat(part));

  if (viewBox && viewBox.length === 4 && viewBox.every((part) => Number.isFinite(part))) {
    return {
      height: viewBox[3],
      width: viewBox[2],
      x: viewBox[0],
      y: viewBox[1],
    };
  }

  return { height: EFFECT_WINK_HEIGHT, width: EFFECT_WINK_WIDTH, x: 0, y: 0 };
}

export function applyExportBackground(svg: SVGSVGElement, background: ExportBackground) {
  for (const existingRect of svg.querySelectorAll('[data-export-background="true"]')) {
    existingRect.remove();
  }

  if (background === "transparent") return;

  const { height, width, x, y } = getSvgBounds(svg);
  const rect = svg.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("data-export-background", "true");
  rect.setAttribute("x", `${x}`);
  rect.setAttribute("y", `${y}`);
  rect.setAttribute("width", `${width}`);
  rect.setAttribute("height", `${height}`);
  rect.setAttribute("fill", background === "black" ? "#000000" : "#ffffff");

  const styleNode = Array.from(svg.childNodes).find(
    (node) => node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName.toLowerCase() === "style"
  );

  if (styleNode?.nextSibling) {
    svg.insertBefore(rect, styleNode.nextSibling);
    return;
  }

  if (styleNode) {
    svg.appendChild(rect);
    return;
  }

  svg.insertBefore(rect, svg.firstChild);
}

function prepareStandaloneSvg(
  svg: SVGSVGElement,
  speed: number,
  background: ExportBackground
) {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  if (!clone.getAttribute("viewBox")) {
    clone.setAttribute("viewBox", EFFECT_WINK_VIEW_BOX);
  }
  clone.setAttribute("width", `${EFFECT_WINK_WIDTH}`);
  clone.setAttribute("height", `${EFFECT_WINK_HEIGHT}`);
  clone.removeAttribute("class");

  applyPlaybackSpeed(clone, speed);
  stripPlaybackMetadata(clone);

  const styleEl = document.createElementNS("http://www.w3.org/2000/svg", "style");
  styleEl.textContent = EFFECT_KEYFRAMES_CSS;
  clone.insertBefore(styleEl, clone.firstChild);
  applyExportBackground(clone, background);

  return clone;
}

function serializeStandaloneSvg(
  svg: SVGSVGElement,
  speed: number,
  background: ExportBackground
) {
  const standaloneSvg = prepareStandaloneSvg(svg, speed, background);
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(standaloneSvg);
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n${source}`;
}

function downloadSvg(xml: string, name: string) {
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(name) || "effect"}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportEffectAsSvg(
  container: HTMLElement | null,
  name: string,
  options: ExportSvgOptions = {}
) {
  if (!container) return;

  const svg = container.querySelector("svg") as SVGSVGElement | null;
  if (!svg) return;

  const { background = "transparent", speed = 1 } = options;
  downloadSvg(serializeStandaloneSvg(svg, speed, background), name);
}

export function exportEffectComponentAsSvg(
  Component: ComponentType<{ playing: boolean }>,
  name: string,
  options: ExportSvgOptions = {}
) {
  const markup = renderToStaticMarkup(createElement(Component, { playing: true }));
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const svg =
    doc.documentElement.tagName.toLowerCase() === "svg"
      ? (doc.documentElement as SVGSVGElement)
      : (doc.querySelector("svg") as SVGSVGElement | null);

  if (!svg) return;

  const { background = "transparent", speed = 1 } = options;
  downloadSvg(serializeStandaloneSvg(svg, speed, background), name);
}
