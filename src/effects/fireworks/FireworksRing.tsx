import { EffectSvg } from "../_shared";

export function FireworksRing({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <defs>
        <radialGradient id="fwr-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(50 100% 85%)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(45 95% 60%)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* central glow */}
      <g style={{ transformOrigin: "960px 540px", animation: "wink-burst 2.6s ease-out infinite" }}>
        <circle cx="960" cy="540" r="60" fill="url(#fwr-glow)" />
      </g>
      {/* expanding rings */}
      {[0, 0.4, 0.8].map((d, i) => (
        <g key={i} style={{ transformOrigin: "960px 540px", animation: "wink-ring-expand 2.6s ease-out infinite", animationDelay: `${d}s` }}>
          <circle cx="960" cy="540" r="320" fill="none" stroke="hsl(45 95% 65%)" strokeWidth="4" />
        </g>
      ))}
      {/* sparkle dots on the ring */}
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 18;
        return (
          <g key={i} style={{ transformOrigin: "960px 540px", animation: "wink-burst 2.6s ease-out infinite", animationDelay: "0.3s" }}>
            <circle cx={960 + Math.cos(a) * 320} cy={540 + Math.sin(a) * 320} r="5" fill="hsl(50 100% 80%)" />
          </g>
        );
      })}
    </EffectSvg>
  );
}
