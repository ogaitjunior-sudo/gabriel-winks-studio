import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createHeartBurst,
  createRadialBurst,
  confettiGlowId,
} from "./_confettiShared";

const HEART_PALETTE = [
  CONFETTI_ACCENTS[0],
  CONFETTI_ACCENTS[1],
  CONFETTI_ACCENTS[4],
  CONFETTI_ACCENTS[6],
] as const;

const HEART_FORM = createHeartBurst({
  cx: 960,
  cy: 520,
  count: 18,
  scale: 18,
  delayStart: 0.18,
  delayStep: 0.04,
  duration: 3.6,
  palette: HEART_PALETTE,
});

const HEART_SCATTER = createRadialBurst({
  cx: 960,
  cy: 520,
  count: 12,
  radiusX: 420,
  radiusY: 300,
  delayStart: 1.3,
  delayStep: 0.03,
  duration: 3.6,
  sizeMin: 12,
  sizeMax: 20,
  colorOffset: 1,
  shapeOffset: 1,
});

export function ConfettiHeartBurst({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("chb", "heart");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[0]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={520} r={260} opacity={0.78} delay="0.34s" />
      <ConfettiSparkle cx={860} cy={420} size={18} delay={0.64} duration={3.6} />
      <ConfettiSparkle cx={1060} cy={420} size={18} delay={0.7} duration={3.6} />
      <ConfettiSparkle cx={960} cy={650} size={16} delay={0.82} duration={3.6} opacity={0.72} />

      {HEART_FORM.map((piece, index) => (
        <AnimatedConfettiPiece key={`heart-${index}`} piece={piece} />
      ))}

      {HEART_SCATTER.map((piece, index) => (
        <AnimatedConfettiPiece key={`scatter-${index}`} piece={piece} />
      ))}
    </EffectSvg>
  );
}
