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

const PRE_SPARKLES = [
  { x: 820, y: 290, size: 14, delay: 0.04 },
  { x: 960, y: 250, size: 20, delay: 0.14 },
  { x: 1100, y: 300, size: 14, delay: 0.24 },
];

const LEFT_CANNON = createFanLaunch({
  x: 260,
  y: 910,
  count: 12,
  angleStart: -82,
  angleEnd: -30,
  distance: 820,
  delayStart: 0.5,
  delayStep: 0.025,
  duration: 4.6,
});

const RIGHT_CANNON = createFanLaunch({
  x: 1660,
  y: 910,
  count: 12,
  angleStart: -150,
  angleEnd: -98,
  distance: 820,
  delayStart: 0.5,
  delayStep: 0.025,
  duration: 4.6,
  colorOffset: 2,
  shapeOffset: 2,
});

const CENTER_BLAST = createRadialBurst({
  cx: 960,
  cy: 410,
  count: 18,
  radiusX: 560,
  radiusY: 360,
  delayStart: 1.28,
  delayStep: 0.022,
  duration: 4.6,
  sizeMin: 14,
  sizeMax: 28,
});

const STORM_RAIN = createRainField({
  count: 22,
  left: 360,
  right: 1560,
  top: 120,
  drop: 860,
  drift: 200,
  delayStart: 1.84,
  delayStep: 0.08,
  duration: 4.6,
  sizeMin: 12,
  sizeMax: 22,
  colorOffset: 1,
});

export function ConfettiGrandFinaleStorm({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfgfs", "storm");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[5]} />
      </defs>

      {PRE_SPARKLES.map((sparkle, index) => (
        <ConfettiSparkle key={index} cx={sparkle.x} cy={sparkle.y} size={sparkle.size} delay={sparkle.delay} duration={4.6} opacity={0.68} />
      ))}
      <ConfettiGlow glowId={glow} cx={960} cy={410} r={340} opacity={0.88} delay="1.2s" />
      <ConfettiSparkle cx={960} cy={410} size={34} delay={1.32} duration={4.6} />

      {LEFT_CANNON.map((piece, index) => (
        <AnimatedConfettiPiece key={`left-${index}`} piece={piece} />
      ))}
      {RIGHT_CANNON.map((piece, index) => (
        <AnimatedConfettiPiece key={`right-${index}`} piece={piece} />
      ))}
      {CENTER_BLAST.map((piece, index) => (
        <AnimatedConfettiPiece key={`center-${index}`} piece={piece} spinDuration={1.6} />
      ))}
      {STORM_RAIN.map((piece, index) => (
        <AnimatedConfettiPiece key={`rain-${index}`} piece={piece} animation="wink-confetti-fall" easing="linear" spinDuration={1.8} />
      ))}
    </EffectSvg>
  );
}
