import { EffectSvg } from "../_shared";
import {
  FIREWORK_ACCENTS,
  FireworkBurst,
  FireworkGlowGradient,
  GlowFlash,
  fireworkGlowId,
} from "./_fireworksShared";

const STRANDS = Array.from({ length: 30 }, (_, i) => {
  const t = i / 29;
  const angle = Math.PI * (0.14 + t * 0.72);
  const length = 270 + (i % 5) * 36;
  return {
    x2: 960 + Math.cos(angle) * length,
    y2: 420 + Math.sin(angle) * length * 0.82 + (i % 3) * 26,
    delay: 0.08 + (i % 10) * 0.045,
    color: i % 4 === 0 ? FIREWORK_ACCENTS[5] : "hsl(45 95% 65%)",
    width: 1.7 + (i % 3) * 0.55,
  };
});

const FALLING = Array.from({ length: 12 }, (_, i) => ({
  x: 620 + i * 62,
  y: 580 + (i % 4) * 48,
  delay: 0.72 + i * 0.05,
}));

export function FireworksWillow({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwwillow", "canopy");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[5]} outer={FIREWORK_ACCENTS[0]} />
      </defs>

      <GlowFlash glowId={glow} cx={960} cy={430} r={310} opacity={0.62} animation="wink-glow-pulse 3.2s ease-in-out infinite" delay="0.24s" />
      <FireworkBurst cx={960} cy={430} radius={220} color={FIREWORK_ACCENTS[0]} tip={FIREWORK_ACCENTS[5]} delay={0.14} duration={3.2} rays={18} core={14} width={2.2} />

      {STRANDS.map((strand, i) => (
        <g key={i} style={{ transformOrigin: "960px 430px", animation: "wink-burst 3.2s ease-out infinite", animationDelay: `${strand.delay}s` }}>
          <path
            d={`M 960 430 C ${(960 + strand.x2) / 2} ${strand.y2 - 180}, ${strand.x2} ${strand.y2 - 120}, ${strand.x2} ${strand.y2}`}
            fill="none"
            stroke={strand.color}
            strokeWidth={strand.width}
            strokeLinecap="round"
            opacity="0.86"
          />
          <circle cx={strand.x2} cy={strand.y2} r={4 + (i % 3)} fill={FIREWORK_ACCENTS[(i + 5) % FIREWORK_ACCENTS.length]} />
        </g>
      ))}

      {FALLING.map((spark, i) => (
        <circle
          key={`fall-${i}`}
          cx={spark.x}
          cy={spark.y}
          r={4 + (i % 2)}
          fill={FIREWORK_ACCENTS[i % FIREWORK_ACCENTS.length]}
          opacity="0.74"
          style={{
            transformOrigin: `${spark.x}px ${spark.y}px`,
            animation: "wink-twinkle 3.2s ease-in-out infinite",
            animationDelay: `${spark.delay}s`,
          }}
        />
      ))}
    </EffectSvg>
  );
}
