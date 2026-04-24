import { describe, expect, it } from "vitest";

import { EFFECTS } from "@/data/effects";
import {
  ALL_EFFECTS_FILTER,
  filterEffects,
  groupEffectsByCategory,
} from "@/lib/effectCatalog";

describe("effect catalog helpers", () => {
  it("filters by category and free-text query", () => {
    const fireworks = filterEffects(EFFECTS, "Fireworks", "");
    expect(fireworks.every((effect) => effect.category === "Fireworks")).toBe(true);

    const searchResults = filterEffects(EFFECTS, ALL_EFFECTS_FILTER, "ultimate celebration");
    expect(searchResults.some((effect) => effect.id === "fw-ultimate")).toBe(true);

    const confetti = filterEffects(EFFECTS, "Confetti", "");
    expect(confetti.every((effect) => effect.category === "Confetti")).toBe(true);
  });

  it("groups results by category order and removes empty groups", () => {
    const grouped = groupEffectsByCategory(
      filterEffects(EFFECTS, ALL_EFFECTS_FILTER, "bingo")
    );

    expect(grouped).toHaveLength(1);
    expect(grouped[0].category).toBe("Bouncing Bingo Balls");
    expect(grouped[0].effects.length).toBeGreaterThan(0);
  });
});
