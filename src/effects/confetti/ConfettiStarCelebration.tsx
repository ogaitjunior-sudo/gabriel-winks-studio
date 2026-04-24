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

const STAR_BURST = createRadialBurst({
  cx: 960,
  cy: 500,
  count: 18,
  radiusX: 500,
  radiusY: 320,
  delayStart: 0.12,
  delayStep: 0.026,
  duration: 3.4,
  sizeMin: 14,
  sizeMax: 26,
  shapes: ["star", "star", "diamond", "circle"] as const,
});

const BACK_FILL = createRainField({
  count: 12,
  left: 420,
  right: 1500,
  top: 160,
  drop: 640,
  drift: 100,
  delayStart: 0.58,
  delayStep: 0.08,
  duration: 3.4,
  sizeMin: 10,
  sizeMax: 16,
  shapes: ["rect", "circle", "diamond"] as const,
  colorOffset: 2,
});

export function ConfettiStarCelebration({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfsc", "stars");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[2]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={500} r={250} opacity={0.8} />
      <ConfettiSparkle cx={960} cy={500} size={30} delay={0.16} duration={3.4} />

      {STAR_BURST.map((piece, index) => (
        <AnimatedConfettiPiece key={`star-${index}`} piece={piece} />
      ))}
      {BACK_FILL.map((piece, index) => (
        <AnimatedConfettiPiece key={`fill-${index}`} piece={piece} animation="wink-confetti-fall" easing="linear" />
      ))}
    </EffectSvg>
  );
}
