import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ControlsPanel } from "@/components/ControlsPanel";
import { EffectBrowser } from "@/components/EffectBrowser";
import { SafeAreaOverlay } from "@/components/SafeAreaOverlay";
import { SelectedEffectPanel } from "@/components/SelectedEffectPanel";
import { Stage16x9, type StageBg } from "@/components/Stage16x9";
import { WinkLibrarySection } from "@/components/WinkLibrarySection";
import { WinkFormatPreviewPanel } from "@/components/WinkFormatPreviewPanel";
import { EFFECTS, type EffectMeta } from "@/data/effects";
import {
  ALL_EFFECTS_FILTER,
  EFFECT_COUNTS_BY_CATEGORY,
  type EffectFilter,
  filterEffects,
  findEffectById,
  groupEffectsByCategory,
} from "@/lib/effectCatalog";
import { applyPlaybackSpeed, parseCssTimeToMs } from "@/lib/effectPlayback";
import {
  exportEffectAsSvg,
  exportEffectComponentAsSvg,
  type ExportBackground,
} from "@/lib/exportSvg";
import { fetchWinksManifest, findWinkItem } from "@/lib/winkManifest";

const Index = () => {
  const [selectedId, setSelectedId] = useState(EFFECTS[0].id);
  const [playing, setPlaying] = useState(true);
  const [loop, setLoop] = useState(true);
  const [safeArea, setSafeArea] = useState(true);
  const [bg, setBg] = useState<StageBg>("checker");
  const [exportBg, setExportBg] = useState<ExportBackground>("transparent");
  const [filter, setFilter] = useState<EffectFilter>(ALL_EFFECTS_FILTER);
  const [query, setQuery] = useState("");
  const [speed, setSpeed] = useState(1);
  const [stageKey, setStageKey] = useState(0);
  const [singleRunComplete, setSingleRunComplete] = useState(false);
  const effectRef = useRef<HTMLDivElement>(null);

  const deferredQuery = useDeferredValue(query);
  const { data: winksManifest, isLoading: isWinksManifestLoading } = useQuery({
    queryFn: fetchWinksManifest,
    queryKey: ["winks-manifest"],
    retry: false,
    staleTime: 60_000,
  });

  const selected = useMemo(
    () => findEffectById(selectedId) ?? EFFECTS[0],
    [selectedId]
  );

  const filtered = useMemo(
    () => filterEffects(EFFECTS, filter, deferredQuery),
    [deferredQuery, filter]
  );

  const groupedEffects = useMemo(
    () => groupEffectsByCategory(filtered),
    [filtered]
  );
  const selectedWinkAsset = useMemo(
    () => findWinkItem(winksManifest, "effect", selected.id),
    [selected.id, winksManifest]
  );
  const selectedWinkPreview = useMemo(
    () => ({
      aspectRatio: selectedWinkAsset?.aspectRatio ?? "16:9",
      durationMs: parseCssTimeToMs(selected.duration),
      height: selectedWinkAsset?.height ?? 1080,
      id: selected.id,
      kind: "effect" as const,
      name: selected.name,
      width: selectedWinkAsset?.width ?? 1920,
    }),
    [selected.duration, selected.id, selected.name, selectedWinkAsset]
  );

  const SelectedComp = selected.Component;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const svg = effectRef.current?.querySelector("svg") as SVGSVGElement | null;
      applyPlaybackSpeed(svg, speed);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selectedId, speed, stageKey]);

  useEffect(() => {
    if (loop || !playing) return;

    const runTimeMs = parseCssTimeToMs(selected.duration) / Math.max(speed, 0.1);
    if (!runTimeMs) return;

    const timeout = window.setTimeout(() => {
      setPlaying(false);
      setSingleRunComplete(true);
    }, runTimeMs);

    return () => window.clearTimeout(timeout);
  }, [loop, playing, selected.duration, speed, stageKey]);

  const handleReplay = useCallback(() => {
    setStageKey((currentKey) => currentKey + 1);
    setPlaying(true);
    setSingleRunComplete(false);
  }, []);

  const handlePlay = useCallback(() => {
    if (!loop) {
      handleReplay();
      return;
    }

    setPlaying(true);
    setSingleRunComplete(false);
  }, [handleReplay, loop]);

  const handlePause = useCallback(() => {
    setPlaying(false);
  }, []);

  const handleSelectEffect = useCallback((effect: EffectMeta) => {
    setSelectedId(effect.id);
    setStageKey((currentKey) => currentKey + 1);
    setPlaying(true);
    setSingleRunComplete(false);
  }, []);

  const handleExport = useCallback(() => {
    try {
      exportEffectAsSvg(effectRef.current, selected.name, {
        background: exportBg,
        speed,
      });
      toast.success(`Exported "${selected.name}.svg" with ${exportBg} background`);
    } catch {
      toast.error("Failed to export SVG");
    }
  }, [exportBg, selected.name, speed]);

  const handleDownloadEffect = useCallback((effect: EffectMeta) => {
    try {
      exportEffectComponentAsSvg(effect.Component, effect.name, {
        background: exportBg,
        speed,
      });
      toast.success(`Downloaded "${effect.name}.svg" with ${exportBg} background`);
    } catch {
      toast.error("Failed to download SVG");
    }
  }, [exportBg, speed]);

  const handleChangeFilter = useCallback((next: EffectFilter) => {
    startTransition(() => setFilter(next));
  }, []);

  const handleChangeQuery = useCallback((next: string) => {
    startTransition(() => setQuery(next));
  }, []);

  const handleToggleLoop = useCallback((next: boolean) => {
    setLoop(next);
    setSingleRunComplete(false);

    if (next) {
      setPlaying(true);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur">
        <div className="container flex flex-col gap-2 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                <span className="text-gradient-gold">Gabriel Winks</span>{" "}
                <span className="text-foreground">Studio</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Gabriel Winks transparent SVG Animation overlays with APNG fallback support - 16:9 - 1920x1080
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container space-y-8 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-5">
            <Stage16x9 bg={bg}>
              <div
                key={stageKey}
                ref={effectRef}
                className={`effect-stage absolute inset-0 ${loop ? "" : "effect-single-run"}`}
              >
                <SelectedComp playing={playing} />
              </div>
              <SafeAreaOverlay visible={safeArea} />
            </Stage16x9>

            <ControlsPanel
              playing={playing}
              loop={loop}
              safeArea={safeArea}
              bg={bg}
              exportBg={exportBg}
              speed={speed}
              onPlay={handlePlay}
              onPause={handlePause}
              onReplay={handleReplay}
              onToggleLoop={handleToggleLoop}
              onToggleSafeArea={setSafeArea}
              onChangeBg={setBg}
              onChangeExportBg={setExportBg}
              onChangeSpeed={setSpeed}
              onExportSvg={handleExport}
            />

            <WinkFormatPreviewPanel
              asset={selectedWinkAsset}
              bg={bg}
              isLoading={isWinksManifestLoading}
              svgPreview={<SelectedComp playing={playing} />}
              wink={selectedWinkPreview}
            />

            {!loop && singleRunComplete ? (
              <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                Single-run mode completed. Use Replay or Play to launch the effect again.
              </div>
            ) : null}

            <EffectBrowser
              categoryCounts={EFFECT_COUNTS_BY_CATEGORY}
              filter={filter}
              filteredCount={filtered.length}
              groups={groupedEffects}
              query={query}
              selectedId={selectedId}
              totalCount={EFFECTS.length}
              onChangeFilter={handleChangeFilter}
              onChangeQuery={handleChangeQuery}
              onDownloadEffect={handleDownloadEffect}
              onSelectEffect={handleSelectEffect}
            />
          </section>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <SelectedEffectPanel effect={selected} exportBg={exportBg} loop={loop} speed={speed} />
          </aside>
        </div>

        <WinkLibrarySection isLoading={isWinksManifestLoading} manifest={winksManifest} />
      </main>

      <footer className="container py-8 text-center text-xs text-muted-foreground">
        Gabriel Winks Studio - SVG Animation primary, APNG transparent fallback
      </footer>
    </div>
  );
};

export default Index;
