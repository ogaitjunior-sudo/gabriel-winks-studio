import { EffectSvg } from "../_shared";

const RINGS = [
  { r: 160, color: "hsl(42 100% 72%)", delay: 0 },
  { r: 250, color: "hsl(195 92% 66%)", delay: 0.35 },
  { r: 340, color: "hsl(282 84% 72%)", delay: 0.7 },
];

const SPARKS = Array.from({ length: 18 }, (_, i) => ({
  angle: (360 / 18) * i,
  length: 150 + (i % 3) * 44,
  color: i % 2 === 0 ? "hsl(42 95% 62%)" : "hsl(195 92% 64%)",
  delay: (i % 6) * 0.08,
}));

export function FireworksHaloPulse({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {RINGS.map((ring, i) => (
        <g
          key={i}
          style={{
            transformOrigin: "960px 540px",
            animation: "wink-ring-expand 3.2s ease-out infinite",
            animationDelay: `${ring.delay}s`,
          }}
        >
          <circle cx={960} cy={540} r={ring.r} fill="none" stroke={ring.color} strokeWidth="6" opacity="0.9" />
        </g>
      ))}

      {SPARKS.map((spark, i) => {
        const angle = (spark.angle * Math.PI) / 180;
        const x = 960 + Math.cos(angle) * spark.length;
        const y = 540 + Math.sin(angle) * spark.length;

        return (
          <g
            key={i}
            style={{
              transformOrigin: "960px 540px",
              animation: "wink-burst 3.2s ease-out infinite",
              animationDelay: `${spark.delay}s`,
            }}
          >
            <line x1={960} y1={540} x2={x} y2={y} stroke={spark.color} strokeWidth="2.4" strokeLinecap="round" />
            <circle cx={x} cy={y} r="5" fill="white" opacity="0.85" />
          </g>
        );
      })}

      <circle
        cx={960}
        cy={540}
        r={50}
        fill="hsl(42 100% 78%)"
        opacity="0.55"
        style={{ animation: "wink-glow-pulse 3.2s ease-in-out infinite" }}
      />
    </EffectSvg>
  );
}
