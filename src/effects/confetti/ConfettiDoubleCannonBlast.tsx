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

const LEFT = createFanLaunch({
  x: 250,
  y: 920,
  count: 16,
  angleStart: -82,
  angleEnd: -26,
  distance: 900,
  delayStart: 0.06,
  delayStep: 0.028,
  duration: 3.8,
});

const RIGHT = createFanLaunch({
  x: 1670,
  y: 920,
  count: 16,
  angleStart: -154,
  angleEnd: -98,
  distance: 900,
  delayStart: 0.06,
  delayStep: 0.028,
  duration: 3.8,
  colorOffset: 2,
  shapeOffset: 2,
});

const IMPACT = createRadialBurst({
  cx: 960,
  cy: 360,
  count: 10,
  radiusX: 240,
  radiusY: 160,
  delayStart: 0.96,
  delayStep: 0.022,
  duration: 3.8,
  sizeMin: 12,
  sizeMax: 20,
  angleOffset: Math.PI / 10,
});

const FALL = createRainField({
  count: 10,
  left: 600,
  right: 1320,
  top: 160,
  drop: 660,
  drift: 110,
  delayStart: 1.18,
  delayStep: 0.07,
  duration: 3.8,
  sizeMin: 10,
  sizeMax: 18,
});

export function ConfettiDoubleCannonBlast({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfdc", "cross");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[0]} outer={CONFETTI_ACCENTS[2]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={360} r={240} opacity={0.78} delay="0.88s" />
      <ConfettiSparkle cx={960} cy={360} size={26} delay={0.92} duration={3.8} />

      {LEFT.map((piece, index) => (
        <AnimatedConfettiPiece key={`left-${index}`} piece={piece} />
      ))}
      {RIGHT.map((piece, index) => (
        <AnimatedConfettiPiece key={`right-${index}`} piece={piece} />
      ))}
      {IMPACT.map((piece, index) => (
        <AnimatedConfettiPiece key={`impact-${index}`} piece={piece} />
      ))}
      {FALL.map((piece, index) => (
        <AnimatedConfettiPiece key={`fall-${index}`} piece={piece} animation="wink-confetti-fall" easing="linear" />
      ))}
    </EffectSvg>
  );
}
