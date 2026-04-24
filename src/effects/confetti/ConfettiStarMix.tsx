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

const STAR_MIX_SHAPES = ["star", "rect", "circle", "streamer", "diamond"] as const;
const STAR_FOCUS_SHAPES = ["star", "diamond", "star", "circle"] as const;

const MIX_BURST = createRadialBurst({
  cx: 960,
  cy: 520,
  count: 22,
  radiusX: 520,
  radiusY: 340,
  delayStart: 0.1,
  delayStep: 0.03,
  duration: 3.2,
  sizeMin: 12,
  sizeMax: 28,
  shapes: STAR_MIX_SHAPES,
});

const STAR_FOCUS = createRadialBurst({
  cx: 960,
  cy: 520,
  count: 10,
  radiusX: 280,
  radiusY: 210,
  angleOffset: Math.PI / 12,
  delayStart: 0.24,
  delayStep: 0.035,
  duration: 3.2,
  sizeMin: 14,
  sizeMax: 22,
  shapes: STAR_FOCUS_SHAPES,
  colorOffset: 2,
});

export function ConfettiStarMix({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("csm", "mix");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[2]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={520} r={260} opacity={0.82} />
      <ConfettiSparkle cx={960} cy={520} size={28} delay={0.16} duration={3.2} />
      <ConfettiSparkle cx={850} cy={470} size={16} delay={0.32} duration={3.2} opacity={0.68} />
      <ConfettiSparkle cx={1080} cy={470} size={16} delay={0.4} duration={3.2} opacity={0.68} />

      {MIX_BURST.map((piece, index) => (
        <AnimatedConfettiPiece key={`mix-${index}`} piece={piece} />
      ))}

      {STAR_FOCUS.map((piece, index) => (
        <AnimatedConfettiPiece key={`focus-${index}`} piece={piece} />
      ))}
    </EffectSvg>
  );
}
