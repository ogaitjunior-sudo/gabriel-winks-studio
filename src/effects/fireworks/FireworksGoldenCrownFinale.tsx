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

const ROCKETS = [
  { x: 420, tx: 300, ty: -470, delay: 0.06 },
  { x: 650, tx: 190, ty: -560, delay: 0.18 },
  { x: 960, tx: 0, ty: -620, delay: 0.3 },
  { x: 1270, tx: -190, ty: -560, delay: 0.42 },
  { x: 1500, tx: -300, ty: -470, delay: 0.54 },
];

const CROWN = [
  { x: 700, y: 360, delay: 1.02, size: 14 },
  { x: 840, y: 280, delay: 1.14, size: 18 },
  { x: 960, y: 240, delay: 1.26, size: 24 },
  { x: 1080, y: 280, delay: 1.38, size: 18 },
  { x: 1220, y: 360, delay: 1.5, size: 14 },
];

export function FireworksGoldenCrownFinale({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwgcf", "gold");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[0]} outer={FIREWORK_ACCENTS[5]} />
      </defs>

      {ROCKETS.map((rocket, i) => (
        <RocketTrail
          key={i}
          x={rocket.x}
          y={900}
          tx={rocket.tx}
          ty={rocket.ty}
          color={FIREWORK_ACCENTS[i % 2 === 0 ? 0 : 1]}
          delay={rocket.delay}
          duration={4.2}
          headRadius={6}
        />
      ))}

      <path
        d="M 700 360 Q 960 470 1220 360"
        stroke={FIREWORK_ACCENTS[5]}
        strokeWidth="2.4"
        fill="none"
        opacity="0.26"
        style={{ animation: "wink-fade-loop 4.2s ease-in-out infinite", animationDelay: "1.08s" }}
      />

      {CROWN.map((spark, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${spark.x}px ${spark.y}px`,
            animation: "wink-sparkle 4.2s ease-in-out infinite",
            animationDelay: `${spark.delay}s`,
          }}
        >
          <path d={`M ${spark.x} ${spark.y - spark.size} L ${spark.x} ${spark.y + spark.size} M ${spark.x - spark.size} ${spark.y} L ${spark.x + spark.size} ${spark.y}`} stroke={FIREWORK_ACCENTS[5]} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx={spark.x} cy={spark.y} r="3" fill="white" opacity="0.86" />
        </g>
      ))}

      <GlowFlash glowId={glow} cx={960} cy={420} r={220} opacity={0.92} animation="wink-glow-pulse 4.2s ease-in-out infinite" delay="1.52s" />
      <FireworkBurst cx={960} cy={420} radius={350} color={FIREWORK_ACCENTS[0]} tip={FIREWORK_ACCENTS[5]} delay={1.64} duration={4.2} rays={18} core={20} width={3.3} />
      <ExplosionRing cx={960} cy={420} radius={360} color={FIREWORK_ACCENTS[5]} delay={1.7} duration={4.2} strokeWidth={3.4} />
      <FireworkStars cx={960} cy={420} radius={430} delay={1.82} duration={4.2} count={10} color={FIREWORK_ACCENTS[5]} size={16} />
    </EffectSvg>
  );
}
