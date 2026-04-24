import { EFFECTS, type EffectCategory, type EffectMeta } from "@/data/effects";

export const ALL_EFFECTS_FILTER = "All" as const;
export const EFFECT_CATEGORY_ORDER: readonly EffectCategory[] = [
  "Fireworks",
  "Gold Stars",
  "Bouncing Bingo Balls",
  "Confetti",
];

export type EffectFilter = EffectCategory | typeof ALL_EFFECTS_FILTER;

export interface EffectGroup {
  category: EffectCategory;
  effects: EffectMeta[];
}

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

export const EFFECT_COUNTS_BY_CATEGORY = EFFECT_CATEGORY_ORDER.reduce(
  (counts, category) => {
    counts[category] = EFFECTS.filter((effect) => effect.category === category).length;
    return counts;
  },
  {} as Record<EffectCategory, number>
);

export function findEffectById(id: string) {
  return EFFECTS.find((effect) => effect.id === id);
}

export function filterEffects(
  effects: readonly EffectMeta[],
  filter: EffectFilter,
  query: string
) {
  const normalizedQuery = normalizeQuery(query);

  return effects.filter((effect) => {
    if (filter !== ALL_EFFECTS_FILTER && effect.category !== filter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [effect.name, effect.category, effect.duration].some((value) =>
      value.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function groupEffectsByCategory(effects: readonly EffectMeta[]): EffectGroup[] {
  return EFFECT_CATEGORY_ORDER.map((category) => ({
    category,
    effects: effects.filter((effect) => effect.category === category),
  })).filter((group) => group.effects.length > 0);
}
