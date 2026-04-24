export type WinkKind = "effect" | "chat";
export type ApngFallbackState = "pending" | "exporting" | "ready" | "error";

export interface WinkFileAsset {
  bytes: number;
  fileName: string;
  path: string;
  sizeLabel: string | null;
}

export interface WinkApngAsset extends WinkFileAsset {
  fps: number;
  frameCount: number | null;
  transparent: true;
}

export interface WinkManifestItem {
  apng: WinkApngAsset | null;
  aspectRatio: string;
  category: string | null;
  durationMs: number | null;
  edgeGuidance: string | null;
  height: number;
  id: string;
  kind: WinkKind;
  name: string;
  safeArea: string;
  safeAreaGuidance: string;
  svg: WinkFileAsset | null;
  typeLabel: string;
  viewBox: string;
  width: number;
}

export interface WinkManifestGroup {
  edgeGuidance: string | null;
  height: number;
  items: WinkManifestItem[];
  kind: WinkKind;
  label: string;
  safeArea: string;
  safeAreaGuidance: string;
  width: number;
}

export interface WinksManifest {
  generatedAt: string;
  groups: Record<WinkKind, WinkManifestGroup>;
  recommendations: {
    cc213: true;
    fallbackFormat: "apng";
    loop: "infinite";
    primaryFormat: "svg-animation";
    recommendedApngFps: number;
    recommendedDurationMs: {
      max: number;
      min: number;
    };
    transparencyRequired: true;
  };
  schemaVersion: 1;
  tooling: {
    encoder: string;
    fallbackFormat: string;
    optionalOptimizers: {
      oxipng: boolean;
      pngquant: boolean;
    };
    primaryFormat: string;
    renderer: string;
  };
}

export async function fetchWinksManifest() {
  const response = await fetch("/winks/manifest.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load wink manifest (${response.status})`);
  }

  return (await response.json()) as WinksManifest;
}

export function findWinkItem(
  manifest: WinksManifest | undefined,
  kind: WinkKind,
  id: string
) {
  return manifest?.groups[kind]?.items.find((item) => item.id === id);
}

export function formatAssetSize(sizeLabel: string | null | undefined) {
  return sizeLabel ?? "Pending export";
}

export const DEFAULT_APNG_FPS = 15;

export function calculateApngFrameCount(
  durationMs: number | null | undefined,
  fps = DEFAULT_APNG_FPS
) {
  if (!durationMs || !Number.isFinite(durationMs) || !fps || !Number.isFinite(fps)) {
    return null;
  }

  return Math.max(2, Math.round((durationMs / 1000) * fps));
}

export function getExpectedWinkFileName(id: string, format: "apng" | "svg") {
  return `${id}.${format}`;
}

export function getExpectedWinkAssetPath(kind: WinkKind, format: "apng" | "svg", id: string) {
  return `/winks/${kind}/${format}/${getExpectedWinkFileName(id, format)}`;
}

export function resolveApngFallbackState(options: {
  asset?: WinkManifestItem;
  errorMessage?: string | null;
  status?: ApngFallbackState;
}) {
  if (options.status) {
    return options.status;
  }

  if (options.errorMessage) {
    return "error";
  }

  return options.asset?.apng ? "ready" : "pending";
}

export function getApngStatusLabels(state: ApngFallbackState) {
  const labels = ["Transparent", "Optimized", "Looping"];

  if (state === "ready") {
    labels.push("Ready");
  }

  return labels;
}

export function getApngTechnicalInfo(options: {
  durationMs: number | null | undefined;
  fps?: number | null;
  frameCount?: number | null;
  sizeLabel?: string | null;
}) {
  const fps = options.fps ?? DEFAULT_APNG_FPS;
  const frameCount =
    options.frameCount ?? calculateApngFrameCount(options.durationMs, fps);
  const parts = [];

  if (options.durationMs && Number.isFinite(options.durationMs)) {
    parts.push(`${options.durationMs} ms`);
  }

  if (fps && Number.isFinite(fps)) {
    parts.push(`${fps} FPS`);
  }

  if (frameCount && Number.isFinite(frameCount)) {
    parts.push(`${frameCount} frames`);
  }

  if (options.sizeLabel) {
    parts.push(options.sizeLabel);
  }

  return parts;
}
