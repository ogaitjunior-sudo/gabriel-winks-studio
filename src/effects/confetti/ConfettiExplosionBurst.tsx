import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createRadialBurst,
  confettiGlowId,
} from "./_confettiShared";

const PRIMARY_BURST = createRadialBurst({
  cx: 960,
  cy: 540,
  count: 18,
  radiusX: 560,
  radiusY: 360,
  delayStart: 0.08,
  delayStep: 0.04,
  duration: 3.2,
});

const SECONDARY_BURST = createRadialBurst({
  cx: 960,
  cy: 540,
  count: 10,
  radiusX: 320,
  radiusY: 220,
  angleOffset: Math.PI / 10,
  delayStart: 0.18,
  delayStep: 0.045,
  duration: 3.2,
  sizeMin: 12,
  sizeMax: 20,
  colorOffset: 2,
  shapeOffset: 1,
});

export function ConfettiExplosionBurst({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("ceb", "core");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={540} r={220} opacity={0.86} />

      <g
        style={{
          transformOrigin: "960px 540px",
          animation: "wink-ring-expand 3.2s ease-out infinite",
          animationDelay: "0.14s",
        }}
      >
        <circle cx="960" cy="540" r="210" fill="none" stroke={CONFETTI_ACCENTS[6]} strokeWidth="4" opacity="0.85" />
      </g>

      <ConfettiSparkle cx={960} cy={540} size={34} delay={0.14} duration={3.2} />
      <ConfettiSparkle cx={880} cy={492} size={16} delay={0.32} duration={3.2} opacity={0.72} />
      <ConfettiSparkle cx={1040} cy={492} size={16} delay={0.38} duration={3.2} opacity={0.72} />

      {PRIMARY_BURST.map((piece, index) => (
        <AnimatedConfettiPiece key={`primary-${index}`} piece={piece} />
      ))}

      {SECONDARY_BURST.map((piece, index) => (
        <AnimatedConfettiPiece key={`secondary-${index}`} piece={piece} />
      ))}
    </EffectSvg>
  );
}
