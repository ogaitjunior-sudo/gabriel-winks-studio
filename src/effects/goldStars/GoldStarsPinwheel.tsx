import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";

const ARMS = Array.from({ length: 12 }, (_, i) => ({
  angle: (360 / 12) * i,
  delay: (i * 0.16) % 3.4,
  size: 16 + (i % 3) * 4,
}));

export function GoldStarsPinwheel({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {ARMS.map((arm, i) => (
        <g
          key={i}
          style={{
            transformOrigin: "960px 540px",
            transform: `rotate(${arm.angle}deg)`,
          }}
        >
          <g
            style={{
              transformOrigin: "960px 540px",
              animation: "wink-swirl 3.4s ease-in-out infinite",
              animationDelay: `${arm.delay}s`,
            }}
          >
            <path d={starPath(960, 540, arm.size)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1.2" />
          </g>
        </g>
      ))}

      <g style={{ transformOrigin: "960px 540px", animation: "wink-glow-pulse 3.4s ease-in-out infinite" }}>
        <path d={starPath(960, 540, 68)} fill="hsl(45 95% 60%)" stroke={GOLD_LIGHT} strokeWidth="2" />
      </g>
    </EffectSvg>
  );
}
