import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, glowCircle, glowId, goldGlowGradient } from "./_goldShared";

const RAYS = Array.from({ length: 12 }, (_, i) => ({
  angle: (Math.PI * 2 * i) / 12,
  length: 190 + (i % 3) * 46,
  delay: i * 0.04,
}));

const FLOATERS = [
  { x: 540, y: 320, r: 18, delay: 1.02 },
  { x: 760, y: 220, r: 14, delay: 1.18 },
  { x: 1160, y: 230, r: 14, delay: 1.34 },
  { x: 1380, y: 330, r: 18, delay: 1.5 },
  { x: 620, y: 720, r: 16, delay: 1.22 },
  { x: 1300, y: 710, r: 16, delay: 1.44 },
];

export function GoldStarsRadiantBurst({ playing }: { playing: boolean }) {
  const glow = glowId("gsrb", "burst");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.2)}</defs>

      <g
        style={{
          transformOrigin: `${GOLD_SAFE_AREA.centerX}px ${GOLD_SAFE_AREA.centerY}px`,
          animation: "wink-glow-pulse 3.2s ease-in-out infinite",
        }}
      >
        {glowCircle(glow, GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 280, 0.36)}
      </g>

      <g
        style={{
          transformOrigin: `${GOLD_SAFE_AREA.centerX}px ${GOLD_SAFE_AREA.centerY}px`,
          animation: "wink-burst 3.2s ease-out infinite",
          animationDelay: "0.12s",
        }}
      >
        {RAYS.map((ray, i) => {
          const x = GOLD_SAFE_AREA.centerX + Math.cos(ray.angle) * ray.length;
          const y = GOLD_SAFE_AREA.centerY + Math.sin(ray.angle) * ray.length;

          return (
            <g key={i}>
              <line
                x1={GOLD_SAFE_AREA.centerX}
                y1={GOLD_SAFE_AREA.centerY}
                x2={x}
                y2={y}
                stroke={GOLD_ACCENTS[i % GOLD_ACCENTS.length]}
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.88"
              />
              <path d={starPath(x, y, 22 + (i % 2) * 6)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1.4" />
            </g>
          );
        })}
      </g>

      {FLOATERS.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-fade-loop 3.2s ease-in-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, star.y, star.r)} fill={GOLD_LIGHT} stroke={GOLD} strokeWidth="1" />
        </g>
      ))}
    </EffectSvg>
  );
}
