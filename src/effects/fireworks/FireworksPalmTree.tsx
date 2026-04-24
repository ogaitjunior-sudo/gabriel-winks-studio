import { EffectSvg } from "../_shared";
import {
  FIREWORK_ACCENTS,
  FireworkGlowGradient,
  FireworkStars,
  GlowFlash,
  fireworkGlowId,
} from "./_fireworksShared";

const FRONDS = Array.from({ length: 13 }, (_, i) => {
  const ang = -Math.PI / 2 + (i - 6) * 0.2;
  return { ang, dx: Math.cos(ang), dy: Math.sin(ang), length: 260 + (i % 4) * 42 };
});

const TRUNK_SPARKS = Array.from({ length: 7 }, (_, i) => ({
  y: 860 - i * 58,
  delay: 0.1 + i * 0.09,
  drift: (i % 2 === 0 ? -1 : 1) * (24 + i * 5),
}));

export function FireworksPalmTree({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwpt", "crown");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[4]} outer={FIREWORK_ACCENTS[0]} />
      </defs>

      <line
        x1={960}
        y1={900}
        x2={960}
        y2={540}
        stroke="hsl(45 95% 65%)"
        strokeWidth="4"
        opacity="0.72"
        style={{ animation: "wink-fade-loop 3s ease-in-out infinite" }}
      />

      {TRUNK_SPARKS.map((spark, i) => (
        <circle
          key={i}
          cx={960 + spark.drift}
          cy={spark.y}
          r={4 + (i % 3)}
          fill={FIREWORK_ACCENTS[i % FIREWORK_ACCENTS.length]}
          opacity="0.82"
          style={{
            transformOrigin: `${960 + spark.drift}px ${spark.y}px`,
            animation: "wink-twinkle 3s ease-in-out infinite",
            animationDelay: `${spark.delay}s`,
          }}
        />
      ))}

      <GlowFlash glowId={glow} cx={960} cy={535} r={220} opacity={0.58} animation="wink-glow-pulse 3s ease-in-out infinite" delay="0.48s" />

      <g style={{ transformOrigin: "960px 540px", animation: "wink-burst 3s ease-out infinite", animationDelay: "0.52s" }}>
        {FRONDS.map((f, i) => (
          <g key={i}>
            <line
              x1={960}
              y1={540}
              x2={960 + f.dx * f.length}
              y2={540 + f.dy * f.length}
              stroke={i % 3 === 0 ? "hsl(140 65% 55%)" : FIREWORK_ACCENTS[(i + 2) % FIREWORK_ACCENTS.length]}
              strokeWidth={i % 3 === 0 ? "3.8" : "3"}
              strokeLinecap="round"
            />
            <circle cx={960 + f.dx * f.length} cy={540 + f.dy * f.length} r={7 + (i % 2) * 2} fill="hsl(50 100% 75%)" />
          </g>
        ))}
        <circle cx={960} cy={540} r={18} fill="hsl(50 100% 80%)" />
      </g>

      <FireworkStars cx={960} cy={540} radius={330} delay={0.92} duration={3} count={9} color={FIREWORK_ACCENTS[5]} size={12} />
    </EffectSvg>
  );
}
