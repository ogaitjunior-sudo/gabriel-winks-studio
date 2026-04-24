import { describe, expect, it } from "vitest";

import { applyExportBackground } from "@/lib/exportSvg";

describe("export svg background helpers", () => {
  it("adds a chosen background rect to the exported svg", () => {
    document.body.innerHTML = '<svg viewBox="0 0 1920 1080"><defs></defs><circle cx="10" cy="10" r="5" /></svg>';

    const svg = document.querySelector("svg") as SVGSVGElement;
    applyExportBackground(svg, "black");

    const rect = svg.querySelector('rect[data-export-background="true"]');
    expect(rect).not.toBeNull();
    expect(rect?.getAttribute("fill")).toBe("#000000");
  });

  it("removes the export background when transparent is selected", () => {
    document.body.innerHTML = '<svg viewBox="0 0 1920 1080"><circle cx="10" cy="10" r="5" /></svg>';

    const svg = document.querySelector("svg") as SVGSVGElement;
    applyExportBackground(svg, "white");
    applyExportBackground(svg, "transparent");

    expect(svg.querySelector('[data-export-background="true"]')).toBeNull();
  });
});
