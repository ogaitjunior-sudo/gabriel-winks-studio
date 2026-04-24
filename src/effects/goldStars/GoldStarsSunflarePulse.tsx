import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, glowCircle, glowId, goldGlowGradient, sparkleCross } from "./_goldShared";

const SURROUNDS = Array.from({ length: 14 }, (_, i) => ({
  angle: (Math.PI * 2 * i) / 14,
  radius: 250 + (i % 3) * 42,
  size: 16 + (i % 4) * 4,
  delay: i * 0.08,
}));

const RAYS = Array.from({ length: 20 }, (_, i) => ({
  angle: (Math.PI * 2 * i) / 20,
  length: 170 + (i % 4) * 34,
}));

export function GoldStarsSunflarePulse({ playing }: { playing: boolean }) {
  const glow = glowId("gssp", "sun");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.28)}</defs>

      <g
        style={{
          transformOrigin: `${GOLD_SAFE_AREA.centerX}px ${GOLD_SAFE_AREA.centerY}px`,
          animation: "wink-glow-pulse 3.1s ease-in-out infinite",
        }}
      >
        {glowCircle(glow, GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 320, 0.5)}
        <ellipse cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} rx="330" ry="220" fill="none" stroke={GOLD} strokeWidth="1.6" opacity="0.16" />
        <ellipse cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} rx="210" ry="140" fill="none" stroke={GOLD_LIGHT} strokeWidth="1.2" opacity="0.18" />
        {RAYS.map((ray, i) => (
          <line
            key={i}
            x1={GOLD_SAFE_AREA.centerX + Math.cos(ray.angle) * 56}
            y1={GOLD_SAFE_AREA.centerY + Math.sin(ray.angle) * 40}
            x2={GOLD_SAFE_AREA.centerX + Math.cos(ray.angle) * ray.length}
            y2={GOLD_SAFE_AREA.centerY + Math.sin(ray.angle) * ray.length * 0.72}
            stroke={GOLD_ACCENTS[i % GOLD_ACCENTS.length]}
            strokeWidth={2 + (i % 3) * 0.8}
            strokeLinecap="round"
            opacity="0.64"
          />
        ))}
        {sparkleCross(GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 54, GOLD_LIGHT)}
        <path d={starPath(GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 42)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1.6" />
      </g>

      {SURROUNDS.map((star, i) => {
        const x = GOLD_SAFE_AREA.centerX + Math.cos(star.angle) * star.radius;
        const y = GOLD_SAFE_AREA.centerY + Math.sin(star.angle) * star.radius * 0.68;
        return (
          <g
            key={i}
            style={{
              transformOrigin: `${x}px ${y}px`,
              animation: "wink-twinkle 3.1s ease-in-out infinite",
              animationDelay: `${star.delay}s`,
            }}
          >
            <path d={starPath(x, y, star.size)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        );
      })}
    </EffectSvg>
  );
}
