import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import type { WinksManifest } from "@/lib/winkManifest";

const manifest = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "public/winks/manifest.json"), "utf8")
) as WinksManifest;

const premiumEffectExpectations = [
  ["thumbs-up-premium-pulse", "Thumbs Up Premium Pulse"],
  ["thumbs-up-spotlight-salute", "Thumbs Up Spotlight Salute"],
  ["thumbs-up-victory-seal", "Thumbs Up Victory Seal"],
  ["thumbs-up-royal-ribbon", "Thumbs Up Royal Ribbon"],
  ["thumbs-up-neon-flare", "Thumbs Up Neon Flare"],
  ["leprechaun-emerald-crown", "Leprechaun Emerald Crown"],
  ["leprechaun-coin-fountain", "Leprechaun Coin Fountain"],
  ["leprechaun-lucky-seal", "Leprechaun Lucky Seal"],
  ["leprechaun-rainbow-vault", "Leprechaun Rainbow Vault"],
  ["leprechaun-treasure-burst", "Leprechaun Treasure Burst"],
  ["flowers-orchid-glow", "Flowers Orchid Glow Premiere"],
  ["flowers-peony-crown", "Flowers Peony Crown"],
  ["flowers-blossom-halo", "Flowers Blossom Halo"],
  ["flowers-garden-ribbon", "Flowers Garden Ribbon Gala"],
  ["flowers-petal-fanfare", "Flowers Petal Fanfare"],
] as const;

describe("wink library premium coverage", () => {
  it("keeps the small effect categories at ten or more items", () => {
    const effectItems = manifest.groups.effect.items;
    const countByCategory = effectItems.reduce<Record<string, number>>((counts, item) => {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
      return counts;
    }, {});

    expect(countByCategory["Flowers"]).toBeGreaterThanOrEqual(10);
    expect(countByCategory["Leprechaun"]).toBeGreaterThanOrEqual(10);
    expect(countByCategory["Thumbs Up"]).toBeGreaterThanOrEqual(10);
  });

  it("publishes the new premium effect batch with SVG and APNG assets", () => {
    for (const [id, expectedName] of premiumEffectExpectations) {
      const item = manifest.groups.effect.items.find((entry) => entry.id === id);

      expect(item?.name).toBe(expectedName);
      expect(item?.svg?.path).toBe(`/winks/effect/svg/${id}.svg`);
      expect(item?.apng?.path).toBe(`/winks/effect/apng/${id}.apng`);
    }
  });
});
