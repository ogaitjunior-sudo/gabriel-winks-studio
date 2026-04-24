import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createFanLaunch,
  createRadialBurst,
  createRainField,
  confettiGlowId,
} from "./_confettiShared";

const SIDE_LEFT = createFanLaunch({
  x: 280,
  y: 900,
  count: 10,
  angleStart: -80,
  angleEnd: -30,
  distance: 780,
  delayStart: 0.56,
  delayStep: 0.03,
  duration: 4.4,
});

const SIDE_RIGHT = createFanLaunch({
  x: 1640,
  y: 900,
  count: 10,
  angleStart: -150,
  angleEnd: -100,
  distance: 780,
  delayStart: 0.56,
  delayStep: 0.03,
  duration: 4.4,
  colorOffset: 2,
  shapeOffset: 2,
});

const CENTER_BURST = createRadialBurst({
  cx: 960,
  cy: 430,
  count: 14,
  radiusX: 520,
  radiusY: 340,
  delayStart: 1.46,
  delayStep: 0.03,
  duration: 4.4,
  sizeMin: 14,
  sizeMax: 28,
});

const FALLING_RAIN = createRainField({
  count: 18,
  left: 380,
  right: 1540,
  top: 140,
  drop: 840,
  drift: 180,
  delayStart: 1.92,
  delayStep: 0.1,
  duration: 4.4,
  sizeMin: 12,
  sizeMax: 22,
  colorOffset: 1,
  shapeOffset: 1,
});

const EARLY_SPARKLES = [
  { x: 820, y: 320, size: 14, delay: 0.04 },
  { x: 960, y: 270, size: 22, delay: 0.16 },
  { x: 1100, y: 320, size: 14, delay: 0.28 },
];

export function ConfettiGrandFinale({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cgf", "grand");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      {EARLY_SPARKLES.map((sparkle, index) => (
        <ConfettiSparkle
          key={index}
          cx={sparkle.x}
          cy={sparkle.y}
          size={sparkle.size}
          delay={sparkle.delay}
          duration={4.4}
          opacity={0.72}
        />
      ))}

      <ConfettiGlow glowId={glow} cx={960} cy={430} r={320} opacity={0.86} delay="1.38s" />

      <g
        style={{
          transformOrigin: "960px 430px",
          animation: "wink-ring-expand 4.4s ease-out infinite",
          animationDelay: "1.54s",
        }}
      >
        <circle cx="960" cy="430" r="240" fill="none" stroke={CONFETTI_ACCENTS[6]} strokeWidth="4" opacity="0.88" />
      </g>

      {SIDE_LEFT.map((piece, index) => (
        <AnimatedConfettiPiece key={`left-${index}`} piece={piece} />
      ))}

      {SIDE_RIGHT.map((piece, index) => (
        <AnimatedConfettiPiece key={`right-${index}`} piece={piece} />
      ))}

      {CENTER_BURST.map((piece, index) => (
        <AnimatedConfettiPiece key={`center-${index}`} piece={piece} />
      ))}

      {FALLING_RAIN.map((piece, index) => (
        <AnimatedConfettiPiece
          key={`rain-${index}`}
          piece={piece}
          animation="wink-confetti-fall"
          easing="linear"
          spinDuration={1.7}
        />
      ))}
    </EffectSvg>
  );
}
