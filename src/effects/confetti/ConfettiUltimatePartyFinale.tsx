import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createFanLaunch,
  createRadialBurst,
  createRainField,
  confettiGlowId,
} from "./_confettiShared";

const SMALL_POPS = [
  ...createRadialBurst({ cx: 760, cy: 420, count: 6, radiusX: 120, radiusY: 90, delayStart: 0.12, delayStep: 0.018, duration: 4.8, sizeMin: 10, sizeMax: 16 }),
  ...createRadialBurst({ cx: 1160, cy: 420, count: 6, radiusX: 120, radiusY: 90, delayStart: 0.36, delayStep: 0.018, duration: 4.8, sizeMin: 10, sizeMax: 16, colorOffset: 2 }),
  ...createRadialBurst({ cx: 960, cy: 320, count: 6, radiusX: 120, radiusY: 90, delayStart: 0.6, delayStep: 0.018, duration: 4.8, sizeMin: 10, sizeMax: 16, colorOffset: 4 }),
];

const MASSIVE_CENTER = createRadialBurst({
  cx: 960,
  cy: 460,
  count: 24,
  radiusX: 660,
  radiusY: 400,
  delayStart: 1.0,
  delayStep: 0.02,
  duration: 4.8,
  sizeMin: 14,
  sizeMax: 30,
});

const SIDE_CANNONS = [
  ...createFanLaunch({
    x: 240,
    y: 920,
    count: 12,
    angleStart: -82,
    angleEnd: -26,
    distance: 940,
    delayStart: 1.24,
    delayStep: 0.026,
    duration: 4.8,
    sizeMin: 16,
    sizeMax: 28,
    shapes: ["ribbon", "streamer", "rect", "diamond"] as const,
  }),
  ...createFanLaunch({
    x: 1680,
    y: 920,
    count: 12,
    angleStart: -154,
    angleEnd: -98,
    distance: 940,
    delayStart: 1.24,
    delayStep: 0.026,
    duration: 4.8,
    sizeMin: 16,
    sizeMax: 28,
    shapes: ["ribbon", "streamer", "rect", "circle"] as const,
    colorOffset: 2,
  }),
];

const HEAVY_RAIN = createRainField({
  count: 24,
  left: 340,
  right: 1580,
  top: 120,
  drop: 920,
  drift: 190,
  delayStart: 1.82,
  delayStep: 0.07,
  duration: 4.8,
  sizeMin: 12,
  sizeMax: 24,
  colorOffset: 1,
});

const FINAL_SPARKLES = [
  { x: 720, y: 300, size: 18, delay: 3.16 },
  { x: 960, y: 250, size: 26, delay: 3.26 },
  { x: 1200, y: 300, size: 18, delay: 3.36 },
];

export function ConfettiUltimatePartyFinale({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfupf", "ultimate");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={460} r={360} opacity={0.54} delay="0.94s" />
      <ConfettiSparkle cx={960} cy={460} size={38} delay={1.06} duration={4.8} />
      {FINAL_SPARKLES.map((sparkle, index) => (
        <ConfettiSparkle key={index} cx={sparkle.x} cy={sparkle.y} size={sparkle.size} delay={sparkle.delay} duration={4.8} opacity={0.74} />
      ))}

      {[...SMALL_POPS, ...MASSIVE_CENTER, ...SIDE_CANNONS].map((piece, index) => (
        <AnimatedConfettiPiece key={`main-${index}`} piece={piece} spinDuration={1.75} />
      ))}
      {HEAVY_RAIN.map((piece, index) => (
        <AnimatedConfettiPiece key={`rain-${index}`} piece={piece} animation="wink-confetti-fall" easing="linear" spinDuration={1.9} />
      ))}
    </EffectSvg>
  );
}
