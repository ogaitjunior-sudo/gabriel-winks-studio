import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { BINGO_LETTERS, MAIN_GAP, MAIN_START_X, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const ARC = BINGO_LETTERS.map((_, i) => ({
  x: MAIN_START_X + i * MAIN_GAP,
  y: 555 + [58, -18, -48, -18, 58][i],
  delay: i * 0.12,
}));

const SPARKS = [
  { x: 470, y: 330, r: 18, delay: 0.12 },
  { x: 730, y: 270, r: 14, delay: 0.36 },
  { x: 1180, y: 275, r: 16, delay: 0.58 },
  { x: 1450, y: 340, r: 18, delay: 0.78 },
  { x: 960, y: 780, r: 14, delay: 0.48 },
];

export function BouncingBingoBallsClassic({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d="M 390 650 C 650 450, 1270 450, 1530 650" fill="none" stroke={GOLD_LIGHT} strokeWidth="3" strokeLinecap="round" opacity="0.18" />

      {SPARKS.map((spark, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${spark.x}px ${spark.y}px`,
            animation: "wink-sparkle 2.6s ease-in-out infinite",
            animationDelay: `${spark.delay}s`,
          }}
        >
          <path d={starPath(spark.x, spark.y, spark.r)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}

      {ARC.map((ball, i) => (
        <SmallBingoBall
          key={`small-${i}`}
          cx={ball.x}
          cy={ball.y + 170}
          r={24}
          color={SMALL_PALETTE[(i + 2) % SMALL_PALETTE.length]}
          style={{
            transformOrigin: `${ball.x}px ${ball.y + 170}px`,
            animation: "wink-bounce-loop 1.6s ease-in-out infinite",
            animationDelay: `${ball.delay + 0.06}s`,
          }}
        />
      ))}

      {ARC.map((ball, i) => (
        <MainBingoBall
          key={i}
          index={i}
          cx={ball.x}
          cy={ball.y}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-bounce-loop 1.6s ease-in-out infinite",
            animationDelay: `${ball.delay}s`,
          }}
        />
      ))}
    </EffectSvg>
  );
}
