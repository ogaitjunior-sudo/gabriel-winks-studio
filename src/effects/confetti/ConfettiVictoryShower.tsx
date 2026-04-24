import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  CONFETTI_SHAPES,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createRainField,
  confettiGlowId,
} from "./_confettiShared";

const TOP_RAIN = createRainField({
  count: 20,
  left: 340,
  right: 1580,
  top: 110,
  drop: 900,
  drift: 170,
  delayStart: 0.12,
  delayStep: 0.1,
  duration: 4.0,
  sizeMin: 12,
  sizeMax: 24,
});

const BACK_RAIN = createRainField({
  count: 12,
  left: 420,
  right: 1500,
  top: 80,
  drop: 820,
  drift: 110,
  delayStart: 0.2,
  delayStep: 0.09,
  duration: 4.0,
  sizeMin: 10,
  sizeMax: 18,
  colorOffset: 2,
  shapeOffset: 2,
});

const UPSWING = Array.from({ length: 10 }, (_, index) => ({
  x: 510 + index * 102,
  y: 900,
  tx: -120 + (index % 5) * 58,
  ty: -320 - (index % 3) * 70,
  size: 14 + (index % 4) * 3,
  shape: CONFETTI_SHAPES[(index + 2) % CONFETTI_SHAPES.length],
  color: CONFETTI_ACCENTS[index % CONFETTI_ACCENTS.length],
  delay: 0.56 + index * 0.04,
  duration: 4.0,
  rotateStart: index * 10,
  rotateMid: 170 + index * 16,
  rotateEnd: 300 + index * 22,
}));

export function ConfettiVictoryShower({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cvs", "victory");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[5]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={320} r={320} opacity={0.54} delay="0.48s" />
      <ConfettiSparkle cx={960} cy={280} size={24} delay={0.56} duration={4.0} />
      <ConfettiSparkle cx={760} cy={340} size={16} delay={0.7} duration={4.0} opacity={0.6} />
      <ConfettiSparkle cx={1160} cy={340} size={16} delay={0.76} duration={4.0} opacity={0.6} />

      {BACK_RAIN.map((piece, index) => (
        <AnimatedConfettiPiece
          key={`back-${index}`}
          piece={{ ...piece, opacity: 0.56 }}
          animation="wink-confetti-fall"
          easing="linear"
          spinDuration={1.8}
        />
      ))}

      {TOP_RAIN.map((piece, index) => (
        <AnimatedConfettiPiece
          key={`rain-${index}`}
          piece={piece}
          animation="wink-confetti-fall"
          easing="linear"
          spinDuration={1.6}
        />
      ))}

      {UPSWING.map((piece, index) => (
        <AnimatedConfettiPiece key={`upswing-${index}`} piece={piece} />
      ))}
    </EffectSvg>
  );
}
