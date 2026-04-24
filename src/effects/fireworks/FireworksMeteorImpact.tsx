import { EffectSvg } from "../_shared";
import {
  FIREWORK_ACCENTS,
  ExplosionRing,
  FireworkBurst,
  FireworkGlowGradient,
  FireworkStars,
  GlowFlash,
  RocketTrail,
  fireworkGlowId,
} from "./_fireworksShared";

const METEORS = [
  { x: 420, y: 110, tx: 540, ty: 430, delay: 0.06, color: FIREWORK_ACCENTS[1] },
  { x: 760, y: 70, tx: 200, ty: 470, delay: 0.2, color: FIREWORK_ACCENTS[5] },
  { x: 1160, y: 70, tx: -200, ty: 470, delay: 0.34, color: FIREWORK_ACCENTS[2] },
  { x: 1500, y: 110, tx: -540, ty: 430, delay: 0.48, color: FIREWORK_ACCENTS[3] },
];

const CLOUD = [
  { x: 820, y: 610, delay: 1.52 },
  { x: 900, y: 640, delay: 1.6 },
  { x: 980, y: 650, delay: 1.68 },
  { x: 1060, y: 620, delay: 1.76 },
  { x: 1140, y: 590, delay: 1.84 },
];

export function FireworksMeteorImpact({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwmi", "impact");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[5]} outer={FIREWORK_ACCENTS[1]} />
      </defs>

      {METEORS.map((meteor, i) => (
        <RocketTrail
          key={i}
          x={meteor.x}
          y={meteor.y}
          tx={meteor.tx}
          ty={meteor.ty}
          color={meteor.color}
          delay={meteor.delay}
          duration={4}
          headRadius={6}
          strokeWidth={3.2}
        />
      ))}

      <GlowFlash glowId={glow} cx={960} cy={540} r={170} opacity={0.9} animation="wink-glow-pulse 4s ease-in-out infinite" delay="1.02s" />
      <FireworkBurst cx={960} cy={540} radius={340} color={FIREWORK_ACCENTS[0]} tip={FIREWORK_ACCENTS[5]} delay={1.18} duration={4} rays={18} core={18} width={3.2} />
      <ExplosionRing cx={960} cy={540} radius={360} color={FIREWORK_ACCENTS[2]} delay={1.26} duration={4} strokeWidth={3.2} />
      <FireworkStars cx={960} cy={540} radius={420} delay={1.42} duration={4} count={10} color={FIREWORK_ACCENTS[5]} size={14} />

      {CLOUD.map((dust, i) => (
        <g key={i} style={{ animation: "wink-fade-loop 4s ease-in-out infinite", animationDelay: `${dust.delay}s` }}>
          <circle cx={dust.x} cy={dust.y} r="5" fill={FIREWORK_ACCENTS[5]} opacity="0.34" />
          <circle cx={dust.x + 28} cy={dust.y - 12} r="4" fill="white" opacity="0.2" />
        </g>
      ))}
    </EffectSvg>
  );
}
