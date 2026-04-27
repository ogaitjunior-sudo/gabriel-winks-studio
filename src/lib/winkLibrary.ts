import type { WinkManifestItem, WinksManifest } from "@/lib/winkManifest";
import { resolveWinkAssetPath } from "@/lib/winkManifest";

export const WINK_LIBRARY_ALL_FILTER = "All";
export const WINK_LIBRARY_CHAT_FILTER = "Chat Winks";
export const WINK_LIBRARY_OVERVIEW_FILTER = "Bingo Wink Effects Library";

export const WINK_LIBRARY_TAG_FILTERS = [
  { id: "all", label: "All" },
  { id: "win", label: "Win" },
  { id: "party", label: "Party" },
  { id: "calm", label: "Calm" },
  { id: "reaction", label: "Reaction" },
  { id: "premium", label: "Premium" },
] as const;

export type WinkLibraryTagFilter = (typeof WINK_LIBRARY_TAG_FILTERS)[number]["id"];
export type WinkLibraryPrimaryTag = Exclude<WinkLibraryTagFilter, "all">;
export type WinkLibraryTag =
  | WinkLibraryPrimaryTag
  | "birthday"
  | "countdown"
  | "floral"
  | "impact"
  | "lucky"
  | "sparkle";

const FEATURED_CATEGORY_ORDER = [
  "Countdown",
  "Happy Birthday",
  "Thumbs Up",
  "Leprechaun",
  "Flowers",
];

const SUBGROUP_ORDER = [
  "Bingo Reveal",
  "Simple Countdown",
  "Cake Entrance",
  "Wish Glow",
  "Party Burst",
  "Word Draw",
  "Shape Burst",
  "Finale",
  "Burst",
  "Chaos",
  "Ribbon Sweep",
  "Align",
  "Orbit",
  "Premium Shine",
  "Jackpot Motion",
  "Lucky Clover",
  "Gold Rush",
  "Rainbow Reveal",
  "Reaction",
  "Badge Reward",
  "Impact Pop",
  "Bloom Pop",
  "Petal Rain",
  "Calm Glow",
  "Showcase",
] as const;

const TAG_LABELS: Record<WinkLibraryTag, string> = {
  birthday: "Birthday",
  calm: "Calm",
  countdown: "Countdown",
  floral: "Floral",
  impact: "Impact",
  lucky: "Lucky",
  party: "Party",
  premium: "Premium",
  reaction: "Reaction",
  sparkle: "Sparkle",
  win: "Win",
};

const PRIMARY_TAGS = new Set<WinkLibraryPrimaryTag>([
  "win",
  "party",
  "calm",
  "reaction",
  "premium",
]);

const CATEGORY_BASE_TAGS: Record<string, WinkLibraryTag[]> = {
  "Bouncing Bingo Balls": ["win", "reaction", "impact"],
  Confetti: ["party", "impact"],
  Countdown: ["countdown", "win", "impact"],
  Fireworks: ["premium", "party", "impact", "sparkle"],
  Flowers: ["floral", "calm", "sparkle"],
  "Gold Stars": ["premium", "win", "sparkle"],
  "Happy Birthday": ["birthday", "party", "premium"],
  Leprechaun: ["lucky", "win", "premium"],
  "Thumbs Up": ["reaction", "win", "impact"],
};

export interface WinkLibraryItem extends WinkManifestItem {
  apngPath: string | null;
  featured: boolean;
  featuredScore: number;
  kindLabel: string;
  searchText: string;
  subgroup: string;
  svgPath: string | null;
  tags: WinkLibraryTag[];
}

export interface WinkLibrarySubgroup {
  items: WinkLibraryItem[];
  subgroup: string;
}

export interface WinkLibraryGroup {
  category: string;
  items: WinkLibraryItem[];
  subgroups: WinkLibrarySubgroup[];
}

function compareCategory(left: string, right: string) {
  const leftIndex = FEATURED_CATEGORY_ORDER.indexOf(left);
  const rightIndex = FEATURED_CATEGORY_ORDER.indexOf(right);

  if (leftIndex >= 0 || rightIndex >= 0) {
    if (leftIndex < 0) return 1;
    if (rightIndex < 0) return -1;
    return leftIndex - rightIndex;
  }

  return left.localeCompare(right, undefined, { sensitivity: "base" });
}

