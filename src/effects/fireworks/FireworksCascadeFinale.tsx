import { EffectSvg, starPath } from "../_shared";
import {
  FIREWORK_ACCENTS,
  ExplosionRing,
  FireworkBurst,
  FireworkGlowGradient,
  GlowFlash,
  RocketTrail,
  fireworkGlowId,
} from "./_fireworksShared";

const TOP_BURSTS = [
  { cx: 620, cy: 230, delay: 0.1, color: FIREWORK_ACCENTS[1], radius: 120 },
  { cx: 960, cy: 190, delay: 0.34, color: FIREWORK_ACCENTS[5], radius: 150 },
  { cx: 1300, cy: 240, delay: 0.58, color: FIREWORK_ACCENTS[2], radius: 120 },
];

const CASCADE = Array.from({ length: 14 }, (_, i) => ({
  x: 420 + ((i * 86) % 1100),
  delay: 0.86 + (i % 5) * 0.08,
  size: 10 + (i % 3) * 4,
  color: FIREWORK_ACCENTS[i % FIREWORK_ACCENTS.length],
}));

export function FireworksCascadeFinale({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwcf", "rise");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[0]} outer={FIREWORK_ACCENTS[5]} />
      </defs>

      {TOP_BURSTS.map((burst, i) => (
        <FireworkBurst
          key={i}
          cx={burst.cx}
          cy={burst.cy}
          radius={burst.radius}
          color={burst.color}
          tip={FIREWORK_ACCENTS[5]}
          delay={burst.delay}
          duration={4.4}
          rays={10}
          core={10}
          width={2.2}
        />
      ))}

      {CASCADE.map((spark, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${spark.x}px 240px`,
            animation: "wink-spark-fall 4.4s linear infinite",
            animationDelay: `${spark.delay}s`,
          }}
        >
          <path d={starPath(spark.x, 240, spark.size)} fill={spark.color} stroke="white" strokeWidth="0.7" opacity="0.86" />
        </g>
      ))}

      <RocketTrail x={960} y={900} tx={0} ty={-340} color={FIREWORK_ACCENTS[0]} delay={1.42} duration={4.4} headRadius={7} strokeWidth={3.2} />
      <GlowFlash glowId={glow} cx={960} cy={560} r={180} opacity={0.9} animation="wink-glow-pulse 4.4s ease-in-out infinite" delay="1.96s" />
      <FireworkBurst cx={960} cy={560} radius={360} color={FIREWORK_ACCENTS[0]} tip={FIREWORK_ACCENTS[5]} delay={2.08} duration={4.4} rays={18} core={18} width={3.2} />
      <ExplosionRing cx={960} cy={560} radius={360} color={FIREWORK_ACCENTS[5]} delay={2.14} duration={4.4} strokeWidth={3.4} />
    </EffectSvg>
  );
}
