import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { BINGO_LETTERS, MAIN_GAP, MAIN_START_X, MainBingoBall, SAFE_AREA, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const TILTS = BINGO_LETTERS.map((_, i) => ({
  x: MAIN_START_X + i * MAIN_GAP,
  y: 540 + [54, -34, 32, -42, 48][i],
  rotate: [-14, 10, -8, 12, -10][i],
  delay: i * 0.15,
}));

const IMPACTS = [
  { x: 390, y: 710, delay: 0.12 },
  { x: 710, y: 350, delay: 0.42 },
  { x: 1210, y: 340, delay: 0.72 },
  { x: 1530, y: 720, delay: 0.96 },
];

export function BingoBallsTilt({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d="M 350 650 L 1570 430" stroke={GOLD_LIGHT} strokeWidth="4" strokeLinecap="round" opacity="0.18" />
      <path d="M 390 720 C 650 500, 1270 500, 1530 720" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" opacity="0.18" />

      {IMPACTS.map((impact, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${impact.x}px ${impact.y}px`,
            animation: "wink-sparkle 2s ease-in-out infinite",
            animationDelay: `${impact.delay}s`,
          }}
        >
          <path d={starPath(impact.x, impact.y, 20)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}

      {TILTS.map((ball, i) => (
        <g key={i} transform={`rotate(${ball.rotate} ${ball.x} ${ball.y})`}>
          <MainBingoBall
            index={i}
            cx={ball.x}
            cy={ball.y}
            style={{
              transformOrigin: `${ball.x}px ${ball.y}px`,
              animation: `${i % 2 === 0 ? "wink-bounce-loop" : "wink-pop"} 2s ease-in-out infinite`,
              animationDelay: `${ball.delay}s`,
            }}
          />
        </g>
      ))}

      {[0, 1, 2, 3, 4, 5].map((_, i) => (
        <SmallBingoBall
          key={`small-${i}`}
          cx={SAFE_AREA.left + 120 + i * 220}
          cy={i % 2 === 0 ? 300 : 790}
          r={18}
          color={SMALL_PALETTE[i % SMALL_PALETTE.length]}
          style={{
            transformOrigin: `${SAFE_AREA.left + 120 + i * 220}px ${i % 2 === 0 ? 300 : 790}px`,
            animation: "wink-twinkle 2s ease-in-out infinite",
            animationDelay: `${0.2 + i * 0.11}s`,
          }}
        />
      ))}
    </EffectSvg>
  );
}
