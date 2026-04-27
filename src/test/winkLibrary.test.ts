import { describe, expect, it } from "vitest";

import {
  WINK_LIBRARY_ALL_FILTER,
  WINK_LIBRARY_CHAT_FILTER,
  WINK_LIBRARY_EFFECT_FILTER,
  WINK_LIBRARY_OVERVIEW_FILTER,
  filterWinkLibraryItems,
  flattenWinkLibraryItems,
  getWinkLibraryCategories,
  getWinkLibraryCategoryCounts,
  getWinkLibraryTagCounts,
  getWinkLibrarySubgroupDescription,
  groupWinkLibraryItems,
  pickFeaturedWinkLibraryItems,
} from "@/lib/winkLibrary";
import type { WinksManifest } from "@/lib/winkManifest";

const manifest: WinksManifest = {
  generatedAt: "2026-04-26T00:00:00.000Z",
  groups: {
    chat: {
      edgeGuidance: "Avoid edges.",
      height: 1024,
      items: [
        {
          apng: {
            bytes: 4567,
            fileName: "birthday-mega-party.apng",
            fps: 15,
            frameCount: 54,
            path: "/winks/chat/apng/birthday-mega-party.apng",
            sizeLabel: "4.5 KB",
            transparent: true,
          },
          aspectRatio: "3:4",
          category: "Happy Birthday",
          durationMs: 3600,
          edgeGuidance: "Avoid edges.",
          height: 1024,
          id: "birthday-mega-party",
          kind: "chat",
          name: "Birthday Mega Party",
          safeArea: "centered",
          safeAreaGuidance: "Keep key action centered.",
          svg: {
            bytes: 3210,
            fileName: "birthday-mega-party.svg",
            path: "/winks/chat/svg/birthday-mega-party.svg",
            sizeLabel: "3.1 KB",
          },
          typeLabel: "Portrait / Chat Overlay",
          viewBox: "0 0 768 1024",
          width: 768,
        },
      ],
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
          apng: {
            bytes: 4567,
            fileName: "countdown-pop-bingo.apng",
            fps: 15,
            frameCount: 45,
            path: "/winks/effect/apng/countdown-pop-bingo.apng",
            sizeLabel: "4.5 KB",
            transparent: true,
          },
          aspectRatio: "16:9",
          category: "Countdown",
          durationMs: 3000,
          edgeGuidance: null,
          height: 1080,
          id: "countdown-pop-bingo",
          kind: "effect",
          name: "Countdown Pop Bingo",
          safeArea: "centered",
          safeAreaGuidance: "Keep key action centered.",
          svg: {
            bytes: 3210,
            fileName: "countdown-pop-bingo.svg",
            path: "/winks/effect/svg/countdown-pop-bingo.svg",
            sizeLabel: "3.1 KB",
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

describe("winkLibrary helpers", () => {
  it("flattens manifest items with resolved asset paths", () => {
    const items = flattenWinkLibraryItems(manifest);

    expect(items).toHaveLength(2);
    expect(items[0].svgPath).toBe("/winks/effect/svg/countdown-pop-bingo.svg");
    expect(items[0].apngPath).toBe("/winks/effect/apng/countdown-pop-bingo.apng");
    expect(items[0].subgroup).toBe("Bingo Reveal");
    expect(items[0].tags).toContain("win");
  });

  it("builds category filters, tag counts, and subgroup copy", () => {
    const items = flattenWinkLibraryItems(manifest);

    expect(getWinkLibraryCategories(items)).toEqual(["Countdown", "Happy Birthday"]);
    expect(getWinkLibraryCategoryCounts(items)).toEqual({
      Countdown: 1,
      "Happy Birthday": 1,
    });
    expect(getWinkLibraryTagCounts(items)).toEqual({
      all: 2,
      calm: 0,
      impact: 1,
      party: 1,
      premium: 1,
      reaction: 2,
      win: 1,
    });
    expect(getWinkLibrarySubgroupDescription("Countdown", "Bingo Reveal")).toContain(
      "countdown"
    );
  });

  it("filters, features, and groups manifest items for the library view", () => {
    const items = flattenWinkLibraryItems(manifest);

    expect(filterWinkLibraryItems(items, WINK_LIBRARY_OVERVIEW_FILTER, "")).toHaveLength(2);
    expect(filterWinkLibraryItems(items, WINK_LIBRARY_ALL_FILTER, "")).toHaveLength(2);
    expect(filterWinkLibraryItems(items, WINK_LIBRARY_CHAT_FILTER, "")).toHaveLength(1);
    expect(filterWinkLibraryItems(items, WINK_LIBRARY_EFFECT_FILTER, "")).toHaveLength(1);
    expect(filterWinkLibraryItems(items, WINK_LIBRARY_CHAT_FILTER, "birthday")).toHaveLength(1);
    expect(filterWinkLibraryItems(items, WINK_LIBRARY_CHAT_FILTER, "countdown")).toHaveLength(0);
    expect(filterWinkLibraryItems(items, WINK_LIBRARY_OVERVIEW_FILTER, "", "party")).toHaveLength(
      1
    );
    expect(
      filterWinkLibraryItems(items, WINK_LIBRARY_OVERVIEW_FILTER, "countdown", "party")
    ).toHaveLength(0);
    expect(filterWinkLibraryItems(items, "Countdown", "pop")).toHaveLength(1);
    expect(filterWinkLibraryItems(items, "Countdown", "birthday")).toHaveLength(0);
    expect(pickFeaturedWinkLibraryItems(items, 8).map((item) => item.name)).toEqual([
      "Countdown Pop Bingo",
      "Birthday Mega Party",
    ]);
    expect(groupWinkLibraryItems(items).map((group) => group.category)).toEqual([
      "Countdown",
      "Happy Birthday",
    ]);
    expect(groupWinkLibraryItems(items)[0]?.subgroups[0]?.subgroup).toBe("Bingo Reveal");
  });
});
