import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createWaveField,
  confettiGlowId,
} from "./_confettiShared";

const PRIMARY_WAVE = createWaveField({
  count: 16,
  left: 360,
  right: 1260,
  centerY: 510,
  amplitude: 140,
  travelX: 310,
  delayStart: 0,
  delayStep: 0.08,
  duration: 3.4,
});

const SECONDARY_WAVE = createWaveField({
  count: 10,
  left: 420,
  right: 1240,
  centerY: 610,
  amplitude: 90,
  travelX: 260,
  delayStart: 0.18,
  delayStep: 0.09,
  duration: 3.4,
  sizeMin: 10,
  sizeMax: 18,
  colorOffset: 3,
  shapeOffset: 2,
});

export function ConfettiWaveSweep({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cws", "wave");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[2]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={1040} cy={540} r={320} opacity={0.52} />
      <ConfettiSparkle cx={700} cy={450} size={18} delay={0.34} duration={3.4} opacity={0.62} />
      <ConfettiSparkle cx={1020} cy={540} size={22} delay={0.92} duration={3.4} opacity={0.72} />
      <ConfettiSparkle cx={1320} cy={620} size={16} delay={1.38} duration={3.4} opacity={0.58} />

      {PRIMARY_WAVE.map((piece, index) => (
        <AnimatedConfettiPiece
          key={`primary-${index}`}
          piece={piece}
          animation="wink-confetti-wave"
          easing="ease-in-out"
          spinDuration={1.5}
        />
      ))}

      {SECONDARY_WAVE.map((piece, index) => (
        <AnimatedConfettiPiece
          key={`secondary-${index}`}
          piece={{ ...piece, opacity: 0.72 }}
          animation="wink-confetti-wave"
          easing="ease-in-out"
          spinDuration={1.7}
        />
      ))}
    </EffectSvg>
  );
}
