import { useDeferredValue, useMemo, useState } from "react";
import { Download, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAssetSize } from "@/lib/winkManifest";
import {
  WINK_LIBRARY_ALL_FILTER,
  WINK_LIBRARY_CHAT_FILTER,
  WINK_LIBRARY_EFFECT_FILTER,
  WINK_LIBRARY_OVERVIEW_FILTER,
  WINK_LIBRARY_TAG_FILTERS,
  filterWinkLibraryItems,
  flattenWinkLibraryItems,
  getWinkLibraryCategories,
  getWinkLibrarySubgroupDescription,
  getWinkLibraryTagCounts,
  getWinkTagLabel,
  groupWinkLibraryItems,
  pickFeaturedWinkLibraryItems,
  type WinkLibraryItem,
  type WinkLibraryTagFilter,
} from "@/lib/winkLibrary";
import { cn } from "@/lib/utils";
import type { WinksManifest } from "@/lib/winkManifest";

const CATEGORY_BADGES: Record<string, string> = {
  Countdown: "border-cyan-300/35 bg-cyan-500/12 text-cyan-100",
  Flowers: "border-pink-300/35 bg-pink-500/12 text-pink-100",
  Fireworks: "border-amber-300/35 bg-amber-500/12 text-amber-100",
  Confetti: "border-rose-300/35 bg-rose-500/12 text-rose-100",
  "Gold Stars": "border-yellow-300/35 bg-yellow-500/12 text-yellow-100",
  "Happy Birthday": "border-fuchsia-300/35 bg-fuchsia-500/12 text-fuchsia-100",
  Leprechaun: "border-emerald-300/35 bg-emerald-500/12 text-emerald-100",
  "Thumbs Up": "border-sky-300/35 bg-sky-500/12 text-sky-100",
  "Bingo Balls": "border-orange-300/35 bg-orange-500/12 text-orange-100",
};

interface WinkLibrarySectionProps {
  isLoading?: boolean;
  manifest?: WinksManifest;
}

