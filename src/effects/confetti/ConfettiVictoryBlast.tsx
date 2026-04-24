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

const CENTER = createRadialBurst({
  cx: 960,
  cy: 460,
  count: 18,
  radiusX: 560,
  radiusY: 340,
  delayStart: 0.12,
  delayStep: 0.024,
  duration: 4.0,
  sizeMin: 14,
  sizeMax: 28,
});

const SIDE_STREAMERS = [
  ...createFanLaunch({
    x: 320,
    y: 760,
    count: 8,
    angleStart: -42,
    angleEnd: 24,
    distance: 900,
    delayStart: 0.22,
    delayStep: 0.03,
    duration: 4.0,
    sizeMin: 18,
    sizeMax: 28,
    shapes: ["ribbon", "streamer", "ribbon", "diamond"] as const,
  }),
  ...createFanLaunch({
    x: 1600,
    y: 760,
    count: 8,
    angleStart: -202,
    angleEnd: -136,
    distance: 900,
    delayStart: 0.22,
    delayStep: 0.03,
    duration: 4.0,
    sizeMin: 18,
    sizeMax: 28,
    shapes: ["ribbon", "streamer", "ribbon", "circle"] as const,
    colorOffset: 2,
  }),
];

const RAIN = createRainField({
  count: 12,
  left: 420,
  right: 1500,
  top: 160,
  drop: 700,
  drift: 140,
  delayStart: 1.02,
  delayStep: 0.08,
  duration: 4.0,
  sizeMin: 10,
  sizeMax: 18,
});

export function ConfettiVictoryBlast({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfvb2", "victory");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[5]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={460} r={320} opacity={0.84} />
      <ConfettiSparkle cx={960} cy={460} size={34} delay={0.16} duration={4.0} />

      {CENTER.map((piece, index) => (
        <AnimatedConfettiPiece key={`center-${index}`} piece={piece} />
      ))}
      {SIDE_STREAMERS.map((piece, index) => (
        <AnimatedConfettiPiece key={`stream-${index}`} piece={piece} spinDuration={2} />
      ))}
      {RAIN.map((piece, index) => (
        <AnimatedConfettiPiece key={`rain-${index}`} piece={piece} animation="wink-confetti-fall" easing="linear" />
      ))}
    </EffectSvg>
  );
}
