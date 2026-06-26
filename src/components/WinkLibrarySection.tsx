import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Check, Download, Play, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAssetSize } from "@/lib/winkManifest";
import {
  WINK_LIBRARY_ALL_FILTER,
  WINK_LIBRARY_CHAT_FILTER,
  WINK_LIBRARY_EFFECT_FILTER,
  WINK_LIBRARY_OVERVIEW_FILTER,
  WINK_LIBRARY_SOUND_FILTER,
  WINK_LIBRARY_TAG_FILTERS,
  filterWinkLibraryItems,
  flattenWinkLibraryItems,
  getFeaturedLottieWinkLibraryItems,
  getWinkLibraryCategories,
  getWinkLibrarySubgroupDescription,
  getWinkLibraryTagCounts,
  getWinkTagLabel,
  groupWinkLibraryItems,
  hasWinkLibrarySound,
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
const FEATURED_REASON_TAGS = ["win", "party", "impact", "reaction", "premium"] as const;
const FEATURED_REASON_TAG_SET = new Set<string>(FEATURED_REASON_TAGS);

interface WinkLibrarySectionProps {
  isLoading?: boolean;
  manifest?: WinksManifest;
}

interface PrimaryDownloadAction {
  download: string;
  format: "apng" | "lottie" | "svg";
  href: string;
}

function toAnchorId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function withPreviewVersion(assetPath: string, previewVersion: number) {
  const separator = assetPath.includes("?") ? "&" : "?";
  return `${assetPath}${separator}preview=${previewVersion}`;
}

function isLandscapePreview(item: WinkLibraryItem) {
  return item.width >= item.height;
}

function getPrimaryDownloadAction(item: WinkLibraryItem): PrimaryDownloadAction | null {
  if (item.kind === "chat" && item.apngPath) {
    return {
      download: item.apng?.fileName ?? `${item.id}.apng`,
      format: "apng",
      href: item.apngPath,
    };
  }

  if (item.kind === "effect" && item.lottiePath) {
    return {
      download: `${item.id}.json`,
      format: "lottie",
      href: item.lottiePath,
    };
  }

  if (item.apngPath) {
    return {
      download: item.apng?.fileName ?? `${item.id}.apng`,
      format: "apng",
      href: item.apngPath,
    };
  }

  if (item.lottiePath) {
    return {
      download: `${item.id}.json`,
      format: "lottie",
      href: item.lottiePath,
    };
  }

  if (item.svgPath) {
    return {
      download: item.svg?.fileName ?? `${item.id}.svg`,
      format: "svg",
      href: item.svgPath,
    };
  }

  return null;
}

export function WinkLibrarySection({
  isLoading = false,
  manifest,
}: WinkLibrarySectionProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(WINK_LIBRARY_ALL_FILTER);
  const [selectedFeaturedId, setSelectedFeaturedId] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<WinkLibraryTagFilter>("all");
  const deferredQuery = useDeferredValue(query);

  const allItems = useMemo(() => flattenWinkLibraryItems(manifest), [manifest]);
  const chatCount = useMemo(
    () => allItems.filter((item) => item.kind === "chat").length,
    [allItems]
  );
  const soundCount = useMemo(
    () => allItems.filter((item) => hasWinkLibrarySound(item)).length,
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
  const featuredEffects = useMemo(
    () => getFeaturedLottieWinkLibraryItems(filteredItems),
    [filteredItems]
  );
  const showFeatured = deferredQuery.trim().length === 0 && featuredEffects.length > 0;

  useEffect(() => {
    if (selectedFeaturedId && !featuredEffects.some((item) => item.id === selectedFeaturedId)) {
      setSelectedFeaturedId(null);
    }
  }, [featuredEffects, selectedFeaturedId]);

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
          <span>{showFeatured ? featuredEffects.length : 0} featured effects</span>
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
              active={category === WINK_LIBRARY_SOUND_FILTER}
              label={`${WINK_LIBRARY_SOUND_FILTER} (${soundCount})`}
              onClick={() => setCategory(WINK_LIBRARY_SOUND_FILTER)}
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

          <div className="space-y-2 border-t border-border/50 pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
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

          {!isLoading && groups.length > 0 ? (
            <div className="space-y-2 border-t border-border/50 pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                    Quick Jump
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Keep the category shortcuts joined with the top tabs.
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {groups.length} visible categories &middot;{" "}
                  {groups.reduce((total, group) => total + group.subgroups.length, 0)} motion
                  families
                </div>
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
          ) : null}
        </div>
      </div>

      {showFeatured ? (
        <section
          aria-label="Featured Effects"
          className="featured-hero-shell rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.22),_transparent_38%),linear-gradient(135deg,rgba(8,15,32,0.97),rgba(19,34,63,0.9)_54%,rgba(10,18,35,0.96))] p-5 shadow-[0_30px_100px_-38px_rgba(250,204,21,0.42)] ring-1 ring-white/6 md:p-6"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.24),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(8,15,32,0.32))]" />
          <div className="pointer-events-none absolute -right-16 top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="featured-hero-content space-y-5">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-yellow-100/90">
                  Top Picks
                </p>
                <h3 className="text-2xl font-semibold tracking-tight text-white">
                  Featured Effects
                </h3>
                <p className="max-w-3xl text-sm text-slate-200/78">
                  Top Picks — our best-performing and most visually impactful effects for bingo
                  room experiences.
                </p>
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-slate-100/80 backdrop-blur">
                {featuredEffects.length} featured animations
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {featuredEffects.map((item, index) => (
                <WinkLibraryCard
                  key={`featured-${item.kind}-${item.id}`}
                  featured
                  featuredPriority={index < 2}
                  isSelected={selectedFeaturedId === item.id}
                  item={item}
                  onUseEffect={() => setSelectedFeaturedId(item.id)}
                />
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
  featuredPriority = false,
  isSelected = false,
  onUseEffect,
}: {
  item: WinkLibraryItem;
  featured?: boolean;
  featuredPriority?: boolean;
  isSelected?: boolean;
  onUseEffect?: () => void;
}) {
  const activeAudioRef = useRef<HTMLAudioElement[]>([]);
  const cueTimerIdsRef = useRef<number[]>([]);
  const pendingPlaybackRef = useRef(false);
  const [previewVersion, setPreviewVersion] = useState(0);
  const [svgPreviewFailed, setSvgPreviewFailed] = useState(false);
  const categoryClass =
    CATEGORY_BADGES[item.category ?? ""] ?? "border-primary/25 bg-primary/10 text-primary";
  const downloadGridClass = item.lottiePath ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2";
  const hasSound = hasWinkLibrarySound(item);
  const previewSrc = item.svgPath ? withPreviewVersion(item.svgPath, previewVersion) : null;
  const primaryDownloadAction = useMemo(() => getPrimaryDownloadAction(item), [item]);
  const landscapePreview = isLandscapePreview(item);
  const previewInsetClass = featured
    ? landscapePreview
      ? "inset-[6%]"
      : "inset-[10%]"
    : landscapePreview
      ? "inset-[8%]"
      : "inset-[12%]";
  const featuredReasonTags = useMemo(
    () => item.tags.filter((tag) => FEATURED_REASON_TAG_SET.has(tag)),
    [item.tags]
  );
  const visibleTags = useMemo(
    () =>
      featured
        ? item.tags.filter((tag) => !FEATURED_REASON_TAG_SET.has(tag)).slice(0, 3)
        : item.tags.slice(0, 5),
    [featured, item.tags]
  );
  const soundCues = useMemo(
    () => [...(item.soundCues ?? [])].sort((left, right) => left.time - right.time),
    [item.soundCues]
  );
  const showSecondaryApng =
    Boolean(item.apngPath) && (!featured || primaryDownloadAction?.format !== "apng");
  const showSecondaryLottie =
    Boolean(item.lottiePath) && (!featured || primaryDownloadAction?.format !== "lottie");
  const secondaryDownloadCount = [
    Boolean(item.svgPath),
    showSecondaryApng,
    showSecondaryLottie,
  ].filter(Boolean).length;
  const SOUND_SYNC_LEAD_MS = 18;

  function clearScheduledPlayback() {
    for (const timerId of cueTimerIdsRef.current) {
      window.clearTimeout(timerId);
    }
    cueTimerIdsRef.current = [];
    pendingPlaybackRef.current = false;
    for (const audio of activeAudioRef.current) {
      audio.pause();
      audio.currentTime = 0;
    }
    activeAudioRef.current = [];
  }

  function playSoundSource(sound: string) {
    if (typeof Audio !== "function") {
      return;
    }

    const audio = new Audio(sound);
    audio.preload = "auto";
    audio.currentTime = 0;
    activeAudioRef.current.push(audio);

    const playResult = audio.play();
    if (playResult && typeof playResult.catch === "function") {
      void playResult.catch(() => undefined);
    }
  }

  function startSynchronizedSoundPlayback() {
    pendingPlaybackRef.current = false;

    if (item.soundPath) {
      playSoundSource(item.soundPath);
      return;
    }

    if (soundCues.length > 0) {
      cueTimerIdsRef.current = soundCues
        .filter((cue) => cue.time > 0)
        .map((cue) =>
          window.setTimeout(() => {
            playSoundSource(cue.sound);
          }, Math.max(0, Math.round(cue.time * 1000) - SOUND_SYNC_LEAD_MS))
        );
      soundCues.filter((cue) => cue.time <= 0).forEach((cue) => {
        playSoundSource(cue.sound);
      });
      return;
    }
  }

  useEffect(() => {
    return () => {
      clearScheduledPlayback();
    };
  }, []);

  function handlePreviewLoad() {
    if (pendingPlaybackRef.current) {
      startSynchronizedSoundPlayback();
    }
  }

  function handlePreviewError() {
    setSvgPreviewFailed(true);
    if (pendingPlaybackRef.current) {
      startSynchronizedSoundPlayback();
    }
  }

  function handlePlay() {
    clearScheduledPlayback();
    setSvgPreviewFailed(false);
    pendingPlaybackRef.current = soundCues.length > 0 || Boolean(item.soundPath);
    setPreviewVersion((currentVersion) => currentVersion + 1);

    if (pendingPlaybackRef.current && (!previewSrc || svgPreviewFailed)) {
      startSynchronizedSoundPlayback();
    }
  }

  return (
    <article
      className={cn(
        "effect-card-shell overflow-hidden rounded-2xl border border-border/70 bg-card/65 p-3 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30",
        featured &&
          "relative isolate rounded-[26px] border-primary/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(15,23,42,0.34))] p-4 shadow-[0_18px_55px_-32px_rgba(56,189,248,0.45)] will-change-transform hover:scale-[1.015] hover:border-yellow-200/40 hover:shadow-[0_28px_85px_-34px_rgba(250,204,21,0.46)] md:p-6 xl:grid xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.92fr)] xl:items-start xl:gap-5"
      )}
    >
      {featured ? (
        <div className="pointer-events-none absolute inset-x-5 top-0 h-24 rounded-b-[28px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.24),_transparent_68%)]" />
      ) : null}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl border border-border/60 bg-checker",
          featured && "border-primary/25 bg-background/55 shadow-inner shadow-black/10 xl:self-start"
        )}
        style={{ aspectRatio: `${item.width} / ${item.height}` }}
      >
        <div className={cn("absolute flex items-center justify-center", previewInsetClass)}>
          {previewSrc && !svgPreviewFailed ? (
            <img
              key={previewSrc}
              src={previewSrc}
              alt={`${item.name} SVG Animation`}
              className="block h-full w-full object-contain"
              fetchpriority={featuredPriority ? "high" : "auto"}
              loading={featured ? "eager" : "lazy"}
              sizes={
                featured
                  ? "(min-width: 1280px) 48vw, (min-width: 768px) 50vw, 100vw"
                  : "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              }
              decoding="async"
              onLoad={handlePreviewLoad}
              onError={handlePreviewError}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
              SVG preview unavailable
            </div>
          )}
        </div>

        <div
          className={cn(
            "pointer-events-none absolute rounded-[18px] border border-dashed border-sky-300/45",
            previewInsetClass
          )}
        />

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
          {hasSound ? <TagBadge label="Sound" /> : null}
          {featured ? <TagBadge label="Top Pick" tone="featured" /> : null}
        </div>
      </div>

      <div
        className={cn(
          "mt-3 space-y-3",
          featured && "mt-4 xl:mt-0 xl:flex xl:flex-col xl:justify-between"
        )}
      >
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={cn(
                "font-semibold tracking-tight text-foreground",
                featured ? "text-xl text-white md:text-2xl" : "text-base"
              )}
            >
              {item.name}
            </h3>
            <div
              className={cn(
                "rounded-full border border-border/60 bg-background/70 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
                featured && "border-white/15 bg-white/10 text-slate-100/85"
              )}
            >
              {item.aspectRatio}
            </div>
          </div>
          <p
            className={cn(
              "text-muted-foreground",
              featured ? "text-sm text-slate-100/75" : "text-xs"
            )}
          >
            {item.width} x {item.height} &middot; {item.durationMs ?? 0} ms &middot;{" "}
            {formatAssetSize(item.svg?.sizeLabel)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {featured
            ? featuredReasonTags.map((tag) => (
                <TagBadge
                  key={`${item.id}-featured-${tag}`}
                  label={getWinkTagLabel(tag)}
                  tone="featured"
                />
              ))
            : null}
          <TagBadge label={item.subgroup} tone={featured ? "featured" : "default"} />
          {visibleTags.map((tag) => (
            <TagBadge key={`${item.id}-${tag}`} label={getWinkTagLabel(tag)} />
          ))}
        </div>

        <div className={cn("space-y-3", featured && "space-y-4")}>
          {featured ? (
            <div className="space-y-3">
              <div
                className={cn(
                  "grid grid-cols-1 gap-2",
                  primaryDownloadAction ? "sm:grid-cols-3" : "sm:grid-cols-2"
                )}
              >
                <Button size="default" variant="outline" onClick={handlePlay}>
                  <Play className="h-4 w-4" />
                  Play
                </Button>

                {primaryDownloadAction ? (
                  <Button
                    asChild
                    size="default"
                    className="border-white/15 bg-white text-slate-950 hover:bg-slate-100"
                  >
                    <a href={primaryDownloadAction.href} download={primaryDownloadAction.download}>
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </Button>
                ) : null}

                <Button
                  aria-pressed={isSelected}
                  className={cn(
                    "border-0 text-slate-950 shadow-[0_14px_40px_-22px_rgba(250,204,21,0.9)] hover:opacity-95",
                    isSelected
                      ? "bg-emerald-300 hover:bg-emerald-200"
                      : "bg-amber-300 hover:bg-amber-200"
                  )}
                  size="default"
                  type="button"
                  onClick={onUseEffect}
                >
                  {isSelected ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  {isSelected ? "Selected" : "Use this effect"}
                </Button>
              </div>

              <p className="text-xs text-slate-100/72">
                {isSelected
                  ? "Selected for your next bingo room moment."
                  : "Preview it, grab the main delivery file, or mark it as your room-ready pick."}
              </p>
            </div>
          ) : (
            <Button size="sm" variant="outline" onClick={handlePlay}>
              <Play className="h-4 w-4" />
              Play
            </Button>
          )}

          {secondaryDownloadCount > 0 ? (
            <div
              className={cn(
                "grid gap-2",
                featured ? "grid-cols-1 sm:grid-cols-2" : downloadGridClass
              )}
            >
              {item.svgPath ? (
                <Button asChild size={featured ? "default" : "sm"}>
                  <a href={item.svgPath} download={item.svg?.fileName ?? `${item.id}.svg`}>
                    <Download className="h-4 w-4" />
                    SVG
                  </a>
                </Button>
              ) : null}

              {showSecondaryApng ? (
                <Button asChild size={featured ? "default" : "sm"} variant="secondary">
                  <a href={item.apngPath} download={item.apng?.fileName ?? `${item.id}.apng`}>
                    <Sparkles className="h-4 w-4" />
                    APNG
                  </a>
                </Button>
              ) : null}

              {showSecondaryLottie ? (
                <Button asChild size={featured ? "default" : "sm"} variant="outline">
                  <a href={item.lottiePath} download={`${item.id}.json`}>
                    <Download className="h-4 w-4" />
                    Download Lottie
                  </a>
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
