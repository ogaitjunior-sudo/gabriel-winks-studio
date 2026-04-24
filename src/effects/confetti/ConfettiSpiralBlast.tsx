import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  CONFETTI_SHAPES,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  confettiGlowId,
} from "./_confettiShared";

const SPIRAL_PIECES = Array.from({ length: 20 }, (_, index) => {
  const angle = -Math.PI * 0.9 + index * 0.52;
  const distance = 140 + index * 24;

  return {
    x: 960,
    y: 540,
    tx: Math.cos(angle) * distance * 1.9,
    ty: Math.sin(angle) * distance * 1.16,
    size: 12 + (index % 5) * 4,
    shape: CONFETTI_SHAPES[(index + 1) % CONFETTI_SHAPES.length],
    color: CONFETTI_ACCENTS[index % CONFETTI_ACCENTS.length],
    delay: 0.2 + index * 0.035,
    duration: 3.6,
    rotateStart: index * 12 - 18,
    rotateMid: 180 + index * 18,
    rotateEnd: 300 + index * 22,
  };
});

const CHARGE_POINTS = [
  { x: 870, y: 470, delay: 0.14 },
  { x: 930, y: 410, delay: 0.24 },
  { x: 1008, y: 408, delay: 0.34 },
  { x: 1078, y: 470, delay: 0.44 },
];

export function ConfettiSpiralBlast({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("csb", "spiral");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[4]} outer={CONFETTI_ACCENTS[2]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={540} r={220} opacity={0.76} delay="0.28s" />
      <ConfettiSparkle cx={960} cy={540} size={26} delay={0.36} duration={3.6} />

      {CHARGE_POINTS.map((point, index) => (
        <g
          key={index}
          style={{
            animation: "wink-fade-loop 3.6s ease-in-out infinite",
            animationDelay: `${point.delay}s`,
          }}
        >
          <circle cx={point.x} cy={point.y} r="6" fill={CONFETTI_ACCENTS[(index + 2) % CONFETTI_ACCENTS.length]} opacity="0.74" />
        </g>
      ))}

      {SPIRAL_PIECES.map((piece, index) => (
        <AnimatedConfettiPiece key={index} piece={piece} />
      ))}
    </EffectSvg>
  );
}
