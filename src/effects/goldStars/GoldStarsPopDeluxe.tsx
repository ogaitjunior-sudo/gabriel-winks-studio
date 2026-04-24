import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, glowCircle, glowId, sparkleCross } from "./_goldShared";

const STARS = [
  { x: 660, y: 420, r: 42, delay: 0.06 },
  { x: 860, y: 330, r: 56, delay: 0.22 },
  { x: 1060, y: 310, r: 70, delay: 0.38 },
  { x: 1260, y: 420, r: 44, delay: 0.54 },
  { x: 760, y: 650, r: 38, delay: 0.7 },
  { x: 1160, y: 650, r: 38, delay: 0.86 },
  { x: 960, y: 560, r: 50, delay: 1.02 },
];

export function GoldStarsPopDeluxe({ playing }: { playing: boolean }) {
  const glow = glowId("gspd", "core");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0.82" />
          <stop offset="26%" stopColor={GOLD_LIGHT} stopOpacity="0.28" />
          <stop offset="58%" stopColor={GOLD} stopOpacity="0.1" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {glowCircle(glow, GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 220, 0.28)}

      {STARS.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-pop 3s ease-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          {glowCircle(glow, star.x, star.y, star.r * 1.8, 0.3)}
          <path d={starPath(star.x, star.y, star.r)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="2" />
        </g>
      ))}

      {STARS.map((star, i) => (
        <g
          key={`spark-${i}`}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-sparkle 3s ease-in-out infinite",
            animationDelay: `${1.32 + i * 0.05}s`,
          }}
        >
          {sparkleCross(star.x + (i % 2 === 0 ? 56 : -56), star.y - 44, 18, GOLD_ACCENTS[(i + 1) % GOLD_ACCENTS.length])}
        </g>
      ))}
    </EffectSvg>
  );
}
