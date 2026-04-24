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

const CHAIN = [
  ...createRadialBurst({ cx: 480, cy: 620, count: 6, radiusX: 140, radiusY: 100, delayStart: 0.08, delayStep: 0.018, duration: 4.0, sizeMin: 10, sizeMax: 18 }),
  ...createRadialBurst({ cx: 700, cy: 440, count: 6, radiusX: 140, radiusY: 100, delayStart: 0.42, delayStep: 0.018, duration: 4.0, sizeMin: 10, sizeMax: 18, colorOffset: 2 }),
  ...createRadialBurst({ cx: 930, cy: 590, count: 6, radiusX: 140, radiusY: 100, delayStart: 0.76, delayStep: 0.018, duration: 4.0, sizeMin: 10, sizeMax: 18, colorOffset: 4 }),
  ...createRadialBurst({ cx: 1180, cy: 400, count: 6, radiusX: 140, radiusY: 100, delayStart: 1.1, delayStep: 0.018, duration: 4.0, sizeMin: 10, sizeMax: 18, colorOffset: 1 }),
  ...createRadialBurst({ cx: 1410, cy: 560, count: 6, radiusX: 140, radiusY: 100, delayStart: 1.44, delayStep: 0.018, duration: 4.0, sizeMin: 10, sizeMax: 18, colorOffset: 3 }),
];

const FINAL = createRadialBurst({
  cx: 960,
  cy: 500,
  count: 14,
  radiusX: 420,
  radiusY: 280,
  delayStart: 1.82,
  delayStep: 0.022,
  duration: 4.0,
  sizeMin: 12,
  sizeMax: 24,
});

export function ConfettiFirecrackerChain({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cffc", "chain");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[5]} outer={CONFETTI_ACCENTS[1]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={500} r={280} opacity={0.6} delay="1.72s" />
      <ConfettiSparkle cx={480} cy={620} size={14} delay={0.12} duration={4.0} />
      <ConfettiSparkle cx={700} cy={440} size={14} delay={0.46} duration={4.0} />
      <ConfettiSparkle cx={930} cy={590} size={14} delay={0.8} duration={4.0} />
      <ConfettiSparkle cx={1180} cy={400} size={14} delay={1.14} duration={4.0} />
      <ConfettiSparkle cx={1410} cy={560} size={14} delay={1.48} duration={4.0} />
      <ConfettiSparkle cx={960} cy={500} size={28} delay={1.86} duration={4.0} />

      {[...CHAIN, ...FINAL].map((piece, index) => (
        <AnimatedConfettiPiece key={index} piece={piece} />
      ))}
    </EffectSvg>
  );
}
