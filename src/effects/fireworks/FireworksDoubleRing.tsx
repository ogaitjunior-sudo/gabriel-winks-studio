import { EffectSvg } from "../_shared";
import {
  FIREWORK_ACCENTS,
  ExplosionRing,
  FireworkBurst,
  FireworkGlowGradient,
  FireworkStars,
  GlowFlash,
  fireworkGlowId,
} from "./_fireworksShared";

const SATELLITES = Array.from({ length: 12 }, (_, i) => ({
  angle: (Math.PI * 2 * i) / 12,
  radius: 250 + (i % 2) * 70,
  delay: 0.16 + i * 0.035,
}));

export function FireworksDoubleRing({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwdr", "core");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[3]} outer={FIREWORK_ACCENTS[0]} />
      </defs>

      <GlowFlash glowId={glow} cx={960} cy={540} r={245} opacity={0.78} animation="wink-glow-pulse 2.8s ease-in-out infinite" />
      <ExplosionRing cx={960} cy={540} radius={170} color={FIREWORK_ACCENTS[2]} delay={0.06} duration={2.8} strokeWidth={4.8} />
      <ExplosionRing cx={960} cy={540} radius={260} color={FIREWORK_ACCENTS[0]} delay={0.28} duration={2.8} strokeWidth={5.4} />
      <ExplosionRing cx={960} cy={540} radius={350} color={FIREWORK_ACCENTS[3]} delay={0.48} duration={2.8} strokeWidth={4.2} />
      <FireworkBurst cx={960} cy={540} radius={300} color={FIREWORK_ACCENTS[5]} tip={FIREWORK_ACCENTS[2]} delay={0.2} duration={2.8} rays={18} core={18} width={2.6} />
      <FireworkStars cx={960} cy={540} radius={380} delay={0.52} duration={2.8} count={10} color={FIREWORK_ACCENTS[5]} size={13} />

      {SATELLITES.map((spark, i) => {
        const x = 960 + Math.cos(spark.angle) * spark.radius;
        const y = 540 + Math.sin(spark.angle) * spark.radius * 0.66;

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={5 + (i % 3)}
            fill={FIREWORK_ACCENTS[i % FIREWORK_ACCENTS.length]}
            opacity="0.86"
            style={{
              transformOrigin: `${x}px ${y}px`,
              animation: "wink-twinkle 2.8s ease-in-out infinite",
              animationDelay: `${spark.delay}s`,
            }}
          />
        );
      })}
    </EffectSvg>
  );
}
