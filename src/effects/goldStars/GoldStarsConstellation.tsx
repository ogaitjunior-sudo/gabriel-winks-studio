import { EffectSvg } from "../_shared";
import { GOLD_DUST, GOLD_SAFE_AREA, dustDot, goldStar } from "./_goldShared";

const NODES = [
  { x: 620, y: 470, r: 18, delay: 0.08 },
  { x: 790, y: 360, r: 24, delay: 0.26 },
  { x: 980, y: 430, r: 32, delay: 0.44 },
  { x: 1140, y: 340, r: 22, delay: 0.62 },
  { x: 1320, y: 470, r: 18, delay: 0.8 },
  { x: 860, y: 650, r: 16, delay: 0.98 },
  { x: 1080, y: 650, r: 16, delay: 1.16 },
];

const LINKS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [2, 5],
  [2, 6],
] as const;

export function GoldStarsConstellation({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {LINKS.map(([from, to], i) => (
        <line
          key={i}
          x1={NODES[from].x}
          y1={NODES[from].y}
          x2={NODES[to].x}
          y2={NODES[to].y}
          stroke={GOLD_DUST}
          strokeWidth="1.4"
          opacity="0.28"
          style={{ animation: "wink-fade-loop 3s ease-in-out infinite", animationDelay: `${i * 0.14}s` }}
        />
      ))}

      {NODES.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-twinkle 3s ease-in-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          {goldStar(star.x, star.y, star.r)}
        </g>
      ))}

      {dustDot(GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 5, 0.28)}
    </EffectSvg>
  );
}