function compareSubgroup(left: string, right: string) {
  const leftIndex = SUBGROUP_ORDER.indexOf(left as (typeof SUBGROUP_ORDER)[number]);
  const rightIndex = SUBGROUP_ORDER.indexOf(right as (typeof SUBGROUP_ORDER)[number]);

  if (leftIndex >= 0 || rightIndex >= 0) {
    if (leftIndex < 0) return 1;
    if (rightIndex < 0) return -1;
    return leftIndex - rightIndex;
  }

  return left.localeCompare(right, undefined, { sensitivity: "base" });
}

function compareLibraryItems(left: WinkLibraryItem, right: WinkLibraryItem) {
  if (left.featured !== right.featured) {
    return left.featured ? -1 : 1;
  }

  if (left.featuredScore !== right.featuredScore) {
    return right.featuredScore - left.featuredScore;
  }

  if (left.kind !== right.kind) {
    return left.kind.localeCompare(right.kind, undefined, { sensitivity: "base" });
  }

  return left.name.localeCompare(right.name, undefined, { sensitivity: "base" });
}

function normalizeSource(item: Pick<WinkManifestItem, "category" | "id" | "kind" | "name">) {
  return `${item.name} ${item.category ?? ""} ${item.kind} ${item.id}`.toLowerCase();
}

function containsAny(source: string, terms: string[]) {
  return terms.some((term) => source.includes(term));
}

function addTag(set: Set<WinkLibraryTag>, tag: WinkLibraryTag) {
  set.add(tag);
}

function deriveWinkTags(
  item: Pick<WinkManifestItem, "category" | "id" | "kind" | "name">
): WinkLibraryTag[] {
  const source = normalizeSource(item);
  const tags = new Set<WinkLibraryTag>(CATEGORY_BASE_TAGS[item.category ?? ""] ?? []);

  if (containsAny(source, ["win", "winner", "bingo", "jackpot", "gold", "trophy", "crown"])) {
    addTag(tags, "win");
  }

  if (
    containsAny(source, [
      "party",
      "confetti",
      "birthday",
      "cake",
      "balloon",
      "firework",
      "gift",
      "mega",
      "finale",
    ])
  ) {
    addTag(tags, "party");
  }

  if (
    containsAny(source, [
      "calm",
      "soft",
      "garden",
      "wave",
      "sparkle",
      "elegant",
      "bloom",
      "petal",
      "glow",
      "floral",
    ])
  ) {
    addTag(tags, "calm");
  }

  if (containsAny(source, ["thumb", "reaction", "chat", "smiley", "badge", "pop", "bounce"])) {
    addTag(tags, "reaction");
  }

  if (
    containsAny(source, ["premium", "gold", "elegant", "mega", "firework", "crown", "deluxe"])
  ) {
    addTag(tags, "premium");
  }

  if (containsAny(source, ["burst", "blast", "impact", "pop", "drop", "smash", "firework"])) {
    addTag(tags, "impact");
  }

  if (containsAny(source, ["birthday", "cake", "candle", "gift", "cupcake", "party hat"])) {
    addTag(tags, "birthday");
  }

  if (containsAny(source, ["countdown", "3", "2", "1", "letter", "reveal"])) {
    addTag(tags, "countdown");
  }

  if (containsAny(source, ["flower", "floral", "petal", "bloom", "garden", "rose", "bouquet"])) {
    addTag(tags, "floral");
  }

  if (containsAny(source, ["lucky", "clover", "leprechaun", "rainbow", "gold rain", "pot"])) {
    addTag(tags, "lucky");
  }

  if (containsAny(source, ["sparkle", "twinkle", "star", "glow", "firework", "shine"])) {
    addTag(tags, "sparkle");
  }

  if (item.kind === "chat") {
    addTag(tags, "reaction");
  }

  return [...tags].sort((left, right) => TAG_LABELS[left].localeCompare(TAG_LABELS[right]));
}

function deriveCountdownSubgroup(source: string) {
  if (source.includes("simple")) {
    return "Simple Countdown";
  }

  if (source.includes("bingo")) {
    return "Bingo Reveal";
  }

  return "Finale";
}

