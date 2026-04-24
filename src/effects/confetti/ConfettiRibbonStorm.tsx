import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createFanLaunch,
  createRadialBurst,
  confettiGlowId,
} from "./_confettiShared";

const LEFT_RIBBONS = createFanLaunch({
  x: 300,
  y: 300,
  count: 10,
  angleStart: -10,
  angleEnd: 50,
  distance: 1080,
  delayStart: 0.06,
  delayStep: 0.03,
  duration: 3.8,
  sizeMin: 18,
  sizeMax: 30,
  shapes: ["ribbon", "streamer", "ribbon", "diamond"] as const,
});

const RIGHT_RIBBONS = createFanLaunch({
  x: 1620,
  y: 760,
  count: 10,
  angleStart: -190,
  angleEnd: -128,
  distance: 1080,
  delayStart: 0.06,
  delayStep: 0.03,
  duration: 3.8,
  sizeMin: 18,
  sizeMax: 30,
  shapes: ["ribbon", "streamer", "ribbon", "circle"] as const,
  colorOffset: 2,
});

const FILL = createRadialBurst({
  cx: 960,
  cy: 520,
  count: 12,
  radiusX: 420,
  radiusY: 260,
  delayStart: 0.7,
  delayStep: 0.022,
  duration: 3.8,
  sizeMin: 10,
  sizeMax: 18,
  colorOffset: 1,
});

export function ConfettiRibbonStorm({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfrs", "storm");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[4]} outer={CONFETTI_ACCENTS[2]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={520} r={300} opacity={0.58} />
      <ConfettiSparkle cx={960} cy={520} size={24} delay={0.82} duration={3.8} />

      {LEFT_RIBBONS.map((piece, index) => (
        <AnimatedConfettiPiece key={`left-${index}`} piece={piece} spinDuration={2.1} />
      ))}
      {RIGHT_RIBBONS.map((piece, index) => (
        <AnimatedConfettiPiece key={`right-${index}`} piece={piece} spinDuration={2.1} />
      ))}
      {FILL.map((piece, index) => (
        <AnimatedConfettiPiece key={`fill-${index}`} piece={piece} />
      ))}
    </EffectSvg>
  );
}
