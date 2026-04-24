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

const BURSTS = [
  ...createRadialBurst({ cx: 720, cy: 420, count: 8, radiusX: 220, radiusY: 160, delayStart: 0.12, delayStep: 0.018, duration: 4.0, sizeMin: 12, sizeMax: 20 }),
  ...createRadialBurst({ cx: 1180, cy: 420, count: 8, radiusX: 220, radiusY: 160, delayStart: 0.4, delayStep: 0.018, duration: 4.0, sizeMin: 12, sizeMax: 20, colorOffset: 2 }),
  ...createRadialBurst({ cx: 960, cy: 560, count: 14, radiusX: 420, radiusY: 280, delayStart: 0.78, delayStep: 0.022, duration: 4.0, sizeMin: 14, sizeMax: 24, colorOffset: 4 }),
];

const RIBBONS = [
  ...createFanLaunch({
    x: 260,
    y: 860,
    count: 6,
    angleStart: -78,
    angleEnd: -36,
    distance: 820,
    delayStart: 0.2,
    delayStep: 0.03,
    duration: 4.0,
    sizeMin: 18,
    sizeMax: 28,
    shapes: ["ribbon", "streamer", "ribbon"] as const,
  }),
  ...createFanLaunch({
    x: 1660,
    y: 860,
    count: 6,
    angleStart: -144,
    angleEnd: -102,
    distance: 820,
    delayStart: 0.2,
    delayStep: 0.03,
    duration: 4.0,
    sizeMin: 18,
    sizeMax: 28,
    shapes: ["ribbon", "streamer", "ribbon"] as const,
    colorOffset: 2,
  }),
];

const FALL = createRainField({
  count: 14,
  left: 420,
  right: 1500,
  top: 140,
  drop: 760,
  drift: 150,
  delayStart: 1.18,
  delayStep: 0.08,
  duration: 4.0,
  sizeMin: 10,
  sizeMax: 18,
});

export function ConfettiCarnivalBlast({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfcab", "carnival");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[5]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={520} r={320} opacity={0.7} />
      <ConfettiSparkle cx={720} cy={420} size={18} delay={0.18} duration={4.0} />
      <ConfettiSparkle cx={1180} cy={420} size={18} delay={0.46} duration={4.0} />
      <ConfettiSparkle cx={960} cy={560} size={26} delay={0.86} duration={4.0} />

      {[...BURSTS, ...RIBBONS].map((piece, index) => (
        <AnimatedConfettiPiece key={`main-${index}`} piece={piece} spinDuration={1.8} />
      ))}
      {FALL.map((piece, index) => (
        <AnimatedConfettiPiece key={`fall-${index}`} piece={piece} animation="wink-confetti-fall" easing="linear" />
      ))}
    </EffectSvg>
  );
}
