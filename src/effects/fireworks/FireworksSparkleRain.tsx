import { EffectSvg } from "../_shared";

const SEED = Array.from({ length: 28 }, (_, i) => ({
  x: 380 + ((i * 53) % 1180),
  delay: (i * 0.11) % 3.2,
  size: 2 + ((i * 7) % 4),
}));

export function FireworksSparkleRain({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {/* initial small burst */}
      <g style={{ transformOrigin: "960px 380px", animation: "wink-burst 3.2s ease-out infinite" }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (Math.PI * 2 * i) / 10;
          return (
            <line
              key={i}
              x1="960"
              y1="380"
              x2={960 + Math.cos(a) * 120}
              y2={380 + Math.sin(a) * 120}
              stroke="hsl(45 95% 65%)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </g>
      {/* falling sparkles */}
      {SEED.map((s, i) => (
        <g key={i} style={{ animation: "wink-spark-fall 3.2s linear infinite", animationDelay: `${s.delay}s`, transformOrigin: `${s.x}px 400px` }}>
          <circle cx={s.x} cy={400} r={s.size} fill="hsl(50 100% 80%)" />
          <circle cx={s.x} cy={400} r={s.size * 2} fill="hsl(45 95% 60%)" opacity="0.3" />
        </g>
      ))}
    </EffectSvg>
  );
}
