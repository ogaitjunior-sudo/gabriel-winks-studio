import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  CONFETTI_SHAPES,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createRadialBurst,
  createRainField,
  confettiGlowId,
} from "./_confettiShared";

const TOP_BLAST = createRadialBurst({
  cx: 960,
  cy: 220,
  count: 16,
  radiusX: 420,
  radiusY: 240,
  delayStart: 0.08,
  delayStep: 0.02,
  duration: 4.0,
  sizeMin: 12,
  sizeMax: 22,
});

const HEAVY_RAIN = createRainField({
  count: 22,
  left: 360,
  right: 1560,
  top: 80,
  drop: 940,
  drift: 180,
  delayStart: 0.58,
  delayStep: 0.09,
  duration: 4.0,
  sizeMin: 12,
  sizeMax: 24,
});

const BOUNCE_UP = Array.from({ length: 8 }, (_, index) => ({
  x: 620 + index * 92,
  y: 820 + (index % 2) * 40,
  tx: -70 + (index % 4) * 42,
  ty: -160 - (index % 3) * 42,
  size: 12 + (index % 4) * 3,
  shape: CONFETTI_SHAPES[index % CONFETTI_SHAPES.length],
  color: CONFETTI_ACCENTS[(index + 2) % CONFETTI_ACCENTS.length],
  delay: 1.08 + index * 0.04,
  duration: 4.0,
  rotateStart: index * 16,
  rotateMid: 170 + index * 18,
  rotateEnd: 300 + index * 22,
}));

export function ConfettiRainExplosion({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfre", "top");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[6]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={220} r={260} opacity={0.68} />
      <ConfettiSparkle cx={960} cy={220} size={26} delay={0.14} duration={4.0} />

      {TOP_BLAST.map((piece, index) => (
        <AnimatedConfettiPiece key={`blast-${index}`} piece={piece} />
      ))}
      {HEAVY_RAIN.map((piece, index) => (
        <AnimatedConfettiPiece key={`rain-${index}`} piece={piece} animation="wink-confetti-fall" easing="linear" spinDuration={1.7} />
      ))}
      {BOUNCE_UP.map((piece, index) => (
        <AnimatedConfettiPiece key={`bounce-${index}`} piece={piece} />
      ))}
    </EffectSvg>
  );
}
