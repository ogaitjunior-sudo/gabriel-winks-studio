import { EffectSvg, GOLD_LIGHT, starPath } from "../_shared";

const LANES = [
  { id: "top", baseY: 320, amplitude: 80, phase: 0.1, fill: "hsl(45 95% 60%)", delay: 0, size: 14 },
  { id: "mid", baseY: 520, amplitude: 110, phase: 0.8, fill: "hsl(42 100% 70%)", delay: 0.35, size: 18 },
  { id: "low", baseY: 700, amplitude: 75, phase: 1.5, fill: "hsl(35 92% 62%)", delay: 0.7, size: 16 },
];

const TWINKLES = [
  { x: 320, y: 220, size: 28, delay: 0.2 },
  { x: 960, y: 180, size: 34, delay: 0.8 },
  { x: 1600, y: 240, size: 26, delay: 1.4 },
];

export function GoldStarsAurora({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {LANES.map((lane) =>
        Array.from({ length: 11 }, (_, i) => {
          const progress = i / 10;
          const x = 140 + progress * 1640;
          const y = lane.baseY + Math.sin(progress * Math.PI * 2 + lane.phase) * lane.amplitude;
          const size = lane.size + (i % 3) * 4;

          return (
            <g
              key={`${lane.id}-${i}`}
              style={{
                transformOrigin: `${x}px ${y}px`,
                animation: "wink-fade-loop 3.8s ease-in-out infinite",
                animationDelay: `${lane.delay + i * 0.12}s`,
              }}
            >
              <path d={starPath(x, y, size)} fill={lane.fill} stroke={GOLD_LIGHT} strokeWidth="1" />
            </g>
          );
        })
      )}

      {TWINKLES.map((twinkle, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${twinkle.x}px ${twinkle.y}px`,
            animation: "wink-twinkle 2.8s ease-in-out infinite",
            animationDelay: `${twinkle.delay}s`,
          }}
        >
          <path d={starPath(twinkle.x, twinkle.y, twinkle.size)} fill="hsl(50 100% 78%)" stroke={GOLD_LIGHT} strokeWidth="1.5" />
        </g>
      ))}
    </EffectSvg>
  );
}
