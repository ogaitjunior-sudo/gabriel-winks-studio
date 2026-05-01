import type { EffectCategory } from "@/data/effects";
import { parseCssTimeToMs } from "@/lib/effectPlayback";

export const EFFECT_WINK_WIDTH = 1920;
export const EFFECT_WINK_HEIGHT = 1080;
export const EFFECT_WINK_VIEW_BOX = "0 0 1920 1080";
export const EFFECT_WINK_ASPECT_RATIO = "16:9";
export const EFFECT_WINK_SAFE_AREA = "centered";
export const EFFECT_WINK_TYPE = "effect";
export const EFFECT_WINK_FORMAT = "svg";

export interface EffectWinkMetadata {
  id: string;
  name: string;
  category: EffectCategory;
  type: typeof EFFECT_WINK_TYPE;
  format: typeof EFFECT_WINK_FORMAT;
  width: typeof EFFECT_WINK_WIDTH;
  height: typeof EFFECT_WINK_HEIGHT;
  aspectRatio: typeof EFFECT_WINK_ASPECT_RATIO;
  transparent: true;
  safeArea: typeof EFFECT_WINK_SAFE_AREA;
  durationMs: number;
}

export interface EffectWinkMetadataSource {
  id: string;
  name: string;
  category: EffectCategory;
  duration: string;
}

