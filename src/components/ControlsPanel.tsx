import { Pause, Play, RotateCcw, Repeat, Eye, EyeOff, Download, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { StageBg } from "@/components/Stage16x9";
import type { ExportBackground } from "@/lib/exportSvg";

interface ControlsPanelProps {
  playing: boolean;
  loop: boolean;
  safeArea: boolean;
  bg: StageBg;
  exportBg: ExportBackground;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onToggleLoop: (v: boolean) => void;
  onToggleSafeArea: (v: boolean) => void;
  onChangeBg: (v: StageBg) => void;
  onChangeExportBg: (v: ExportBackground) => void;
  onChangeSpeed: (v: number) => void;
  onExportSvg: () => void;
}

export function ControlsPanel(props: ControlsPanelProps) {
  const { playing, loop, safeArea, bg, exportBg, speed } = props;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/60 p-3 backdrop-blur">
      <div className="flex items-center gap-2">
        {playing ? (
          <Button size="sm" variant="secondary" onClick={props.onPause} className="gap-1.5">
            <Pause className="h-4 w-4" /> Pause
          </Button>
        ) : (
          <Button size="sm" onClick={props.onPlay} className="gap-1.5">
            <Play className="h-4 w-4" /> Play
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={props.onReplay} className="gap-1.5">
          <RotateCcw className="h-4 w-4" /> Replay
        </Button>
      </div>

      <div className="mx-2 h-6 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Repeat className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="loop" className="text-xs">Loop</Label>
        <Switch id="loop" checked={loop} onCheckedChange={props.onToggleLoop} />
      </div>

      <div className="flex items-center gap-2">
        {safeArea ? <Eye className="h-4 w-4 text-muted-foreground" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
        <Label htmlFor="safe" className="text-xs">Safe Area</Label>
        <Switch id="safe" checked={safeArea} onCheckedChange={props.onToggleSafeArea} />
      </div>

      <div className="mx-2 h-6 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground">Background</Label>
        <ToggleGroup
          type="single"
          size="sm"
          value={bg}
          onValueChange={(v) => v && props.onChangeBg(v as StageBg)}
        >
          <ToggleGroupItem value="checker" className="text-xs">Checker</ToggleGroupItem>
          <ToggleGroupItem value="black" className="text-xs">Black</ToggleGroupItem>
          <ToggleGroupItem value="white" className="text-xs">White</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="mx-2 h-6 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground">Export</Label>
        <ToggleGroup
          type="single"
          size="sm"
          value={exportBg}
          onValueChange={(v) => v && props.onChangeExportBg(v as ExportBackground)}
        >
          <ToggleGroupItem value="transparent" className="text-xs">Transparent</ToggleGroupItem>
          <ToggleGroupItem value="black" className="text-xs">Black</ToggleGroupItem>
          <ToggleGroupItem value="white" className="text-xs">White</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="mx-2 h-6 w-px bg-border" />

      <div className="flex min-w-[220px] flex-1 items-center gap-3">
        <Timer className="h-4 w-4 text-muted-foreground" />
        <Label className="whitespace-nowrap text-xs text-muted-foreground">Speed</Label>
        <Slider
          value={[speed]}
          min={0.5}
          max={2}
          step={0.1}
          onValueChange={(v) => props.onChangeSpeed(v[0])}
          className="flex-1"
        />
        <span className="w-12 text-right font-mono text-xs tabular-nums text-foreground">
          {speed.toFixed(1)}x
        </span>
      </div>

      <div className="ml-auto">
        <Button size="sm" variant="default" onClick={props.onExportSvg} className="gap-1.5">
          <Download className="h-4 w-4" /> Download SVG
        </Button>
      </div>
    </div>
  );
}
