import { describe, expect, it } from "vitest";

import {
  calculateApngFrameCount,
  findWinkItem,
  formatAssetSize,
  getApngStatusLabels,
  getApngTechnicalInfo,
  getExpectedWinkAssetPath,
  getExpectedWinkFileName,
  resolveApngFallbackState,
  type WinksManifest,
} from "@/lib/winkManifest";

const manifest: WinksManifest = {
  generatedAt: "2026-04-24T00:00:00.000Z",
  groups: {
    chat: {
      edgeGuidance: "Avoid the edges.",
      height: 1024,
      items: [],
      kind: "chat",
      label: "Gabriel Winks Chat",
      safeArea: "centered",
      safeAreaGuidance: "Keep key action centered.",
      width: 768,
    },
    effect: {
      edgeGuidance: null,
      height: 1080,
      items: [
        {
          apng: null,
          aspectRatio: "16:9",
          category: "Fireworks",
          durationMs: 2400,
          edgeGuidance: null,
          height: 1080,
          id: "fw-burst",
          kind: "effect",
          name: "Fireworks Burst",
          safeArea: "centered",
          safeAreaGuidance: "Keep the burst centered.",
          svg: {
            bytes: 1234,
            fileName: "fw-burst.svg",
            path: "/winks/effect/svg/fw-burst.svg",
            sizeLabel: "1.2 KB",
          },
          typeLabel: "Overlay / Full Screen",
          viewBox: "0 0 1920 1080",
          width: 1920,
        },
      ],
      kind: "effect",
      label: "Gabriel Winks Effects",
      safeArea: "centered",
      safeAreaGuidance: "Keep key action centered.",
      width: 1920,
    },
  },
  recommendations: {
    cc213: true,
    fallbackFormat: "apng",
    loop: "infinite",
    primaryFormat: "svg-animation",
    recommendedApngFps: 15,
    recommendedDurationMs: {
      max: 4000,
      min: 2000,
    },
    transparencyRequired: true,
  },
  schemaVersion: 1,
  tooling: {
    encoder: "ffmpeg-static",
    fallbackFormat: "apng",
    optionalOptimizers: {
      oxipng: false,
      pngquant: false,
    },
    primaryFormat: "svg-animation",
    renderer: "puppeteer-core + system Chrome",
  },
};

describe("wink manifest helpers", () => {
  it("finds an exported asset by kind and id", () => {
    expect(findWinkItem(manifest, "effect", "fw-burst")?.name).toBe("Fireworks Burst");
    expect(findWinkItem(manifest, "chat", "missing")).toBeUndefined();
  });

  it("falls back when a file size label is not available yet", () => {
    expect(formatAssetSize("12.4 KB")).toBe("12.4 KB");
    expect(formatAssetSize(null)).toBe("Pending export");
  });

  it("calculates APNG frame counts and technical info from duration and fps", () => {
    expect(calculateApngFrameCount(3600, 15)).toBe(54);
    expect(
      getApngTechnicalInfo({
        durationMs: 3600,
        fps: 15,
        frameCount: null,
        sizeLabel: "420 KB",
      })
    ).toEqual(["3600 ms", "15 FPS", "54 frames", "420 KB"]);
  });

  it("derives expected APNG paths and ready state from the manifest item", () => {
    const item = findWinkItem(manifest, "effect", "fw-burst");

    expect(getExpectedWinkFileName("fw-burst", "apng")).toBe("fw-burst.apng");
    expect(getExpectedWinkAssetPath("effect", "apng", "fw-burst")).toBe(
      "/winks/effect/apng/fw-burst.apng"
    );
    expect(resolveApngFallbackState({ asset: item })).toBe("pending");
    expect(getApngStatusLabels("ready")).toContain("Ready");
  });
});
