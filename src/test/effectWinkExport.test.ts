import { describe, expect, it } from "vitest";

import { EFFECTS } from "@/data/effects";
import {
  EFFECT_WINK_ASPECT_RATIO,
  EFFECT_WINK_FORMAT,
  EFFECT_WINK_HEIGHT,
  EFFECT_WINK_SAFE_AREA,
  EFFECT_WINK_TYPE,
  EFFECT_WINK_WIDTH,
  createEffectWinkMetadata,
} from "@/lib/effectWinkExport";

describe("effect wink export metadata", () => {
  it("creates production SVG metadata for every catalog effect", () => {
    const metadata = EFFECTS.map((effect) => createEffectWinkMetadata(effect));

    expect(metadata).toHaveLength(EFFECTS.length);

    for (const effect of metadata) {
      expect(effect.type).toBe(EFFECT_WINK_TYPE);
      expect(effect.format).toBe(EFFECT_WINK_FORMAT);
      expect(effect.width).toBe(EFFECT_WINK_WIDTH);
      expect(effect.height).toBe(EFFECT_WINK_HEIGHT);
      expect(effect.aspectRatio).toBe(EFFECT_WINK_ASPECT_RATIO);
      expect(effect.transparent).toBe(true);
      expect(effect.safeArea).toBe(EFFECT_WINK_SAFE_AREA);
      expect(effect.durationMs).toBeGreaterThan(0);
    }
  });
});