function toAnchorId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function WinkLibrarySection({
  isLoading = false,
  manifest,
}: WinkLibrarySectionProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(WINK_LIBRARY_ALL_FILTER);
  const [tagFilter, setTagFilter] = useState<WinkLibraryTagFilter>("all");
  const deferredQuery = useDeferredValue(query);

  const allItems = useMemo(() => flattenWinkLibraryItems(manifest), [manifest]);
  const chatCount = useMemo(
    () => allItems.filter((item) => item.kind === "chat").length,
    [allItems]
  );
  const effectCount = useMemo(
    () => allItems.filter((item) => item.kind === "effect").length,
    [allItems]
  );
  const categories = useMemo(() => getWinkLibraryCategories(allItems), [allItems]);
  const tagCounts = useMemo(() => getWinkLibraryTagCounts(allItems), [allItems]);
  const filteredItems = useMemo(
    () => filterWinkLibraryItems(allItems, category, deferredQuery, tagFilter),
    [allItems, category, deferredQuery, tagFilter]
  );
  const groups = useMemo(() => groupWinkLibraryItems(filteredItems), [filteredItems]);
  const featuredItems = useMemo(
    () => pickFeaturedWinkLibraryItems(filteredItems, 8),
    [filteredItems]
  );
  const showFeatured =
    deferredQuery.trim().length === 0 && filteredItems.length >= 6 && featuredItems.length > 0;

  return (
    <section
      id="top"
      className="gradient-panel space-y-6 rounded-[28px] border border-border/80 p-5 shadow-card md:p-6"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            Bingo Wink Effects Library
          </p>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Premium SVG animation winks with APNG fallback
            </h2>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Browse the full Bingo Wink Effects Library like a curated marketplace, with tags,
              featured picks, motion sub-groups, transparent SVG showcases, and matching APNG
              fallback downloads.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary">
            {allItems.length} total wink cards
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/70 bg-background/35 p-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <label
            htmlFor="wink-library-search"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-primary"
          >
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="wink-library-search"
              className="border-border/80 bg-background/70 pl-9"
              placeholder="Search by name, category, kind, wink id, tag, or subgroup"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>
            Showing {filteredItems.length} of {allItems.length}
          </span>
          <span>&middot;</span>
          <span>{categories.length} categories</span>
          <span>&middot;</span>
          <span>{showFeatured ? featuredItems.length : 0} featured</span>
        </div>

        <div className="space-y-2 lg:col-span-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Browse by category:
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterChip
              active={
                category === WINK_LIBRARY_ALL_FILTER || category === WINK_LIBRARY_OVERVIEW_FILTER
              }
              label={WINK_LIBRARY_ALL_FILTER}
              onClick={() => setCategory(WINK_LIBRARY_ALL_FILTER)}
            />
            <FilterChip
              active={category === WINK_LIBRARY_CHAT_FILTER}
              label={WINK_LIBRARY_CHAT_FILTER}
              onClick={() => setCategory(WINK_LIBRARY_CHAT_FILTER)}
            />
            <FilterChip
              active={category === WINK_LIBRARY_EFFECT_FILTER}
              label={WINK_LIBRARY_EFFECT_FILTER}
              onClick={() => setCategory(WINK_LIBRARY_EFFECT_FILTER)}
            />
            {categories.map((nextCategory) => (
              <FilterChip
                key={nextCategory}
                active={category === nextCategory}
                label={nextCategory}
                onClick={() => setCategory(nextCategory)}
              />
            ))}
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/40 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                  Filter by mood:
                </p>
                <p className="text-xs text-muted-foreground">
                  Refine by mood, use case, and visual intensity while keeping search active.
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                All {tagCounts.all} &middot; Chat {chatCount} &middot; Effect {effectCount}
                &middot; Win {tagCounts.win} &middot; Party {tagCounts.party} &middot; Calm{" "}
                {tagCounts.calm} &middot; Reaction {tagCounts.reaction} &middot; Premium{" "}
                {tagCounts.premium} &middot; Impact {tagCounts.impact}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {WINK_LIBRARY_TAG_FILTERS.map((tag) => (
                <FilterChip
                  key={tag.id}
                  active={tagFilter === tag.id}
                  label={tag.label}
                  onClick={() => setTagFilter(tag.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showFeatured ? (
        <section className="space-y-4 rounded-[26px] border border-primary/25 bg-primary/5 p-4 shadow-card">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Featured Picks
              </p>
              <h3 className="text-xl font-semibold tracking-tight">
                Highlighted showcase loops for fast browsing
              </h3>
              <p className="max-w-3xl text-sm text-muted-foreground">
                A rotating front row of premium, high-impact, or especially readable animations to
                help users discover strong options before diving into the full catalog.
              </p>
            </div>
            <div className="rounded-full border border-primary/20 bg-background/65 px-3 py-1 text-xs text-muted-foreground">
              {featuredItems.length} highlighted animations
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredItems.map((item) => (
              <WinkLibraryCard key={`featured-${item.kind}-${item.id}`} featured item={item} />
            ))}
          </div>
        </section>
      ) : null}

      {!isLoading && groups.length > 0 ? (
        <section className="rounded-2xl border border-border/70 bg-background/35 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                Quick Jump
              </p>
              <h3 className="text-lg font-semibold tracking-tight">
                Navigate the catalog by category and motion family
              </h3>
              <p className="max-w-3xl text-sm text-muted-foreground">
                Jump straight into the categories you care about, then use sub-groups to explore
                tighter visual families inside each section.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <a
                  key={`jump-${group.category}`}
                  href={`#${toAnchorId(group.category)}`}
                  className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  {group.category} ({group.items.length})
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-border/70 bg-background/35 px-6 py-12 text-center text-sm text-muted-foreground">
          Loading wink manifest and library previews...
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 bg-background/25 px-6 py-12 text-center">
          <h3 className="text-lg font-semibold">No wink cards found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a broader category, switch the tag filter, or clear the search so the full library
            can show again.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => {
            const groupAnchor = toAnchorId(group.category);

            return (
              <section key={group.category} id={groupAnchor} className="space-y-4 scroll-mt-24">
                <div className="space-y-3 rounded-2xl border border-border/70 bg-background/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
                          CATEGORY_BADGES[group.category] ??
                            "border-primary/25 bg-primary/10 text-primary"
                        )}
                      >
                        {group.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {group.items.length} {group.items.length === 1 ? "wink" : "winks"}
                      </span>
                    </div>
                    <a
                      href="#top"
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Back to top
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.subgroups.map((subgroup) => (
                      <a
                        key={`${group.category}-${subgroup.subgroup}`}
                        href={`#${toAnchorId(`${group.category}-${subgroup.subgroup}`)}`}
                        className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                      >
                        {subgroup.subgroup} ({subgroup.items.length})
                      </a>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {group.subgroups.map((subgroup) => (
                    <section
                      key={`${group.category}-${subgroup.subgroup}`}
                      id={toAnchorId(`${group.category}-${subgroup.subgroup}`)}
                      className="space-y-3 scroll-mt-24"
                    >
                      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/45 p-4 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90">
                            {group.category}
                          </p>
                          <h3 className="text-lg font-semibold tracking-tight">
                            {subgroup.subgroup}
                          </h3>
                          <p className="max-w-3xl text-sm text-muted-foreground">
                            {getWinkLibrarySubgroupDescription(group.category, subgroup.subgroup)}
                          </p>
                        </div>

                        <div className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                          {subgroup.items.length} cards
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {subgroup.items.map((item) => (
                          <WinkLibraryCard key={`${item.kind}-${item.id}`} item={item} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/12 text-primary"
          : "border-border/80 bg-background/55 text-muted-foreground hover:text-foreground"
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function TagBadge({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "featured";
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
        tone === "featured"
          ? "border-primary/30 bg-primary/12 text-primary"
          : "border-border/65 bg-background/65 text-muted-foreground"
      )}
    >
      {label}
    </span>
  );
}

function WinkLibraryCard({
  item,
  featured = false,
}: {
  item: WinkLibraryItem;
  featured?: boolean;
}) {
  const [svgPreviewFailed, setSvgPreviewFailed] = useState(false);
  const categoryClass =
    CATEGORY_BADGES[item.category ?? ""] ?? "border-primary/25 bg-primary/10 text-primary";

  return (
    <article
      className={cn(
        "effect-card-shell overflow-hidden rounded-2xl border border-border/70 bg-card/65 p-3 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30",
        featured && "border-primary/30 bg-primary/5"
      )}
    >
      <div className="relative overflow-hidden rounded-xl border border-border/60 bg-checker">
        <div style={{ aspectRatio: `${item.width} / ${item.height}` }}>
          {item.svgPath && !svgPreviewFailed ? (
            <img
              src={item.svgPath}
              alt={`${item.name} SVG Animation`}
              className="block h-full w-full object-contain"
              loading="lazy"
              decoding="async"
              onError={() => setSvgPreviewFailed(true)}
            />
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
              SVG preview unavailable
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-[10%] rounded-[18px] border border-dashed border-sky-300/45" />

        <div className="absolute left-2 top-2 flex flex-wrap gap-2">
          <span className="rounded-full border border-background/20 bg-background/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">
            {item.kindLabel}
          </span>
          {item.category ? (
            <span
              className={cn(
                "rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
                categoryClass
              )}
            >
              {item.category}
            </span>
          ) : null}
          {featured ? <TagBadge label="Featured" tone="featured" /> : null}
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold tracking-tight text-foreground">{item.name}</h3>
            <div className="rounded-full border border-border/60 bg-background/70 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {item.aspectRatio}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {item.width} x {item.height} &middot; {item.durationMs ?? 0} ms &middot;{" "}
            {formatAssetSize(item.svg?.sizeLabel)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <TagBadge label={item.subgroup} tone={featured ? "featured" : "default"} />
          {item.tags.slice(0, 5).map((tag) => (
            <TagBadge key={`${item.id}-${tag}`} label={getWinkTagLabel(tag)} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {item.svgPath ? (
            <Button asChild size="sm">
              <a href={item.svgPath} download={item.svg?.fileName ?? `${item.id}.svg`}>
                <Download className="h-4 w-4" />
                SVG
              </a>
            </Button>
          ) : (
            <Button disabled size="sm">
              <Download className="h-4 w-4" />
              SVG
            </Button>
          )}

          {item.apngPath ? (
            <Button asChild size="sm" variant="secondary">
              <a href={item.apngPath} download={item.apng?.fileName ?? `${item.id}.apng`}>
                <Sparkles className="h-4 w-4" />
                APNG
              </a>
            </Button>
          ) : (
            <Button disabled size="sm" variant="secondary">
              <Sparkles className="h-4 w-4" />
              APNG
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
