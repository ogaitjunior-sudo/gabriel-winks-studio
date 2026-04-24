import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Download,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import type { StageBg } from "@/components/Stage16x9";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type {
  ApngFallbackState,
  WinkKind,
  WinkManifestItem,
} from "@/lib/winkManifest";
import {
  DEFAULT_APNG_FPS,
  calculateApngFrameCount,
  formatAssetSize,
  getApngStatusLabels,
  getApngTechnicalInfo,
  resolveApngFallbackState,
  resolveWinkAssetFileName,
  resolveWinkAssetPath,
} from "@/lib/winkManifest";
import { cn } from "@/lib/utils";

const previewBgClass: Record<StageBg, string> = {
  black: "bg-stage-black",
  checker: "bg-checker",
  white: "bg-stage-white",
};

const apngStatusAppearance: Record<
  ApngFallbackState,
  {
    badge: string;
    description: string;
    helper: string;
    icon: typeof Clock3;
    labelTone: string;
    previewMessage: string;
    title: string;
    tooltip: string;
  }
> = {
  error: {
    badge: "Export failed",
    description: "Transparent raster fallback for clients that do not support SVG animation.",
    helper: "Export failed. Please try again.",
    icon: AlertCircle,
    labelTone:
      "border-red-400/35 bg-red-500/12 text-red-200",
    previewMessage: "Export failed. Please try again.",
    title: "APNG Fallback",
    tooltip: "APNG export failed.",
  },
  exporting: {
    badge: "Generating",
    description: "Transparent raster fallback for clients that do not support SVG animation.",
    helper: "Generating APNG...",
    icon: LoaderCircle,
    labelTone:
      "border-sky-400/35 bg-sky-500/12 text-sky-100",
    previewMessage: "Generating APNG...",
    title: "APNG Fallback",
    tooltip: "APNG export is still running.",
  },
  pending: {
    badge: "Pending export",
    description: "Transparent raster fallback for clients that do not support SVG animation.",
    helper:
      "No APNG generated yet.\n\nRun the export pipeline to create a transparent, optimized fallback version of this animation.",
    icon: Clock3,
    labelTone:
      "border-amber-400/35 bg-amber-500/12 text-amber-100",
    previewMessage:
      "No APNG generated yet.\n\nRun the export pipeline to create a transparent, optimized fallback version of this animation.",
    title: "APNG Fallback",
    tooltip: "Generate APNG first",
  },
  ready: {
    badge: "Ready",
    description: "Transparent raster fallback for clients that do not support SVG animation.",
    helper:
      "APNG ready\n\nThis animation has been exported as a transparent, optimized APNG fallback.",
    icon: CheckCircle2,
    labelTone:
      "border-emerald-400/35 bg-emerald-500/12 text-emerald-100",
    previewMessage:
      "APNG ready\n\nThis animation has been exported as a transparent, optimized APNG fallback.",
    title: "APNG Fallback",
    tooltip: "",
  },
};

interface WinkFormatPreviewPanelProps {
  apngErrorMessage?: string | null;
  apngStatus?: ApngFallbackState;
  asset?: WinkManifestItem;
  bg: StageBg;
  isLoading?: boolean;
  svgPreview?: ReactNode;
  wink: {
    aspectRatio: string;
    durationMs: number;
    height: number;
    id: string;
    kind: WinkKind;
    name: string;
    width: number;
  };
}

export function WinkFormatPreviewPanel({
  apngErrorMessage = null,
  apngStatus,
  asset,
  bg,
  isLoading = false,
  svgPreview,
  wink,
}: WinkFormatPreviewPanelProps) {
  const resolvedApngState = resolveApngFallbackState({
    asset,
    errorMessage: apngErrorMessage,
    status: apngStatus,
  });

  return (
    <section className="gradient-panel space-y-5 rounded-2xl border border-border p-5 shadow-card">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Gabriel Winks Output
          </p>
          <h2 className="text-xl font-bold tracking-tight">Production format preview</h2>
          <p className="text-sm text-muted-foreground">
            SVG Animation stays primary. APNG is the transparent raster fallback for browsers that
            need it.
          </p>
        </div>
        <div className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary">
          Optimized for size &middot; Transparent background &middot; Infinite loop
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
        <PrimarySvgCard asset={asset} bg={bg} isLoading={isLoading} svgPreview={svgPreview} wink={wink} />
        <ApngFallbackCard
          apngErrorMessage={apngErrorMessage}
          asset={asset}
          bg={bg}
          isLoading={isLoading}
          state={resolvedApngState}
          svgPreview={svgPreview}
          wink={wink}
        />
      </div>

      <div className="grid gap-3 rounded-xl border border-border/60 bg-background/30 p-4 text-sm text-muted-foreground md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary/90">Transparency</p>
          <p className="mt-1">
            Alpha is required end to end. APNG fallback assets keep a true transparent background.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary/90">Playback</p>
          <p className="mt-1">
            APNG fallback targets 15 FPS, short 2 to 4 second loops, and infinite playback.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-primary/90">Format policy</p>
          <p className="mt-1">
            GIF is not used for production and WebM is not recommended for transparent overlays.
          </p>
        </div>
      </div>
    </section>
  );
}

