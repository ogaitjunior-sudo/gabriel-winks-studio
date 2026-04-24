import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createRadialBurst,
  createRingField,
  createSpiralField,
  confettiGlowId,
} from "./_confettiShared";

const ORBIT = createRingField({
  cx: 960,
  cy: 520,
  count: 14,
  ringRadiusX: 220,
  ringRadiusY: 160,
  expandX: 120,
  expandY: 90,
  delayStart: 0.08,
  delayStep: 0.025,
  duration: 4.0,
  sizeMin: 12,
  sizeMax: 20,
  shapes: ["circle", "diamond", "star", "streamer"] as const,
});

const SWIRL = createSpiralField({
  cx: 960,
  cy: 520,
  count: 16,
  turns: 1.8,
  startRadius: 80,
  endRadius: 320,
  radiusScaleY: 0.64,
  delayStart: 0.18,
  delayStep: 0.03,
  duration: 4.0,
  sizeMin: 10,
  sizeMax: 18,
  colorOffset: 2,
});

const FINAL_BLAST = createRadialBurst({
  cx: 960,
  cy: 520,
  count: 12,
  radiusX: 460,
  radiusY: 320,
  delayStart: 1.18,
  delayStep: 0.024,
  duration: 4.0,
  sizeMin: 12,
  sizeMax: 22,
});

export function ConfettiGalaxySwirl({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfgs", "galaxy");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[2]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={520} r={280} opacity={0.72} />
      <ConfettiSparkle cx={960} cy={520} size={28} delay={1.18} duration={4.0} />

      {ORBIT.map((piece, index) => (
        <AnimatedConfettiPiece key={`orbit-${index}`} piece={piece} />
      ))}
      {SWIRL.map((piece, index) => (
        <AnimatedConfettiPiece key={`swirl-${index}`} piece={piece} spinDuration={1.55} />
      ))}
      {FINAL_BLAST.map((piece, index) => (
        <AnimatedConfettiPiece key={`blast-${index}`} piece={piece} />
      ))}
    </EffectSvg>
  );
}
