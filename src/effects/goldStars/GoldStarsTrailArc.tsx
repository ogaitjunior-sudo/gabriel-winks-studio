import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA } from "./_goldShared";

const PATH_D = "M 220 760 Q 640 240 960 260 T 1700 680";
const DUST = [
  { x: 420, y: 520, r: 10, delay: 0.7 },
  { x: 660, y: 340, r: 12, delay: 1.05 },
  { x: 960, y: 250, r: 16, delay: 1.4 },
  { x: 1270, y: 360, r: 12, delay: 1.75 },
  { x: 1500, y: 560, r: 10, delay: 2.1 },
];

export function GoldStarsTrailArc({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d={PATH_D} stroke={GOLD} strokeWidth="3" fill="none" opacity="0.18" />
      <path d={PATH_D} stroke={GOLD_LIGHT} strokeWidth="8" fill="none" opacity="0.08" />

      {Array.from({ length: 10 }, (_, i) => (
        <g
          key={i}
          style={{
            offsetPath: `path('${PATH_D}')`,
            animation: "wink-trail 3.2s ease-in-out infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        >
          <path d={starPath(0, 0, 24 + (i % 3) * 4)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1.2" />
        </g>
      ))}

      {DUST.map((dust, i) => (
        <g
          key={`dust-${i}`}
          style={{
            transformOrigin: `${dust.x}px ${dust.y}px`,
            animation: "wink-fade-loop 3.2s ease-in-out infinite",
            animationDelay: `${dust.delay}s`,
          }}
        >
          <path d={starPath(dust.x, dust.y, dust.r)} fill={GOLD_LIGHT} stroke={GOLD} strokeWidth="0.8" />
        </g>
      ))}
    </EffectSvg>
  );
}
