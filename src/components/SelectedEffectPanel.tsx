import { Sparkles } from "lucide-react";

import { CATEGORY_COLORS, type EffectMeta } from "@/data/effects";
import { formatPlaybackSpeed, formatRuntime } from "@/lib/effectPlayback";
import type { ExportBackground } from "@/lib/exportSvg";
import { cn } from "@/lib/utils";

interface SelectedEffectPanelProps {
  effect: EffectMeta;
  exportBg: ExportBackground;
  loop: boolean;
  speed: number;
}

export function SelectedEffectPanel({
  effect,
  exportBg,
  loop,
  speed,
}: SelectedEffectPanelProps) {
  const exportBgLabel =
    exportBg === "transparent"
      ? "Transparent"
      : exportBg === "black"
        ? "Black"
        : "White";

  return (
    <div className="gradient-panel space-y-5 rounded-2xl border border-border p-5 shadow-card">
      <div>
        <span
          className={cn(
            "inline-block rounded-full border bg-gradient-to-br px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            CATEGORY_COLORS[effect.category]
          )}
        >
          {effect.category}
        </span>
        <h2 className="mt-2 text-xl font-bold leading-tight">{effect.name}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Transparent overlay artwork with SVG Animation as the primary delivery format and APNG
          reserved for transparent raster fallback.
        </p>
      </div>

      <dl className="space-y-2 text-sm">
        <Row label="Name" value={effect.name} />
        <Row label="Category" value={effect.category} />
        <Row label="Base Duration" value={effect.duration} />
        <Row label="Current Runtime" value={formatRuntime(effect.duration, speed)} />
        <Row label="Speed" value={formatPlaybackSpeed(speed)} />
        <Row label="Primary" value="SVG Animation" />
        <Row label="Fallback" value="APNG" />
        <Row label="APNG Target" value="15 FPS / infinite" />
        <Row label="Export Bg" value={exportBgLabel} highlight={exportBg === "transparent"} />
        <Row label="Aspect Ratio" value="16:9" />
        <Row label="Ideal Size" value="1920 x 1080" />
        <Row label="Usage" value="Overlay / Full Screen" />
        <Row label="Loop" value={loop ? "Enabled" : "Single run"} />
      </dl>

      <div className="rounded-lg border border-border/60 bg-background/50 p-3">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Export ready
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Browser-side SVG downloads can still be saved with transparent, black, or white
          backgrounds. Production APNG exports stay transparency-only to preserve alpha correctly.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 pb-1.5 last:border-0 last:pb-0">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={cn("text-right text-sm font-medium", highlight && "text-primary")}>{value}</dd>
    </div>
  );
}
