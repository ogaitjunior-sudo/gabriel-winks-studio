import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS } from "./_goldShared";

const FALLS = Array.from({ length: 18 }, (_, i) => ({
  x: 220 + ((i * 91) % 1480),
  delay: (i * 0.14) % 2.8,
  size: 12 + (i % 4) * 4,
  speed: 2.8 + (i % 3) * 0.25,
  color: GOLD_ACCENTS[i % GOLD_ACCENTS.length],
}));

export function GoldStarsShowerPremium({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {FALLS.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px 120px`,
            animation: `wink-shower ${star.speed}s linear infinite`,
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, 120, star.size)} fill={star.color} stroke={GOLD_LIGHT} strokeWidth="1" />
          <circle cx={star.x + star.size * 1.5} cy={160} r="4" fill={GOLD_LIGHT} opacity="0.55" />
        </g>
      ))}
    </EffectSvg>
  );
}
