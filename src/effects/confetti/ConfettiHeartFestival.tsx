import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createHeartBurst,
  createRadialBurst,
  createRainField,
  confettiGlowId,
} from "./_confettiShared";

const HEART = createHeartBurst({
  cx: 960,
  cy: 500,
  count: 20,
  scale: 20,
  delayStart: 0.16,
  delayStep: 0.03,
  duration: 3.8,
  palette: [CONFETTI_ACCENTS[0], CONFETTI_ACCENTS[1], CONFETTI_ACCENTS[4], CONFETTI_ACCENTS[6]] as const,
  shapes: ["circle", "star", "diamond", "rect"] as const,
});

const EXPLODE = createRadialBurst({
  cx: 960,
  cy: 500,
  count: 12,
  radiusX: 400,
  radiusY: 280,
  delayStart: 1.16,
  delayStep: 0.022,
  duration: 3.8,
  sizeMin: 12,
  sizeMax: 20,
  colorOffset: 2,
});

const TRAIL = createRainField({
  count: 8,
  left: 680,
  right: 1240,
  top: 180,
  drop: 520,
  drift: 90,
  delayStart: 1.42,
  delayStep: 0.07,
  duration: 3.8,
  sizeMin: 10,
  sizeMax: 16,
});

export function ConfettiHeartFestival({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfhf", "heart");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[0]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={500} r={260} opacity={0.8} delay="0.32s" />
      <ConfettiSparkle cx={860} cy={410} size={16} delay={0.64} duration={3.8} />
      <ConfettiSparkle cx={1060} cy={410} size={16} delay={0.68} duration={3.8} />
      <ConfettiSparkle cx={960} cy={640} size={14} delay={0.78} duration={3.8} opacity={0.7} />

      {HEART.map((piece, index) => (
        <AnimatedConfettiPiece key={`heart-${index}`} piece={piece} />
      ))}
      {EXPLODE.map((piece, index) => (
        <AnimatedConfettiPiece key={`explode-${index}`} piece={piece} />
      ))}
      {TRAIL.map((piece, index) => (
        <AnimatedConfettiPiece key={`trail-${index}`} piece={piece} animation="wink-confetti-fall" easing="linear" />
      ))}
    </EffectSvg>
  );
}
