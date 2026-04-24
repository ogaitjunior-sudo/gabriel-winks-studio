import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, sparkleCross } from "./_goldShared";

const SWIRL = Array.from({ length: 11 }, (_, i) => ({
  angle: (360 / 11) * i,
  delay: (i * 0.12) % 2.8,
  size: 16 + (i % 3) * 4,
}));

const CROWN = [
  { x: 760, y: 320, r: 18, delay: 1.1 },
  { x: 880, y: 250, r: 22, delay: 1.22 },
  { x: 960, y: 220, r: 28, delay: 1.34 },
  { x: 1040, y: 250, r: 22, delay: 1.46 },
  { x: 1160, y: 320, r: 18, delay: 1.58 },
];

export function GoldStarsSwirlCrown({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {SWIRL.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: "960px 340px",
            transform: `rotate(${star.angle}deg)`,
          }}
        >
          <g
            style={{
              transformOrigin: "960px 340px",
              animation: "wink-swirl 3.3s ease-in-out infinite",
              animationDelay: `${star.delay}s`,
            }}
          >
            <path d={starPath(960, 340, star.size)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1.1" />
          </g>
        </g>
      ))}

      {CROWN.map((star, i) => (
        <g
          key={`crown-${i}`}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-pop 3.3s ease-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, star.y, star.r)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1.4" />
        </g>
      ))}

      {CROWN.map((star, i) => (
        <g
          key={`spark-${i}`}
          style={{
            transformOrigin: `${star.x}px ${star.y - 60}px`,
            animation: "wink-sparkle 3.3s ease-in-out infinite",
            animationDelay: `${1.72 + i * 0.08}s`,
          }}
        >
          {sparkleCross(star.x, star.y - 60, 16, GOLD_LIGHT)}
        </g>
      ))}
    </EffectSvg>
  );
}
