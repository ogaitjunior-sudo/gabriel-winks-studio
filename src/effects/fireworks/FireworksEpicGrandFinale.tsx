import { EffectSvg } from "../_shared";
import {
  FIREWORK_ACCENTS,
  FIREWORK_SAFE_AREA,
  ExplosionRing,
  FireworkBurst,
  FireworkGlowGradient,
  FireworkStars,
  GlowFlash,
  RocketTrail,
  fireworkGlowId,
} from "./_fireworksShared";

const ROCKETS = [
  { x: 840, tx: 120, ty: -560, delay: 0.16, color: FIREWORK_ACCENTS[1] },
  { x: 960, tx: 0, ty: -620, delay: 0.28, color: FIREWORK_ACCENTS[0] },
  { x: 1080, tx: -120, ty: -560, delay: 0.4, color: FIREWORK_ACCENTS[2] },
];

const SPARKS = [
  { x: 900, y: 880, delay: 0.04, color: FIREWORK_ACCENTS[5] },
  { x: 960, y: 860, delay: 0.12, color: FIREWORK_ACCENTS[0] },
  { x: 1020, y: 882, delay: 0.2, color: FIREWORK_ACCENTS[1] },
];

export function FireworksEpicGrandFinale({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwegf", "core");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[0]} outer={FIREWORK_ACCENTS[2]} />
      </defs>

      {SPARKS.map((spark, i) => (
        <g key={i} style={{ animation: "wink-fade-loop 4.2s ease-in-out infinite", animationDelay: `${spark.delay}s` }}>
          <circle cx={spark.x} cy={spark.y} r="5" fill={spark.color} opacity="0.72" />
          <line x1={spark.x - 16} y1={spark.y} x2={spark.x + 16} y2={spark.y} stroke={spark.color} strokeWidth="1.4" opacity="0.48" />
        </g>
      ))}

      {ROCKETS.map((rocket, i) => (
        <RocketTrail
          key={i}
          x={rocket.x}
          y={FIREWORK_SAFE_AREA.launchY}
          tx={rocket.tx}
          ty={rocket.ty}
          color={rocket.color}
          delay={rocket.delay}
          duration={4.2}
          headRadius={6}
          strokeWidth={3.2}
        />
      ))}

      <GlowFlash
        glowId={glow}
        cx={960}
        cy={330}
        r={150}
        opacity={0.56}
        animation="wink-glow-pulse 4.2s ease-in-out infinite"
        delay="1.26s"
      />

      <FireworkBurst cx={960} cy={330} radius={360} color={FIREWORK_ACCENTS[0]} tip={FIREWORK_ACCENTS[5]} delay={1.44} duration={4.2} rays={18} core={18} width={3.2} />
      <ExplosionRing cx={960} cy={330} radius={280} color={FIREWORK_ACCENTS[5]} delay={1.5} duration={4.2} strokeWidth={4} />
      <ExplosionRing cx={960} cy={330} radius={380} color={FIREWORK_ACCENTS[2]} delay={1.64} duration={4.2} strokeWidth={3} />
      <FireworkStars cx={960} cy={330} radius={430} delay={1.7} duration={4.2} count={10} color={FIREWORK_ACCENTS[5]} size={16} />
    </EffectSvg>
  );
}
