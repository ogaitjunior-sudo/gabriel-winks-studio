import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, glowCircle, glowId, goldGlowGradient, sparkleCross } from "./_goldShared";

const TWINKLES = [
  { x: 620, y: 250, r: 16, delay: 0.08 },
  { x: 820, y: 190, r: 12, delay: 0.18 },
  { x: 1100, y: 180, r: 12, delay: 0.28 },
  { x: 1320, y: 240, r: 16, delay: 0.38 },
  { x: 520, y: 720, r: 14, delay: 0.22 },
  { x: 1400, y: 720, r: 14, delay: 0.34 },
];

const SHOWER = Array.from({ length: 12 }, (_, i) => ({
  x: 260 + i * 130,
  delay: 1.32 + (i % 4) * 0.08,
  size: 12 + (i % 3) * 4,
}));

export function GoldStarsGrandFinale({ playing }: { playing: boolean }) {
  const glow = glowId("gsgf", "center");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.18)}</defs>

      {TWINKLES.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-twinkle 3.8s ease-in-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, star.y, star.r)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${GOLD_SAFE_AREA.centerX}px ${GOLD_SAFE_AREA.centerY}px`,
          animation: "wink-burst 3.8s ease-out infinite",
          animationDelay: "0.7s",
        }}
      >
        {glowCircle(glow, GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 300, 0.38)}
        {Array.from({ length: 10 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 10;
          const x = GOLD_SAFE_AREA.centerX + Math.cos(angle) * 220;
          const y = GOLD_SAFE_AREA.centerY + Math.sin(angle) * 220;
          return (
            <g key={i}>
              <line x1={GOLD_SAFE_AREA.centerX} y1={GOLD_SAFE_AREA.centerY} x2={x} y2={y} stroke={GOLD} strokeWidth="3" strokeLinecap="round" opacity="0.9" />
              <path d={starPath(x, y, 18)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1.1" />
            </g>
          );
        })}
      </g>

      {SHOWER.map((star, i) => (
        <g
          key={`shower-${i}`}
          style={{
            transformOrigin: `${star.x}px 120px`,
            animation: "wink-shower 3.8s linear infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, 120, star.size)} fill={GOLD_ACCENTS[(i + 1) % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${GOLD_SAFE_AREA.centerX}px ${GOLD_SAFE_AREA.centerY}px`,
          animation: "wink-glow-pulse 1.8s ease-in-out infinite",
          animationDelay: "2.1s",
        }}
      >
        {sparkleCross(GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 34, GOLD_LIGHT)}
      </g>
    </EffectSvg>
  );
}
