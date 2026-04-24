import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA } from "./_goldShared";

const FIELD = Array.from({ length: 26 }, (_, i) => ({
  x: GOLD_SAFE_AREA.left + 40 + ((i * 91) % (GOLD_SAFE_AREA.right - GOLD_SAFE_AREA.left - 80)),
  y: GOLD_SAFE_AREA.top + 30 + ((i * 73) % (GOLD_SAFE_AREA.bottom - GOLD_SAFE_AREA.top - 60)),
  r: 8 + (i % 4) * 4,
  delay: (i * 0.14) % 2.8,
  color: GOLD_ACCENTS[i % GOLD_ACCENTS.length],
}));

export function GoldStarsTwinkleField({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {FIELD.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-twinkle 2.8s ease-in-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, star.y, star.r)} fill={star.color} stroke={GOLD_LIGHT} strokeWidth="0.9" />
        </g>
      ))}

      {FIELD.filter((_, i) => i % 5 === 0).map((star, i) => (
        <circle
          key={`dust-${i}`}
          cx={star.x + 24}
          cy={star.y - 18}
          r="4"
          fill={GOLD_LIGHT}
          opacity="0.55"
          style={{ animation: "wink-fade-loop 3.2s ease-in-out infinite", animationDelay: `${0.4 + i * 0.16}s` }}
        />
      ))}
    </EffectSvg>
  );
}
