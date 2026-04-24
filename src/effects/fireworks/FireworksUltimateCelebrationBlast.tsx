import { EffectSvg, starPath } from "../_shared";
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

const SPARKS = [
  { x: 860, y: 860, delay: 0.04 },
  { x: 930, y: 830, delay: 0.12 },
  { x: 990, y: 820, delay: 0.2 },
  { x: 1060, y: 850, delay: 0.28 },
];

const ROCKETS = [
  { x: 740, tx: 180, ty: -470, delay: 0.22, color: FIREWORK_ACCENTS[1] },
  { x: 860, tx: 80, ty: -540, delay: 0.34, color: FIREWORK_ACCENTS[0] },
  { x: 960, tx: 0, ty: -590, delay: 0.46, color: FIREWORK_ACCENTS[5] },
  { x: 1060, tx: -80, ty: -540, delay: 0.58, color: FIREWORK_ACCENTS[2] },
  { x: 1180, tx: -180, ty: -470, delay: 0.7, color: FIREWORK_ACCENTS[3] },
];

const ORBITERS = Array.from({ length: 8 }, (_, i) => ({
  radius: 150 + (i % 2) * 30,
  delay: 1.18 + i * 0.06,
  size: 12 + (i % 3) * 3,
  color: FIREWORK_ACCENTS[i % FIREWORK_ACCENTS.length],
}));

export function FireworksUltimateCelebrationBlast({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwucb", "center");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[5]} outer={FIREWORK_ACCENTS[0]} />
      </defs>

      {SPARKS.map((spark, i) => (
        <g key={i} style={{ animation: "wink-fade-loop 4.8s ease-in-out infinite", animationDelay: `${spark.delay}s` }}>
          <circle cx={spark.x} cy={spark.y} r="5" fill={FIREWORK_ACCENTS[(i + 1) % FIREWORK_ACCENTS.length]} opacity="0.72" />
        </g>
      ))}

      {ROCKETS.map((rocket, i) => (
        <RocketTrail
          key={i}
          x={rocket.x}
          y={900}
          tx={rocket.tx}
          ty={rocket.ty}
          color={rocket.color}
          delay={rocket.delay}
          duration={4.8}
          headRadius={6}
          strokeWidth={3.1}
        />
      ))}

      {ORBITERS.map((orbiter, i) => (
        <g key={i} transform="translate(960 380)">
          <g
            style={{
              // @ts-expect-error css custom props
              "--orbit-r": `${orbiter.radius}px`,
              transformOrigin: "0 0",
              animation: "wink-orbit 2.2s linear infinite",
              animationDelay: `${orbiter.delay}s`,
            }}
          >
            <path d={starPath(0, 0, orbiter.size)} fill={orbiter.color} stroke="white" strokeWidth="0.7" />
          </g>
        </g>
      ))}

      <GlowFlash glowId={glow} cx={960} cy={380} r={190} opacity={0.92} animation="wink-glow-pulse 4.8s ease-in-out infinite" delay="1.78s" />
      <FireworkBurst cx={960} cy={380} radius={380} color={FIREWORK_ACCENTS[0]} tip={FIREWORK_ACCENTS[5]} delay={1.96} duration={4.8} rays={20} core={20} width={3.3} />
      <ExplosionRing cx={960} cy={380} radius={360} color={FIREWORK_ACCENTS[5]} delay={2.02} duration={4.8} strokeWidth={3.6} />
      <ExplosionRing cx={960} cy={380} radius={440} color={FIREWORK_ACCENTS[2]} delay={2.12} duration={4.8} strokeWidth={3} />
      <FireworkStars cx={960} cy={380} radius={470} delay={2.2} duration={4.8} count={12} color={FIREWORK_ACCENTS[5]} size={16} />
    </EffectSvg>
  );
}