function PrimarySvgCard({
  asset,
  bg,
  isLoading,
  svgPreview,
  wink,
}: Pick<WinkFormatPreviewPanelProps, "asset" | "bg" | "isLoading" | "svgPreview" | "wink">) {
  const svgFile = asset?.svg;
  const svgPath = resolveWinkAssetPath(wink.kind, "svg", wink.id, svgFile?.path);
  const svgFileName = resolveWinkAssetFileName(wink.id, "svg", svgFile?.fileName);
  const info = useMemo(() => [`${wink.durationMs} ms`], [wink.durationMs]);

  return (
    <article className="group space-y-4 rounded-2xl border border-border/70 bg-background/40 p-4 shadow-card transition-colors hover:border-primary/25">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Primary
          </div>
          <h3 className="mt-3 text-lg font-semibold">SVG Animation</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Primary production format with transparent vector playback.
          </p>
        </div>
        <div className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          {formatAssetSize(svgFile?.sizeLabel)}
        </div>
      </div>

      <PreviewFrame bg={bg} height={wink.height} width={wink.width}>
        {svgPreview ? (
          <div className="absolute inset-0">{svgPreview}</div>
        ) : svgFile ? (
          <img
            src={svgPath}
            alt={`${wink.name} SVG Animation`}
            className="block h-full w-full object-contain"
            loading="eager"
            decoding="async"
          />
        ) : (
          <PreviewPlaceholder
            message={
              isLoading
                ? "Loading exported SVG metadata..."
                : "SVG preview stays available from the live animation stage above."
            }
          />
        )}
      </PreviewFrame>

      <div className="space-y-3 rounded-xl border border-border/60 bg-background/55 p-3">
        <p className="text-sm font-medium text-foreground">Preferred delivery for production playback.</p>
        <InfoLine items={[...info, formatAssetSize(svgFile?.sizeLabel)]} />
        <LabelRow labels={["Primary", "Vector", "Transparent"]} />
      </div>

      {svgFile ? (
        <Button asChild className="w-full justify-center" size="sm">
          <a href={svgPath} download={svgFileName}>
            <Download className="h-4 w-4" />
            Download SVG
          </a>
        </Button>
      ) : (
        <Button className="w-full justify-center" disabled size="sm" variant="secondary">
          <Download className="h-4 w-4" />
          Download SVG
        </Button>
      )}
    </article>
  );
}

