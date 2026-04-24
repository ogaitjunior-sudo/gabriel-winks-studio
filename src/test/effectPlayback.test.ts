import { describe, expect, it } from "vitest";

import {
  applyPlaybackSpeed,
  formatRuntime,
  parseCssTimeToMs,
  scaleAnimationTimings,
  stripPlaybackMetadata,
} from "@/lib/effectPlayback";

describe("effect playback helpers", () => {
  it("scales animation durations and delays from the base style", () => {
    const style =
      "transform-origin: 960px 540px; animation: wink-burst 2.4s ease-out infinite; animation-delay: 0.4s;";

    expect(scaleAnimationTimings(style, 2)).toContain("wink-burst 1.2s ease-out infinite");
    expect(scaleAnimationTimings(style, 2)).toContain("animation-delay: 0.2s");
    expect(scaleAnimationTimings(style, 0.5)).toContain("wink-burst 4.8s ease-out infinite");
  });

  it("reapplies speed changes without compounding previous scaling", () => {
    document.body.innerHTML =
      '<svg><g style="animation: wink-burst 2.4s ease-out infinite; animation-delay: 0.4s;"></g></svg>';

    const svg = document.querySelector("svg") as SVGSVGElement;
    const group = svg.querySelector("g");

    if (!group) {
      throw new Error("Expected test group to exist.");
    }

    applyPlaybackSpeed(svg, 2);
    expect(group.getAttribute("style")).toContain("1.2s");
    expect(group.getAttribute("style")).toContain("0.2s");

    applyPlaybackSpeed(svg, 0.5);
    expect(group.getAttribute("style")).toContain("4.8s");
    expect(group.getAttribute("style")).toContain("0.8s");

    stripPlaybackMetadata(svg);
    expect(group.hasAttribute("data-base-style")).toBe(false);
  });

  it("parses and formats runtime values for single-run playback", () => {
    expect(parseCssTimeToMs("4.2s")).toBe(4200);
    expect(parseCssTimeToMs("350ms")).toBe(350);
    expect(parseCssTimeToMs("invalid")).toBe(0);
    expect(formatRuntime("4.2s", 1.4)).toBe("3s");
  });
});
