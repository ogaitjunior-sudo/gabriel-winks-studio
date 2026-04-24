import { EffectSvg, starPath } from "../_shared";
import {
  FIREWORK_ACCENTS,
  ExplosionRing,
  FireworkBurst,
  FireworkGlowGradient,
  GlowFlash,
  fireworkGlowId,
} from "./_fireworksShared";

const SPIRAL = Array.from({ length: 12 }, (_, i) => ({
  angle: (360 / 12) * i,
  delay: (i * 0.1) % 1.2,
  size: 12 + (i % 3) * 3,
}));

export function FireworksSpiralChargeExplosion({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwsce", "center");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[2]} outer={FIREWORK_ACCENTS[0]} />
      </defs>

      {SPIRAL.map((spark, i) => (
        <g
          key={i}
          style={{
            transformOrigin: "960px 430px",
            transform: `rotate(${spark.angle}deg)`,
          }}
        >
          <g
            style={{
              transformOrigin: "960px 430px",
              animation: "wink-swirl 3.8s ease-in-out infinite",
              animationDelay: `${spark.delay}s`,
            }}
          >
            <path d={starPath(960, 430, spark.size)} fill={FIREWORK_ACCENTS[i % FIREWORK_ACCENTS.length]} stroke="white" strokeWidth="0.8" opacity="0.9" />
          </g>
        </g>
      ))}

      <GlowFlash glowId={glow} cx={960} cy={430} r={170} opacity={0.88} animation="wink-glow-pulse 3.8s ease-in-out infinite" delay="1.12s" />
      <FireworkBurst cx={960} cy={430} radius={380} color={FIREWORK_ACCENTS[0]} tip={FIREWORK_ACCENTS[5]} delay={1.42} duration={3.8} rays={20} core={18} width={3.2} />
      <ExplosionRing cx={960} cy={430} radius={360} color={FIREWORK_ACCENTS[2]} delay={1.5} duration={3.8} strokeWidth={3.2} />
    </EffectSvg>
  );
}
