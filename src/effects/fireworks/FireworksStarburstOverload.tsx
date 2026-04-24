import { EffectSvg, starPath } from "../_shared";
import {
  FIREWORK_ACCENTS,
  ExplosionRing,
  FireworkBurst,
  FireworkGlowGradient,
  FireworkStars,
  GlowFlash,
  fireworkGlowId,
} from "./_fireworksShared";

const GATHERS = [
  { x: 620, y: 320, tx: 340, ty: 140, delay: 0.08 },
  { x: 760, y: 250, tx: 200, ty: 210, delay: 0.18 },
  { x: 1180, y: 250, tx: -220, ty: 210, delay: 0.28 },
  { x: 1320, y: 320, tx: -360, ty: 140, delay: 0.38 },
  { x: 560, y: 620, tx: 400, ty: -160, delay: 0.48 },
  { x: 1360, y: 620, tx: -400, ty: -160, delay: 0.58 },
  { x: 960, y: 780, tx: 0, ty: -320, delay: 0.68 },
];

export function FireworksStarburstOverload({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwso", "core");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[5]} outer={FIREWORK_ACCENTS[0]} />
      </defs>

      {GATHERS.map((spark, i) => (
        <g
          key={i}
          style={{
            // @ts-expect-error css custom props
            "--tx": `${spark.tx}px`,
            "--ty": `${spark.ty}px`,
            animation: "wink-comet 3.8s ease-out infinite",
            animationDelay: `${spark.delay}s`,
          }}
        >
          <path d={starPath(spark.x, spark.y, 12 + (i % 3) * 2)} fill={FIREWORK_ACCENTS[i % FIREWORK_ACCENTS.length]} stroke="white" strokeWidth="0.7" />
        </g>
      ))}

      <GlowFlash glowId={glow} cx={960} cy={460} r={110} opacity={0.78} animation="wink-glow-pulse 3.8s ease-in-out infinite" delay="0.96s" />
      <GlowFlash glowId={glow} cx={960} cy={460} r={130} opacity={0.84} animation="wink-glow-pulse 3.8s ease-in-out infinite" delay="1.18s" />
      <GlowFlash glowId={glow} cx={960} cy={460} r={150} opacity={0.9} animation="wink-glow-pulse 3.8s ease-in-out infinite" delay="1.36s" />

      <FireworkBurst cx={960} cy={460} radius={320} color={FIREWORK_ACCENTS[0]} tip={FIREWORK_ACCENTS[5]} delay={1.54} duration={3.8} rays={10} core={18} width={3.4} />
      <FireworkStars cx={960} cy={460} radius={360} delay={1.6} duration={3.8} count={10} color={FIREWORK_ACCENTS[5]} size={22} />
      <ExplosionRing cx={960} cy={460} radius={340} color={FIREWORK_ACCENTS[2]} delay={1.66} duration={3.8} strokeWidth={3.2} />
    </EffectSvg>
  );
}