export const EFFECT_KEYFRAMES_CSS = `
@keyframes wink-burst {
  0% { transform: scale(0); opacity: 0; }
  20% { opacity: 1; }
  60% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.15); opacity: 0; }
}
@keyframes wink-fade-loop {
  0%, 100% { opacity: 0; }
  10%, 70% { opacity: 1; }
}
@keyframes wink-spark-fall {
  0% { transform: translateY(-40px); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(220px); opacity: 0; }
}
@keyframes wink-comet {
  0% { transform: translate(0,0) scale(0.6); opacity: 0; }
  30% { opacity: 1; }
  70% { transform: translate(var(--tx,0), var(--ty,-200px)) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx,0), var(--ty,-200px)) scale(1.2); opacity: 0; }
}
@keyframes wink-ring-expand {
  0% { transform: scale(0.1); opacity: 0; stroke-width: 8; }
  20% { opacity: 1; }
  100% { transform: scale(1); opacity: 0; stroke-width: 1; }
}
@keyframes wink-twinkle {
  0%, 100% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}
@keyframes wink-pop {
  0% { transform: scale(0) rotate(-20deg); opacity: 0; }
  60% { transform: scale(1.15) rotate(5deg); opacity: 1; }
  80% { transform: scale(1) rotate(0); opacity: 1; }
  100% { transform: scale(1) rotate(0); opacity: 0; }
}
@keyframes wink-swirl {
  0% { transform: rotate(0deg) translateX(180px) scale(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: rotate(360deg) translateX(40px) scale(1); opacity: 0; }
}
@keyframes wink-shower {
  0% { transform: translateY(-60px) rotate(0); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translateY(260px) rotate(180deg); opacity: 0; }
}
@keyframes wink-trail {
  0% { offset-distance: 0%; opacity: 0; transform: scale(0.4); }
  10% { opacity: 1; transform: scale(1); }
  90% { opacity: 1; }
  100% { offset-distance: 100%; opacity: 0; transform: scale(0.6); }
}
@keyframes wink-bounce-in {
  0% { transform: translateY(-300px) scale(0.6); opacity: 0; }
  50% { transform: translateY(20px) scale(1.05); opacity: 1; }
  70% { transform: translateY(-10px) scale(0.98); }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes wink-bounce-loop {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes wink-pop-up {
  0% { transform: translateY(300px); opacity: 0; }
  60% { transform: translateY(-15px); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes wink-featured-pop {
  0%, 100% { transform: translateY(0) scale(0.78) rotate(-6deg); opacity: 1; }
  12% { transform: translateY(-26px) scale(1.3) rotate(4deg); opacity: 1; }
  22% { transform: translateY(10px) scale(0.95) rotate(-2deg); opacity: 1; }
  34%, 76% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
  88% { transform: translateY(-8px) scale(1.06) rotate(0deg); opacity: 1; }
}
@keyframes wink-featured-burst {
  0%, 40%, 100% { transform: scale(0.38); opacity: 0; }
  48% { transform: scale(0.92); opacity: 0.95; }
  60% { transform: scale(1.18); opacity: 0.42; }
  72% { transform: scale(1.34); opacity: 0; }
}
@keyframes wink-orbit {
  from { transform: rotate(0deg) translateX(var(--orbit-r,160px)) rotate(0deg); }
  to { transform: rotate(360deg) translateX(var(--orbit-r,160px)) rotate(-360deg); }
}
@keyframes wink-scatter {
  0%, 100% { transform: translate(var(--sx,0), var(--sy,0)) scale(0.9); opacity: 0.6; }
  50% { transform: translate(calc(var(--sx,0) * 1.2), calc(var(--sy,0) * 1.2)) scale(1.05); opacity: 1; }
}
@keyframes wink-sparkle {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
}
@keyframes wink-glow-pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
}
@keyframes wink-confetti-launch {
  0% { transform: translate(0,0) rotate(var(--r0,0deg)) scale(0.28); opacity: 0; }
  14% { opacity: 1; }
  72% { transform: translate(var(--tx,0px), var(--ty,0px)) rotate(var(--r1,180deg)) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx,0px), var(--ty,0px)) rotate(var(--r2,320deg)) scale(0.82); opacity: 0; }
}
@keyframes wink-confetti-fall {
  0% { transform: translate(0,-90px) rotate(var(--r0,0deg)) scale(0.7); opacity: 0; }
  14% { opacity: 1; }
  82% { opacity: 1; }
  100% { transform: translate(var(--tx,0px), var(--ty,720px)) rotate(var(--r1,260deg)) scale(1); opacity: 0; }
}
@keyframes wink-confetti-shimmer {
  0%, 100% { transform: rotate(var(--r0,0deg)) scale(0.92); }
  50% { transform: rotate(var(--r1,180deg)) scale(1.08); }
}
@keyframes wink-confetti-wave {
  0% { transform: translate(var(--sx,-180px), var(--sy,0px)) rotate(var(--r0,0deg)) scale(0.5); opacity: 0; }
  18% { opacity: 1; }
  58% { transform: translate(0,0) rotate(var(--r1,180deg)) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx,180px), var(--ty,0px)) rotate(var(--r2,360deg)) scale(0.78); opacity: 0; }
}
@keyframes wink-bingo-arrive {
  0% { transform: translate(var(--from-x,0), var(--from-y,0)) scale(0.34); opacity: 0; }
  18% { opacity: 1; }
  38% { transform: translate(var(--overshoot-x,0), var(--overshoot-y,0)) scale(1.09); opacity: 1; }
  46%, 100% { transform: translate(0,0) scale(1); opacity: 1; }
}
@keyframes wink-bingo-countdown {
  0%, 100% { opacity: 0; transform: scale(0.36); }
  5% { opacity: 1; transform: scale(0.92); }
  10% { opacity: 1; transform: scale(1.06); }
  16% { opacity: 0; transform: scale(1.22); }
}
@keyframes wink-bingo-spiral-letter {
  0% { transform: rotate(var(--spin-start,-220deg)) translateX(var(--orbit-r,320px)) scale(0.3); opacity: 0; }
  22% { opacity: 1; }
  42% { transform: rotate(var(--spin-mid,24deg)) translateX(18px) scale(1.1); opacity: 1; }
  52%, 100% { transform: rotate(0deg) translateX(0) scale(1); opacity: 1; }
}
@keyframes wink-bingo-final-bounce {
  0%, 54%, 100% { transform: translateY(0) scale(1); }
  64% { transform: translateY(-22px) scale(1.06); }
  76% { transform: translateY(0) scale(0.98); }
  88% { transform: translateY(-10px) scale(1.02); }
}
@keyframes wink-bingo-impact {
  0%, 56%, 100% { opacity: 0; transform: scale(0.52); }
  66% { opacity: 0.95; transform: scale(1.04); }
  78% { opacity: 0.38; transform: scale(1.34); }
}
`.trim();

export function createEffectWinkMetadata(effect: EffectWinkMetadataSource): EffectWinkMetadata {
  return {
    id: effect.id,
    name: effect.name,
    category: effect.category,
    type: EFFECT_WINK_TYPE,
    format: EFFECT_WINK_FORMAT,
    width: EFFECT_WINK_WIDTH,
    height: EFFECT_WINK_HEIGHT,
    aspectRatio: EFFECT_WINK_ASPECT_RATIO,
    transparent: true,
    safeArea: EFFECT_WINK_SAFE_AREA,
    durationMs: parseCssTimeToMs(effect.duration),
  };
}
