import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, sparkleCross } from "./_goldShared";

const CROSSES = [
  { x: 620, y: 360, size: 24, delay: 0.06 },
  { x: 920, y: 280, size: 34, delay: 0.24 },
  { x: 1260, y: 360, size: 26, delay: 0.42 },
  { x: 760, y: 620, size: 20, delay: 0.6 },
  { x: 960, y: 540, size: 42, delay: 0.78 },
  { x: 1160, y: 620, size: 20, delay: 0.96 },
  { x: 960, y: 800, size: 26, delay: 1.14 },
];

export function GoldStarsMagicCrossSpark({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {CROSSES.map((spark, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${spark.x}px ${spark.y}px`,
            animation: "wink-sparkle 3s ease-in-out infinite",
            animationDelay: `${spark.delay}s`,
          }}
        >
          {sparkleCross(spark.x, spark.y, spark.size, GOLD_ACCENTS[i % GOLD_ACCENTS.length])}
          <path d={starPath(spark.x, spark.y, spark.size * 0.24)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="0.8" />
        </g>
      ))}
    </EffectSvg>
  );
}
