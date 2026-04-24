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

const MASSIVE_BURST = createRadialBurst({
  cx: 960,
  cy: 520,
  count: 26,
  radiusX: 680,
  radiusY: 420,
  delayStart: 0.08,
  delayStep: 0.024,
  duration: 4.0,
  sizeMin: 14,
  sizeMax: 30,
});

const INNER_BURST = createRadialBurst({
  cx: 960,
  cy: 520,
  count: 12,
  radiusX: 340,
  radiusY: 230,
  angleOffset: Math.PI / 12,
  delayStart: 0.18,
  delayStep: 0.028,
  duration: 4.0,
  sizeMin: 12,
  sizeMax: 22,
  colorOffset: 2,
  shapeOffset: 1,
});

const FALLING_LEFTOVERS = createRainField({
  count: 14,
  left: 420,
  right: 1500,
  top: 140,
  drop: 840,
  drift: 160,
  delayStart: 1.26,
  delayStep: 0.08,
  duration: 4.0,
  sizeMin: 10,
  sizeMax: 18,
  colorOffset: 1,
});

export function ConfettiMegaExplosion({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfme", "boom");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[5]} outer={CONFETTI_ACCENTS[2]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={520} r={320} opacity={0.9} />
      <ConfettiSparkle cx={960} cy={520} size={40} delay={0.12} duration={4.0} />

      <g style={{ transformOrigin: "960px 520px", animation: "wink-ring-expand 4s ease-out infinite", animationDelay: "0.14s" }}>
        <circle cx="960" cy="520" r="280" fill="none" stroke={CONFETTI_ACCENTS[6]} strokeWidth="4.5" opacity="0.86" />
      </g>

      {MASSIVE_BURST.map((piece, index) => (
        <AnimatedConfettiPiece key={`massive-${index}`} piece={piece} spinDuration={1.7} />
      ))}
      {INNER_BURST.map((piece, index) => (
        <AnimatedConfettiPiece key={`inner-${index}`} piece={piece} />
      ))}
      {FALLING_LEFTOVERS.map((piece, index) => (
        <AnimatedConfettiPiece key={`leftovers-${index}`} piece={piece} animation="wink-confetti-fall" easing="linear" spinDuration={1.8} />
      ))}
    </EffectSvg>
  );
}
