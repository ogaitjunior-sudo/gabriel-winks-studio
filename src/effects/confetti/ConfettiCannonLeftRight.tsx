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

const LEFT_CANNON = createFanLaunch({
  x: 260,
  y: 900,
  count: 14,
  angleStart: -82,
  angleEnd: -26,
  distance: 860,
  delayStart: 0.08,
  delayStep: 0.03,
  duration: 3.6,
});

const RIGHT_CANNON = createFanLaunch({
  x: 1660,
  y: 900,
  count: 14,
  angleStart: -154,
  angleEnd: -98,
  distance: 860,
  delayStart: 0.08,
  delayStep: 0.03,
  duration: 3.6,
  colorOffset: 3,
  shapeOffset: 2,
});

const CENTER_SPLASH = createRadialBurst({
  cx: 960,
  cy: 360,
  count: 8,
  radiusX: 180,
  radiusY: 120,
  delayStart: 1.02,
  delayStep: 0.025,
  duration: 3.6,
  sizeMin: 12,
  sizeMax: 20,
  angleOffset: Math.PI / 8,
});

export function ConfettiCannonLeftRight({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cclr", "meet");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[0]} outer={CONFETTI_ACCENTS[2]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={360} r={240} opacity={0.74} delay="0.86s" />
      <ConfettiSparkle cx={960} cy={360} size={28} delay={0.92} duration={3.6} />
      <ConfettiSparkle cx={890} cy={410} size={16} delay={1.02} duration={3.6} opacity={0.68} />
      <ConfettiSparkle cx={1030} cy={410} size={16} delay={1.08} duration={3.6} opacity={0.68} />

      {LEFT_CANNON.map((piece, index) => (
        <AnimatedConfettiPiece key={`left-${index}`} piece={piece} />
      ))}

      {RIGHT_CANNON.map((piece, index) => (
        <AnimatedConfettiPiece key={`right-${index}`} piece={piece} />
      ))}

      {CENTER_SPLASH.map((piece, index) => (
        <AnimatedConfettiPiece key={`center-${index}`} piece={piece} />
      ))}
    </EffectSvg>
  );
}
