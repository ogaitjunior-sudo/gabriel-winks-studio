import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createSpiralField,
  confettiGlowId,
} from "./_confettiShared";

const SPIRAL = createSpiralField({
  cx: 960,
  cy: 500,
  count: 24,
  turns: 2.8,
  startRadius: 50,
  endRadius: 540,
  radiusScaleY: 0.8,
  delayStart: 0.1,
  delayStep: 0.03,
  duration: 3.8,
  sizeMin: 12,
  sizeMax: 24,
});

export function ConfettiSpiralFirework({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfsf", "spiral");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[4]} outer={CONFETTI_ACCENTS[2]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={500} r={250} opacity={0.76} delay="0.24s" />
      <ConfettiSparkle cx={960} cy={500} size={28} delay={0.22} duration={3.8} />

      {SPIRAL.map((piece, index) => (
        <AnimatedConfettiPiece key={index} piece={piece} spinDuration={1.5} />
      ))}
    </EffectSvg>
  );
}
