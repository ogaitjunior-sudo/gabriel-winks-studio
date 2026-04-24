import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createRadialBurst,
  createWaveField,
  confettiGlowId,
} from "./_confettiShared";

const WAVE = createWaveField({
  count: 24,
  left: 250,
  right: 1380,
  centerY: 560,
  amplitude: 185,
  travelX: 360,
  delayStart: 0,
  delayStep: 0.055,
  duration: 3.8,
  shapes: ["ribbon", "streamer", "rect", "circle", "diamond"] as const,
});

const BLAST = createRadialBurst({
  cx: 1240,
  cy: 470,
  count: 14,
  radiusX: 360,
  radiusY: 240,
  delayStart: 1.04,
  delayStep: 0.022,
  duration: 3.8,
  sizeMin: 12,
  sizeMax: 22,
  angleOffset: Math.PI / 10,
});

export function ConfettiWaveBlast({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfwb", "wave");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[2]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      <path d="M 250 610 C 520 250, 790 830, 1050 520 S 1460 360, 1640 580" fill="none" stroke={CONFETTI_ACCENTS[2]} strokeWidth="5" strokeLinecap="round" opacity="0.22" />
      <path d="M 310 700 C 580 390, 760 730, 1010 610 S 1380 500, 1580 690" fill="none" stroke={CONFETTI_ACCENTS[4]} strokeWidth="3" strokeLinecap="round" opacity="0.16" />

      <ConfettiGlow glowId={glow} cx={1240} cy={470} r={280} opacity={0.64} delay="0.94s" />
      <ConfettiSparkle cx={1240} cy={470} size={28} delay={1.02} duration={3.8} />

      {WAVE.map((piece, index) => (
        <AnimatedConfettiPiece key={`wave-${index}`} piece={piece} animation="wink-confetti-wave" easing="ease-in-out" />
      ))}
      {BLAST.map((piece, index) => (
        <AnimatedConfettiPiece key={`blast-${index}`} piece={piece} />
      ))}
    </EffectSvg>
  );
}
