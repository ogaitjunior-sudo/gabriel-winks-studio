import { EffectSvg } from "../_shared";

const POINTS = Array.from({ length: 32 }, (_, i) => {
  const ang = (i / 32) * Math.PI * 2;
  return { x: Math.cos(ang) * 240, y: Math.sin(ang) * 240, ang };
});

export function FireworksDiamond({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <g style={{ transformOrigin: "960px 540px", animation: "wink-burst 2.6s ease-out infinite" }}>
        {POINTS.map((p, i) => (
          <g key={i}>
            <circle cx={960 + p.x} cy={540 + p.y} r={4} fill="hsl(195 100% 80%)" />
            <circle cx={960 + p.x * 0.6} cy={540 + p.y * 0.6} r={2.5} fill="white" opacity="0.9" />
          </g>
        ))}
        <circle cx={960} cy={540} r={28} fill="white" opacity="0.9" />
        <circle cx={960} cy={540} r={14} fill="hsl(195 100% 90%)" />
      </g>
    </EffectSvg>
  );
}
