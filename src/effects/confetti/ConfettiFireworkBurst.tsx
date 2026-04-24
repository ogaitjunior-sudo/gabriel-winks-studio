import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createRadialBurst,
  createRainField,
  confettiGlowId,
} from "./_confettiShared";

const CORE_BURST = createRadialBurst({
  cx: 960,
  cy: 500,
  count: 20,
  radiusX: 520,
  radiusY: 360,
  delayStart: 0.12,
  delayStep: 0.03,
  duration: 3.6,
});

const RIBBONS = createRadialBurst({
  cx: 960,
  cy: 500,
  count: 8,
  radiusX: 420,
  radiusY: 300,
  angleOffset: Math.PI / 8,
  delayStart: 0.2,
  delayStep: 0.04,
  duration: 3.6,
  sizeMin: 18,
  sizeMax: 28,
  shapes: ["ribbon", "streamer", "ribbon", "diamond"] as const,
  colorOffset: 1,
});

const LEFTOVERS = createRainField({
  count: 10,
  left: 560,
  right: 1360,
  top: 180,
  drop: 640,
  drift: 120,
  delayStart: 1.06,
  delayStep: 0.08,
  duration: 3.6,
  sizeMin: 10,
  sizeMax: 18,
  colorOffset: 3,
  shapeOffset: 2,
});

export function ConfettiFireworkBurst({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cffb", "core");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={500} r={240} opacity={0.84} />
      <ConfettiSparkle cx={960} cy={500} size={32} delay={0.18} duration={3.6} />

      {CORE_BURST.map((piece, index) => (
        <AnimatedConfettiPiece key={`core-${index}`} piece={piece} />
      ))}
      {RIBBONS.map((piece, index) => (
        <AnimatedConfettiPiece key={`ribbon-${index}`} piece={piece} spinDuration={1.9} />
      ))}
      {LEFTOVERS.map((piece, index) => (
        <AnimatedConfettiPiece key={`fall-${index}`} piece={piece} animation="wink-confetti-fall" easing="linear" />
      ))}
    </EffectSvg>
  );
}
