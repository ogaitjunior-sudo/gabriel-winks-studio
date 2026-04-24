import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createFanLaunch,
  createRainField,
  confettiGlowId,
} from "./_confettiShared";

const ERUPTION = createFanLaunch({
  x: 960,
  y: 910,
  count: 22,
  angleStart: -122,
  angleEnd: -58,
  distance: 760,
  delayStart: 0.08,
  delayStep: 0.024,
  duration: 3.8,
  sizeMin: 12,
  sizeMax: 24,
});

const FALLBACK = createRainField({
  count: 10,
  left: 620,
  right: 1300,
  top: 180,
  drop: 620,
  drift: 120,
  delayStart: 1.06,
  delayStep: 0.08,
  duration: 3.8,
  sizeMin: 10,
  sizeMax: 18,
  colorOffset: 1,
});

export function ConfettiVolcanoBurst({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfvb", "volcano");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[5]} outer={CONFETTI_ACCENTS[1]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={860} r={220} opacity={0.74} />
      <ConfettiSparkle cx={960} cy={820} size={20} delay={0.18} duration={3.8} />

      {ERUPTION.map((piece, index) => (
        <AnimatedConfettiPiece key={`eruption-${index}`} piece={piece} spinDuration={1.7} />
      ))}
      {FALLBACK.map((piece, index) => (
        <AnimatedConfettiPiece key={`fallback-${index}`} piece={piece} animation="wink-confetti-fall" easing="linear" />
      ))}
    </EffectSvg>
  );
}