function deriveBirthdaySubgroup(source: string) {
  if (containsAny(source, ["candle", "wish", "sparkle", "glow"])) {
    return "Wish Glow";
  }

  if (containsAny(source, ["party", "confetti", "mega", "popper", "balloon"])) {
    return "Party Burst";
  }

  return "Cake Entrance";
}

function deriveFireworksSubgroup(source: string) {
  if (containsAny(source, ["text", "script", "word", "bingo", "win", "jackpot", "countdown"])) {
    return "Word Draw";
  }

  if (
    containsAny(source, [
      "shape",
      "heart",
      "star",
      "crown",
      "clover",
      "smiley",
      "trophy",
      "gift",
      "cake",
      "thumbs",
      "flower",
      "arc",
      "frame",
    ])
  ) {
    return "Shape Burst";
  }

  return "Finale";
}

function deriveWinkSubgroup(
  item: Pick<WinkManifestItem, "category" | "id" | "kind" | "name">
): string {
  const source = normalizeSource(item);

  switch (item.category) {
    case "Countdown":
      return deriveCountdownSubgroup(source);
    case "Happy Birthday":
      return deriveBirthdaySubgroup(source);
    case "Fireworks":
      return deriveFireworksSubgroup(source);
    case "Confetti":
      if (source.includes("ribbon")) return "Ribbon Sweep";
      if (containsAny(source, ["spiral", "storm", "vortex", "crossfire", "burst frame"])) {
        return "Chaos";
      }
      return "Burst";
    case "Gold Stars":
      if (containsAny(source, ["orbit", "shooting", "ring", "galaxy"])) return "Orbit";
      if (containsAny(source, ["constellation", "align", "line", "frame"])) return "Align";
      return "Premium Shine";
    case "Bouncing Bingo Balls":
      if (containsAny(source, ["orbit", "bullseye", "pinball", "zigzag"])) return "Jackpot Motion";
      if (containsAny(source, ["align", "line", "stack", "drop"])) return "Align";
      return "Burst";
    case "Thumbs Up":
      if (containsAny(source, ["reaction", "chat", "fast"])) return "Reaction";
      if (containsAny(source, ["badge", "win", "jackpot"])) return "Badge Reward";
      return "Impact Pop";
    case "Leprechaun":
      if (source.includes("rainbow")) return "Rainbow Reveal";
      if (containsAny(source, ["gold", "coins", "rain", "pot"])) return "Gold Rush";
      return "Lucky Clover";
    case "Flowers":
      if (containsAny(source, ["petal", "rain", "confetti"])) return "Petal Rain";
      if (containsAny(source, ["soft", "garden", "wave", "sparkle"])) return "Calm Glow";
      return "Bloom Pop";
    default:
      if (containsAny(source, ["burst", "pop", "blast"])) return "Burst";
      if (containsAny(source, ["align", "line", "stack", "letter"])) return "Align";
      if (containsAny(source, ["chaos", "storm", "spin", "vortex"])) return "Chaos";
      return "Showcase";
  }
}

function deriveFeaturedScore(item: WinkManifestItem, tags: WinkLibraryTag[], subgroup: string) {
  const source = normalizeSource(item);
  let score = 0;

  if (tags.includes("premium")) score += 4;
  if (tags.includes("win")) score += 3;
  if (tags.includes("party")) score += 2;
  if (tags.includes("impact")) score += 2;
  if (tags.includes("sparkle")) score += 1;
  if (FEATURED_CATEGORY_ORDER.includes(item.category ?? "")) score += 1;
  if (containsAny(source, ["mega", "jackpot", "finale", "crown", "bingo", "birthday"])) score += 2;
  if (subgroup === "Finale" || subgroup === "Party Burst" || subgroup === "Premium Shine") {
    score += 1;
  }

  return score;
}

function buildSearchText(item: WinkManifestItem, tags: WinkLibraryTag[], subgroup: string) {
  return `${item.name} ${item.category ?? ""} ${item.kind} ${item.id} ${subgroup} ${tags
    .map((tag) => TAG_LABELS[tag])
    .join(" ")}`.toLowerCase();
}

export function getWinkTagLabel(tag: WinkLibraryTag) {
  return TAG_LABELS[tag];
}

