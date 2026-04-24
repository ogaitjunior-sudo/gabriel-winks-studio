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

const LEFT_POP = createRadialBurst({
  cx: 560,
  cy: 590,
  count: 10,
  radiusX: 230,
  radiusY: 170,
  delayStart: 0.1,
  delayStep: 0.02,
  duration: 3.6,
  sizeMin: 12,
  sizeMax: 20,
  shapes: ["circle", "diamond", "rect", "star"] as const,
});

const RIGHT_POP = createRadialBurst({
  cx: 1360,
  cy: 590,
  count: 10,
  radiusX: 230,
  radiusY: 170,
  delayStart: 0.56,
  delayStep: 0.02,
  duration: 3.6,
  sizeMin: 12,
  sizeMax: 20,
  colorOffset: 3,
  shapeOffset: 2,
  shapes: ["star", "streamer", "diamond", "circle"] as const,
});

const CENTER_POP = createRadialBurst({
  cx: 960,
  cy: 390,
  count: 18,
  radiusX: 450,
  radiusY: 300,
  delayStart: 1.08,
  delayStep: 0.024,
  duration: 3.6,
  sizeMin: 14,
  sizeMax: 26,
  angleOffset: Math.PI / 12,
  shapes: ["ribbon", "star", "streamer", "rect", "diamond"] as const,
});

export function ConfettiTriplePopCelebration({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cftpc", "triple");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      <path d="M 420 700 C 610 470, 780 700, 960 390 C 1140 700, 1310 470, 1500 700" fill="none" stroke={CONFETTI_ACCENTS[6]} strokeWidth="4" strokeLinecap="round" opacity="0.18" />
      <ConfettiGlow glowId={glow} cx={960} cy={390} r={300} opacity={0.54} delay="1s" />
      <ConfettiSparkle cx={560} cy={590} size={20} delay={0.18} duration={3.6} />
      <ConfettiSparkle cx={1360} cy={590} size={20} delay={0.64} duration={3.6} />
      <ConfettiSparkle cx={960} cy={390} size={32} delay={1.14} duration={3.6} />

      {[...LEFT_POP, ...RIGHT_POP, ...CENTER_POP].map((piece, index) => (
        <AnimatedConfettiPiece key={index} piece={piece} />
      ))}
    </EffectSvg>
  );
}
