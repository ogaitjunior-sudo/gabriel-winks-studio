import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, glowCircle, glowId, goldGlowGradient } from "./_goldShared";

const RING = Array.from({ length: 9 }, (_, i) => ({
  angle: (360 / 9) * i,
  radius: 220,
  size: 18 + (i % 3) * 4,
  delay: i * 0.12,
}));

const FLOATS = [
  { x: 660, y: 360, r: 16, delay: 0.18 },
  { x: 840, y: 280, r: 14, delay: 0.42 },
  { x: 1080, y: 290, r: 14, delay: 0.66 },
  { x: 1260, y: 360, r: 16, delay: 0.9 },
  { x: 760, y: 720, r: 12, delay: 1.14 },
  { x: 1160, y: 720, r: 12, delay: 1.38 },
];

export function GoldStarsEternalGlow({ playing }: { playing: boolean }) {
  const glow = glowId("gseg", "center");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.14)}</defs>

      <g style={{ animation: "wink-glow-pulse 3.6s ease-in-out infinite" }}>
        {glowCircle(glow, GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 280, 0.34)}
        <path d={starPath(GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 46)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1.8" />
      </g>

      <ellipse cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} rx="290" ry="185" fill="none" stroke={GOLD_LIGHT} strokeWidth="1.4" opacity="0.16" />

      {RING.map((star, i) => (
        <g key={i} transform={`translate(${GOLD_SAFE_AREA.centerX} ${GOLD_SAFE_AREA.centerY})`}>
          <g
            style={{
              // @ts-expect-error css custom props
              "--orbit-r": `${star.radius + (i % 2) * 34}px`,
              transformOrigin: "0 0",
              animation: "wink-orbit 6s linear infinite",
              animationDelay: `${star.delay}s`,
            }}
          >
            <path d={starPath(0, 0, star.size)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        </g>
      ))}

      {FLOATS.map((star, i) => (
        <g
          key={`float-${i}`}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-twinkle 3.6s ease-in-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, star.y, star.r)} fill={GOLD_ACCENTS[(i + 1) % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}
    </EffectSvg>
  );
}
