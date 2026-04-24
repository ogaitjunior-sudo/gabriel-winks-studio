import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import {
  BINGO_LETTERS,
  MAIN_CY,
  MAIN_GAP,
  MAIN_START_X,
  MainBingoBall,
  SMALL_PALETTE,
  SmallBingoBall,
} from "./_bingoShared";

const PARADE_BALLS = Array.from({ length: 10 }, (_, i) => ({
  x: 210 + i * 170,
  y: 250 + (i % 2) * 70,
  r: 28 + (i % 3) * 4,
  color: SMALL_PALETTE[i % SMALL_PALETTE.length],
  delay: i * 0.12,
}));

const SPARKLES = [
  { x: 280, y: 170, size: 18, delay: 0.2 },
  { x: 620, y: 110, size: 14, delay: 0.6 },
  { x: 960, y: 170, size: 22, delay: 1.0 },
  { x: 1300, y: 110, size: 14, delay: 1.4 },
  { x: 1640, y: 170, size: 18, delay: 1.8 },
];

export function BingoBallsParade({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {PARADE_BALLS.map((ball, i) => (
        <SmallBingoBall
          key={i}
          cx={ball.x}
          cy={ball.y}
          r={ball.r}
          color={ball.color}
          style={{
            transformOrigin: `${ball.x}px ${ball.y}px`,
            animation: "wink-bounce-loop 1.8s ease-in-out infinite",
            animationDelay: `${ball.delay}s`,
          }}
        />
      ))}

      {BINGO_LETTERS.map((_, i) => {
        const x = MAIN_START_X + i * MAIN_GAP;
        return (
          <MainBingoBall
            key={i}
            index={i}
            style={{
              transformOrigin: `${x}px ${MAIN_CY}px`,
              animation: "wink-bounce-loop 2.4s ease-in-out infinite",
              animationDelay: `${i * 0.08}s`,
            }}
          />
        );
      })}

      {SPARKLES.map((sparkle, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${sparkle.x}px ${sparkle.y}px`,
            animation: "wink-sparkle 2.6s ease-in-out infinite",
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <path d={starPath(sparkle.x, sparkle.y, sparkle.size)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}
    </EffectSvg>
  );
}