export function getWinkLibrarySubgroupDescription(category: string, subgroup: string) {
  const key = `${category}:${subgroup}`;
  const descriptions: Record<string, string> = {
    "Bouncing Bingo Balls:Align": "Tighter compositions where balls snap into readable center-safe formations.",
    "Bouncing Bingo Balls:Burst": "Quick-hit impacts built around rebounds, pops, and lively bingo-room energy.",
    "Bouncing Bingo Balls:Jackpot Motion": "More kinetic ball paths with ricochets, zigzags, and playful momentum.",
    "Confetti:Burst": "Direct celebration reveals with obvious impact moments and bright payoff frames.",
    "Confetti:Chaos": "Messier cascades, spirals, and layered showers for high-energy party coverage.",
    "Confetti:Ribbon Sweep": "Streamers and ribbons that guide the eye before the final celebration lockup.",
    "Countdown:Bingo Reveal": "Readable countdown progressions that land in a clear bingo-room victory moment.",
    "Countdown:Finale": "Showier countdown endings with stronger burst language and stage-like payoff.",
    "Countdown:Simple Countdown": "Straightforward 3-2-1 loops that jump into celebration right after one.",
    "Fireworks:Finale": "Big-room showcase finishes tuned for marquee moments and premium motion.",
    "Fireworks:Shape Burst": "Rocket trails explode into symbols, icons, and shaped celebratory silhouettes.",
    "Fireworks:Word Draw": "Firework paths that resolve into readable words and headline-style reveals.",
    "Flowers:Bloom Pop": "Fresh floral arrivals with punchier reveals and center-stage bouquet energy.",
    "Flowers:Calm Glow": "Gentler loops built around soft sparkles, petal drift, and graceful pacing.",
    "Flowers:Petal Rain": "Layered petal motion for fuller coverage without losing the center-safe focal point.",
    "Gold Stars:Align": "Star systems that line up into clean compositions and readable premium lockups.",
    "Gold Stars:Orbit": "Sweeping arcs, rings, and celestial motion for more dynamic high-end choices.",
    "Gold Stars:Premium Shine": "Spotlighted star reveals designed to feel polished, elevated, and celebratory.",
    "Happy Birthday:Cake Entrance": "Cake-led reveals where the dessert arrival sets the stage for the title.",
    "Happy Birthday:Party Burst": "Confetti, balloons, and party energy wrapped around a clear cake-and-title moment.",
    "Happy Birthday:Wish Glow": "Candlelight, sparkles, and softer title timing for a more heartfelt birthday option.",
    "Leprechaun:Gold Rush": "Fast, playful lucky-money scenes with gold, pots, and richer celebration bursts.",
    "Leprechaun:Lucky Clover": "Clover-first loops that keep the charm readable and centered in the safe area.",
    "Leprechaun:Rainbow Reveal": "Colorful arcs and magical reveals that feel festive without losing clarity.",
    "Thumbs Up:Badge Reward": "Approval moments framed like prizes, badges, and win-state confirmations.",
    "Thumbs Up:Impact Pop": "Snappier reaction loops with stronger punch and obvious celebratory impact.",
    "Thumbs Up:Reaction": "Faster conversational loops for chat-style acknowledgements and quick celebration.",
  };

  return (
    descriptions[key] ??
    "Curated motion studies that split the larger category into easier-to-browse visual families."
  );
}

export function flattenWinkLibraryItems(manifest?: WinksManifest) {
  if (!manifest) {
    return [];
  }

  return Object.values(manifest.groups)
    .flatMap((group) => group.items)
    .map((item) => {
      const tags = deriveWinkTags(item);
      const subgroup = deriveWinkSubgroup(item);
      const featuredScore = deriveFeaturedScore(item, tags, subgroup);

      return {
        ...item,
        apngPath: item.apng
          ? resolveWinkAssetPath(item.kind, "apng", item.id, item.apng.path)
          : null,
        featured: featuredScore >= 7,
        featuredScore,
        kindLabel: item.kind === "effect" ? "Effect Wink" : "Chat Wink",
        searchText: buildSearchText(item, tags, subgroup),
        subgroup,
        svgPath: item.svg ? resolveWinkAssetPath(item.kind, "svg", item.id, item.svg.path) : null,
        tags,
      };
    })
    .sort((left, right) => {
      const categoryOrder = compareCategory(left.category ?? "", right.category ?? "");
      if (categoryOrder !== 0) {
        return categoryOrder;
      }

      const subgroupOrder = compareSubgroup(left.subgroup, right.subgroup);
      if (subgroupOrder !== 0) {
        return subgroupOrder;
      }

      return compareLibraryItems(left, right);
    });
}