function ApngFallbackCard({
  apngErrorMessage,
  asset,
  bg,
  isLoading,
  state,
  svgPreview,
  wink,
}: {
  apngErrorMessage: string | null;
  asset?: WinkManifestItem;
  bg: StageBg;
  isLoading: boolean;
  state: ApngFallbackState;
  svgPreview?: ReactNode;
  wink: WinkFormatPreviewPanelProps["wink"];
}) {
  const appearance = apngStatusAppearance[state];
  const StatusIcon = appearance.icon;
  const apngFile = asset?.apng;
  const apngPath = resolveWinkAssetPath(wink.kind, "apng", wink.id, apngFile?.path);
  const apngFileName = resolveWinkAssetFileName(wink.id, "apng", apngFile?.fileName);
  const fps = apngFile?.fps ?? DEFAULT_APNG_FPS;
  const frameCount = apngFile?.frameCount ?? calculateApngFrameCount(wink.durationMs, fps);
  const [previewMode, setPreviewMode] = useState<"apng" | "svg">("svg");
  const [apngPreviewFailed, setApngPreviewFailed] = useState(false);
  const apngReady = state === "ready" && !!apngFile;

  useEffect(() => {
    setPreviewMode(apngReady ? "apng" : "svg");
  }, [apngReady, wink.id]);

  useEffect(() => {
    if (!apngReady && previewMode === "apng") {
      setPreviewMode("svg");
    }
  }, [apngReady, previewMode]);

  useEffect(() => {
    setApngPreviewFailed(false);
  }, [apngPath, previewMode, wink.id]);

  const technicalInfo = useMemo(
    () =>
      getApngTechnicalInfo({
        durationMs: wink.durationMs,
        fps,
        frameCount,
        sizeLabel: apngReady ? apngFile?.sizeLabel ?? null : null,
      }),
    [apngFile?.sizeLabel, apngReady, fps, frameCount, wink.durationMs]
  );
  const message = apngPreviewFailed
    ? "APNG preview failed to load"
    : apngErrorMessage || appearance.previewMessage;

  return (
    <article className="group space-y-4 rounded-2xl border border-border/70 bg-background/55 p-4 shadow-card transition-colors hover:border-primary/25">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]",
              appearance.labelTone
            )}
          >
            <StatusIcon className={cn("h-3.5 w-3.5", state === "exporting" && "animate-spin")} />
            {appearance.badge}
          </div>
          <h3 className="mt-3 text-lg font-semibold">{appearance.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{appearance.description}</p>
        </div>
        <div className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          {apngReady ? formatAssetSize(apngFile?.sizeLabel) : appearance.badge}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border/60 bg-background/45 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/90">
            Preview
          </p>
          <ToggleGroup
            className="rounded-full border border-border/70 bg-background/80 p-1"
            size="sm"
            type="single"
            value={previewMode}
            onValueChange={(value) => {
              if (value === "svg" || value === "apng") {
                setPreviewMode(value);
              }
            }}
            variant="outline"
          >
            <ToggleGroupItem className="rounded-full text-xs" value="svg">
              SVG
            </ToggleGroupItem>
            <ToggleGroupItem className="rounded-full text-xs" disabled={!apngReady} value="apng">
              APNG
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <PreviewFrame bg={bg} height={wink.height} width={wink.width}>
          {previewMode === "svg" ? (
            svgPreview ? (
              <div className="absolute inset-0">{svgPreview}</div>
            ) : (
              <PreviewPlaceholder
                message={
                  isLoading
                    ? "Loading exported SVG metadata..."
                    : "SVG preview remains available from the live animation stage above."
                }
              />
            )
          ) : apngReady && !apngPreviewFailed ? (
            <img
              src={apngPath}
              alt={`${wink.name} APNG Fallback`}
              className="block h-full w-full object-contain"
              loading="eager"
              decoding="async"
              onError={() => setApngPreviewFailed(true)}
              onLoad={() => setApngPreviewFailed(false)}
            />
          ) : apngReady ? (
            <PreviewPlaceholder message="APNG preview failed to load" />
          ) : (
            <PreviewPlaceholder message="Generate APNG first" />
          )}
        </PreviewFrame>
      </div>

      <div className="space-y-3 rounded-xl border border-border/60 bg-background/60 p-3">
        <div className="space-y-1">
          {message.split("\n\n").map((paragraph) => (
            <p key={paragraph} className="text-sm text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
        <InfoLine items={technicalInfo} />
        <LabelRow labels={getApngStatusLabels(state)} />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-foreground">{apngFileName}</div>
          <div className="text-xs text-muted-foreground">
            {state === "ready"
              ? "Transparent raster fallback is ready to download."
              : "Download unlocks when the APNG fallback file exists."}
          </div>
        </div>
        <DownloadButton
          disabled={!apngReady}
          fileName={apngFileName}
          href={apngPath}
          tooltip={appearance.tooltip}
        />
      </div>
    </article>
  );
}

function PreviewFrame({
  bg,
  children,
  height,
  width,
}: {
  bg: StageBg;
  children: ReactNode;
  height: number;
  width: number;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/60 shadow-inner",
        previewBgClass[bg]
      )}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {children}
      <div className="pointer-events-none absolute inset-[10%] rounded-[18px] border border-dashed border-sky-300/55" />
    </div>
  );
}

function PreviewPlaceholder({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
      <p className="max-w-xs whitespace-pre-line">{message}</p>
    </div>
  );
}

function InfoLine({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="inline-flex items-center gap-2">
          {index > 0 ? <span className="text-muted-foreground/60">&middot;</span> : null}
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function LabelRow({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <span
          key={label}
          className="rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function DownloadButton({
  disabled,
  fileName,
  href,
  tooltip,
}: {
  disabled: boolean;
  fileName: string;
  href: string;
  tooltip: string;
}) {
  const button = disabled ? (
    <Button
      className="min-w-[160px] justify-center transition-colors"
      disabled
      size="sm"
      variant="secondary"
    >
      <Download className="h-4 w-4" />
      Download APNG
    </Button>
  ) : (
    <Button asChild className="min-w-[160px] justify-center transition-colors" size="sm">
      <a href={href} download={fileName}>
        <Download className="h-4 w-4" />
        Download APNG
      </a>
    </Button>
  );

  if (!disabled) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">{button}</span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
