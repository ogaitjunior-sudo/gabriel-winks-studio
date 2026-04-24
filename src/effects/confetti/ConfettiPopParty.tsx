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

const POPS = [
  { x: 620, y: 420, delay: 0.12, colorOffset: 0 },
  { x: 960, y: 320, delay: 0.46, colorOffset: 2 },
  { x: 1280, y: 430, delay: 0.8, colorOffset: 4 },
  { x: 780, y: 650, delay: 1.14, colorOffset: 1 },
  { x: 1140, y: 620, delay: 1.48, colorOffset: 3 },
].flatMap((pop, index) =>
  createRadialBurst({
    cx: pop.x,
    cy: pop.y,
    count: 7,
    radiusX: 210,
    radiusY: 150,
    angleOffset: index * 0.34,
    delayStart: pop.delay,
    delayStep: 0.024,
    duration: 3.8,
    sizeMin: 12,
    sizeMax: 20,
    colorOffset: pop.colorOffset,
    shapeOffset: index,
  })
);

const POP_SPARKLES = [
  { x: 620, y: 420, delay: 0.16 },
  { x: 960, y: 320, delay: 0.5 },
  { x: 1280, y: 430, delay: 0.84 },
  { x: 780, y: 650, delay: 1.18 },
  { x: 1140, y: 620, delay: 1.52 },
];

export function ConfettiPopParty({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cpp", "party");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[5]} outer={CONFETTI_ACCENTS[0]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={520} r={320} opacity={0.4} />

      {POP_SPARKLES.map((sparkle, index) => (
        <ConfettiSparkle
          key={index}
          cx={sparkle.x}
          cy={sparkle.y}
          size={22}
          delay={sparkle.delay}
          duration={3.8}
        />
      ))}

      {POPS.map((piece, index) => (
        <AnimatedConfettiPiece key={index} piece={piece} />
      ))}
    </EffectSvg>
  );
}
