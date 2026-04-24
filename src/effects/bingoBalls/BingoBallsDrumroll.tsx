import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { BINGO_LETTERS, MAIN_GAP, MAIN_START_X, MainBingoBall, SAFE_AREA, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const STAGE = BINGO_LETTERS.map((_, i) => ({
  x: MAIN_START_X + i * MAIN_GAP,
  y: 560 + [38, -18, 10, -18, 38][i],
  delay: i * 0.22,
}));

const ROLLERS = Array.from({ length: 14 }, (_, i) => ({
  x: SAFE_AREA.left + 55 + i * 92,
  y: i % 2 === 0 ? 300 : 780,
  delay: i * 0.075,
}));

export function BingoBallsDrumroll({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <ellipse cx={SAFE_AREA.centerX} cy="600" rx="610" ry="135" fill="hsl(43 94% 60%)" opacity="0.1" />
      <path d="M 360 700 C 560 820, 1360 820, 1560 700" fill="none" stroke={GOLD_LIGHT} strokeWidth="4" strokeLinecap="round" opacity="0.2" />

      {ROLLERS.map((roller, i) => (
        <SmallBingoBall
          key={i}
          cx={roller.x}
          cy={roller.y}
          r={18 + (i % 3) * 3}
          color={SMALL_PALETTE[i % SMALL_PALETTE.length]}
          style={{
            transformOrigin: `${roller.x}px ${roller.y}px`,
            animation: "wink-bounce-loop 1.2s ease-in-out infinite",
            animationDelay: `${roller.delay}s`,
          }}
        />
      ))}

      {STAGE.map((ball, i) => (
        <g key={i}>
          <circle
            cx={ball.x}
            cy={ball.y + 124}
            r={96}
            fill="none"
            stroke={SMALL_PALETTE[i].bg}
            strokeWidth="4"
            opacity="0.24"
            style={{
              transformOrigin: `${ball.x}px ${ball.y + 124}px`,
              animation: "wink-ring-expand 3.2s ease-out infinite",
              animationDelay: `${ball.delay + 0.38}s`,
            }}
          />
          <MainBingoBall
            index={i}
            cx={ball.x}
            cy={ball.y}
            style={{
              transformOrigin: `${ball.x}px ${ball.y}px`,
              animation: "wink-bounce-in 3.2s cubic-bezier(.34,1.56,.64,1) infinite",
              animationDelay: `${ball.delay}s`,
            }}
          />
        </g>
      ))}

      {[520, 1400].map((x, i) => (
        <g
          key={`spark-${i}`}
          style={{
            transformOrigin: `${x}px 430px`,
            animation: "wink-sparkle 3.2s ease-in-out infinite",
            animationDelay: `${0.8 + i * 0.28}s`,
          }}
        >
          <path d={starPath(x, 430, 26)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}
    </EffectSvg>
  );
}
