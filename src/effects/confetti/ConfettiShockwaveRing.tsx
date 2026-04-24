import { EffectSvg } from "../_shared";
import {
  AnimatedConfettiPiece,
  CONFETTI_ACCENTS,
  ConfettiGlow,
  ConfettiGlowGradient,
  ConfettiSparkle,
  createRingField,
  confettiGlowId,
} from "./_confettiShared";

const RING = createRingField({
  cx: 960,
  cy: 520,
  count: 28,
  ringRadiusX: 230,
  ringRadiusY: 165,
  expandX: 310,
  expandY: 230,
  delayStart: 0.12,
  delayStep: 0.022,
  duration: 3.4,
  sizeMin: 12,
  sizeMax: 22,
  shapes: ["diamond", "circle", "rect", "star", "streamer"] as const,
});

export function ConfettiShockwaveRing({ playing }: { playing: boolean }) {
  const glow = confettiGlowId("cfsr", "ring");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <ConfettiGlowGradient id={glow} inner={CONFETTI_ACCENTS[1]} outer={CONFETTI_ACCENTS[2]} />
      </defs>

      <ConfettiGlow glowId={glow} cx={960} cy={520} r={280} opacity={0.78} />
      <ConfettiSparkle cx={960} cy={520} size={34} delay={0.18} duration={3.4} />

      {[220, 340, 460].map((radius, i) => (
        <g key={radius} style={{ transformOrigin: "960px 520px", animation: "wink-ring-expand 3.4s ease-out infinite", animationDelay: `${0.12 + i * 0.18}s` }}>
          <ellipse cx="960" cy="520" rx={radius} ry={radius * 0.68} fill="none" stroke={CONFETTI_ACCENTS[(i + 1) % CONFETTI_ACCENTS.length]} strokeWidth={4 - i * 0.7} opacity={0.72 - i * 0.12} />
        </g>
      ))}

      {RING.map((piece, index) => (
        <AnimatedConfettiPiece key={index} piece={piece} spinDuration={1.55} />
      ))}
    </EffectSvg>
  );
}
