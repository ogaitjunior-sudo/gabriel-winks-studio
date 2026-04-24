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

const LAYER_ONE = createRadialBurst({
  cx: 960,
  cy: 520,
  count: 10,
  radiusX: 220,
  radiusY: 160,
  delayStart: 0.08,
  delayStep: 0.024,
  duration: 3.6,
  sizeMin: 12,
  sizeMax: 18,
});

const LAYER_TWO = createRadialBurst({
  cx: 960,
  cy: 520,
  count: 14,
  radiusX: 360,
  radiusY: 250,
  angleOffset: Math.PI / 10,
  delayStart: 0.28,
  delayStep: 0.022,
  duration: 3.6,
  sizeMin: 12,
  sizeMax: 22,
  colorOffset: 2,
});

const LAYER_THREE = createRadialBurst({
  cx: 960,
  cy: 520,
  count: 16,
  radiusX: 520,
  radiusY: 340,
  angleOffset: Math.PI / 18,
  delayStart: 0.56,
  delayStep: 0.02,
  duration: 3.6,
  sizeMin: 14,
  sizeMax: 26,
  colorOffset: 4,
  shapeOffset: 2,
});

export function ConfettiColorBloom({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfcb", "bloom");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={520} r={300} opacity={0.82} />
      <ConfettiSparkle cx={960} cy={520} size={30} delay={0.2} duration={3.6} />

      {[...LAYER_ONE, ...LAYER_TWO, ...LAYER_THREE].map((piece, index) => (
        <AnimatedConfettiPiece key={index} piece={piece} />
      ))}
    </EffectSvg>
  );
}
