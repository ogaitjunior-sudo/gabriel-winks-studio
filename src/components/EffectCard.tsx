import { memo, useState } from "react";
import { Download, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CATEGORY_COLORS, type EffectMeta } from "@/data/effects";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface EffectCardProps {
  effect: EffectMeta;
  selected: boolean;
  onSelect: (effect: EffectMeta) => void;
  onDownload: (effect: EffectMeta) => void;
}

function EffectCardComponent({ effect, selected, onSelect, onDownload }: EffectCardProps) {
  const Comp = effect.Component;
  const [hovered, setHovered] = useState(false);
  const { ref, isInView } = useInView<HTMLDivElement>({ rootMargin: "240px 0px 240px 0px" });
  const showPreview = selected || hovered || isInView;

  return (
    <div
      ref={ref}
      className={cn(
        "effect-card-shell group flex flex-col gap-2 overflow-hidden rounded-xl border bg-card p-2 transition-all hover:-translate-y-0.5 hover:shadow-glow",
        selected ? "border-primary ring-2 ring-primary/40" : "border-border"
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(effect)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col gap-2 text-left"
      >
        <div
          className="effect-card-preview relative w-full overflow-hidden rounded-lg bg-checker"
          style={{ aspectRatio: "16 / 9" }}
        >
          {showPreview ? (
            <div className="absolute inset-[12%] flex items-center justify-center">
              <div className="h-full w-full">
                <Comp playing={true} />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background/20 via-background/5 to-primary/10">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
                <Sparkles className="h-3 w-3 text-primary" />
                Preview on scroll
              </div>
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-2 px-1 pt-0.5">
          <div className="min-w-0">
            <div className="truncate text-xs font-medium text-foreground">{effect.name}</div>
            <div className="text-[10px] text-muted-foreground">{effect.duration}</div>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border bg-gradient-to-br px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
              CATEGORY_COLORS[effect.category]
            )}
          >
            {effect.category.split(" ")[0]}
          </span>
        </div>
      </button>

      <div className="flex justify-end px-1 pb-1">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => onDownload(effect)}
          className="h-7 gap-1.5 px-2 text-[10px] font-semibold"
        >
          <Download className="h-3 w-3" />
          SVG
        </Button>
      </div>
    </div>
  );
}

export const EffectCard = memo(EffectCardComponent);