export function getWinkLibraryCategories(items: WinkLibraryItem[]) {
  return [...new Set(items.map((item) => item.category).filter(Boolean) as string[])].sort(compareCategory);
}

export function getWinkLibraryCategoryCounts(items: WinkLibraryItem[]) {
  return items.reduce<Record<string, number>>((counts, item) => {
    if (!item.category) {
      return counts;
    }

    counts[item.category] = (counts[item.category] ?? 0) + 1;
    return counts;
  }, {});
}

export function getWinkLibraryTagCounts(items: WinkLibraryItem[]) {
  const counts: Record<WinkLibraryTagFilter, number> = {
    all: items.length,
    calm: 0,
    party: 0,
    premium: 0,
    reaction: 0,
    win: 0,
  };

  for (const item of items) {
    for (const tag of item.tags) {
      if (PRIMARY_TAGS.has(tag as WinkLibraryPrimaryTag)) {
        counts[tag as WinkLibraryPrimaryTag] += 1;
      }
    }
  }

  return counts;
}

export function filterWinkLibraryItems(
  items: WinkLibraryItem[],
  filter: string,
  query: string,
  tagFilter: WinkLibraryTagFilter = "all"
) {
  const normalizedQuery = query.trim().toLowerCase();
  const showFullLibrary =
    filter === WINK_LIBRARY_OVERVIEW_FILTER || filter === WINK_LIBRARY_ALL_FILTER;
  const showChatOnly = filter === WINK_LIBRARY_CHAT_FILTER;

  return items.filter((item) => {
    const matchesFilter = showFullLibrary || (showChatOnly ? item.kind === "chat" : item.category === filter);
    const matchesTag = tagFilter === "all" || item.tags.includes(tagFilter);
    const matchesQuery =
      normalizedQuery.length === 0 || item.searchText.includes(normalizedQuery);

    return matchesFilter && matchesTag && matchesQuery;
  });
}

export function groupWinkLibraryItems(items: WinkLibraryItem[]) {
  const groups = new Map<string, WinkLibraryItem[]>();

  for (const item of items) {
    const category = item.category ?? "Uncategorized";
    const existing = groups.get(category) ?? [];
    existing.push(item);
    groups.set(category, existing);
  }

  return [...groups.entries()]
    .sort(([left], [right]) => compareCategory(left, right))
    .map(([category, nextItems]) => {
      const subgroupMap = new Map<string, WinkLibraryItem[]>();

      for (const item of nextItems) {
        const subgroupItems = subgroupMap.get(item.subgroup) ?? [];
        subgroupItems.push(item);
        subgroupMap.set(item.subgroup, subgroupItems);
      }

      return {
        category,
        items: [...nextItems].sort(compareLibraryItems),
        subgroups: [...subgroupMap.entries()]
          .sort(([left], [right]) => compareSubgroup(left, right))
          .map(([subgroup, subgroupItems]) => ({
            items: [...subgroupItems].sort(compareLibraryItems),
            subgroup,
          })),
      };
    }) satisfies WinkLibraryGroup[];
}

export function pickFeaturedWinkLibraryItems(items: WinkLibraryItem[], limit = 8) {
  const buckets = new Map<string, WinkLibraryItem[]>();

  for (const item of [...items].filter((entry) => entry.featured).sort(compareLibraryItems)) {
    const category = item.category ?? "Uncategorized";
    const entries = buckets.get(category) ?? [];
    entries.push(item);
    buckets.set(category, entries);
  }

  const orderedCategories = [...buckets.keys()].sort(compareCategory);
  const picks: WinkLibraryItem[] = [];

  while (picks.length < limit) {
    let pulledAny = false;

    for (const category of orderedCategories) {
      const entries = buckets.get(category);
      const next = entries?.shift();

      if (!next) {
        continue;
      }

      picks.push(next);
      pulledAny = true;

      if (picks.length >= limit) {
        break;
      }
    }

    if (!pulledAny) {
      break;
    }
  }

  return picks;
}
