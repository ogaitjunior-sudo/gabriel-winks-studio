import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createRadialBurst,
  createTunnelField,
  confettiGlowId,
} from "./_confettiShared";

const TUNNEL = createTunnelField({
  cx: 960,
  cy: 520,
  count: 26,
  spreadX: 900,
  spreadY: 520,
  exitRadiusX: 190,
  exitRadiusY: 130,
  delayStart: 0.08,
  delayStep: 0.024,
  duration: 3.8,
  sizeMin: 12,
  sizeMax: 22,
  shapes: ["streamer", "ribbon", "diamond", "rect", "circle"] as const,
});

const OUTWARD = createRadialBurst({
  cx: 960,
  cy: 520,
  count: 12,
  radiusX: 460,
  radiusY: 300,
  delayStart: 1.04,
  delayStep: 0.024,
  duration: 3.8,
  sizeMin: 12,
  sizeMax: 20,
  colorOffset: 2,
});

export function ConfettiCelebrationTunnel({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfct", "tunnel");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[2]} outer={CONFETTI_ACCENTS[4]} />
      </defs>

      <ellipse cx="960" cy="520" rx="520" ry="300" fill="none" stroke={CONFETTI_ACCENTS[2]} strokeWidth="3" opacity="0.2" />
      <ellipse cx="960" cy="520" rx="340" ry="195" fill="none" stroke={CONFETTI_ACCENTS[4]} strokeWidth="2" opacity="0.18" />
      <ellipse cx="960" cy="520" rx="180" ry="105" fill="none" stroke={CONFETTI_ACCENTS[6]} strokeWidth="2" opacity="0.2" />

      <ConfettiGlow glowId={glow} cx={960} cy={520} r={340} opacity={0.72} delay="0.84s" />
      <ConfettiSparkle cx={960} cy={520} size={32} delay={1.02} duration={3.8} />
      <ConfettiSparkle cx={650} cy={330} size={18} delay={0.52} duration={3.8} opacity={0.6} />
      <ConfettiSparkle cx={1270} cy={710} size={18} delay={0.66} duration={3.8} opacity={0.6} />

      {TUNNEL.map((piece, index) => (
        <AnimatedConfettiPiece key={`tunnel-${index}`} piece={piece} animation="wink-confetti-wave" easing="ease-in-out" spinDuration={1.7} />
      ))}
      {OUTWARD.map((piece, index) => (
        <AnimatedConfettiPiece key={`outward-${index}`} piece={piece} />
      ))}
    </EffectSvg>
  );
}
