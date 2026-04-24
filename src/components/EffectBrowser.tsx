import { Search } from "lucide-react";

import { EffectCard } from "@/components/EffectCard";
import { Input } from "@/components/ui/input";
import { CATEGORY_COLORS, type EffectCategory, type EffectMeta } from "@/data/effects";
import {
  ALL_EFFECTS_FILTER,
  EFFECT_CATEGORY_ORDER,
  type EffectFilter,
  type EffectGroup,
} from "@/lib/effectCatalog";
import { cn } from "@/lib/utils";

interface EffectBrowserProps {
  categoryCounts: Record<EffectCategory, number>;
  filter: EffectFilter;
  filteredCount: number;
  groups: EffectGroup[];
  query: string;
  selectedId: string;
  totalCount: number;
  onChangeFilter: (next: EffectFilter) => void;
  onChangeQuery: (next: string) => void;
  onDownloadEffect: (effect: EffectMeta) => void;
  onSelectEffect: (effect: EffectMeta) => void;
}

export function EffectBrowser({
  categoryCounts,
  filter,
  filteredCount,
  groups,
  query,
  selectedId,
  totalCount,
  onChangeFilter,
  onChangeQuery,
  onDownloadEffect,
  onSelectEffect,
}: EffectBrowserProps) {
  const activeFilterLabel = filter === ALL_EFFECTS_FILTER ? "all categories" : filter.toLowerCase();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Effect Browser</h2>
            <p className="text-sm text-muted-foreground">
              Browse, search, and preview the library with lighter rendering in the gallery.
            </p>
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Showing {filteredCount} of {totalCount} effects in {activeFilterLabel}
          </div>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => onChangeQuery(event.target.value)}
            placeholder="Search by name, category, or duration"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onChangeFilter(ALL_EFFECTS_FILTER)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === ALL_EFFECTS_FILTER
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            All ({totalCount})
          </button>

          {EFFECT_CATEGORY_ORDER.map((category) => (
            <button
              key={category}
              onClick={() => onChangeFilter(category)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filter === category
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {category} ({categoryCounts[category]})
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
          <h3 className="text-lg font-semibold">No effects found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another search term or switch back to a broader category.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.category} className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-block rounded-full border bg-gradient-to-br px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      CATEGORY_COLORS[group.category]
                    )}
                  >
                    {group.category}
                  </span>
                  <div className="text-sm text-muted-foreground">
                    {group.effects.length} {group.effects.length === 1 ? "effect" : "effects"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {group.effects.map((effect) => (
                  <EffectCard
                    key={effect.id}
                    effect={effect}
                    selected={effect.id === selectedId}
                    onSelect={onSelectEffect}
                    onDownload={onDownloadEffect}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
