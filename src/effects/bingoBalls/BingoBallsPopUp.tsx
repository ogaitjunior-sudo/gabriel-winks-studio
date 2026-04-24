import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { BINGO_LETTERS, MAIN_GAP, MAIN_START_X, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const POP_POSITIONS = BINGO_LETTERS.map((_, i) => ({
  x: MAIN_START_X + i * MAIN_GAP,
  y: 570 + [90, 10, -64, 10, 90][i],
  delay: i * 0.15,
}));

const POP_SPARKS = [
  { x: 450, y: 340, r: 18, delay: 0.28 },
  { x: 690, y: 250, r: 14, delay: 0.44 },
  { x: 960, y: 210, r: 22, delay: 0.6 },
  { x: 1230, y: 250, r: 14, delay: 0.76 },
  { x: 1470, y: 340, r: 18, delay: 0.92 },
];

export function BingoBallsPopUp({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d="M 350 805 C 610 600, 760 440, 960 430 C 1160 440, 1310 600, 1570 805" fill="none" stroke={GOLD_LIGHT} strokeWidth="3" strokeLinecap="round" opacity="0.18" />

      {POP_SPARKS.map((spark, i) => (
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

      {POP_POSITIONS.map((ball, i) => (
        <g key={i}>
          <ellipse cx={ball.x} cy="840" rx="80" ry="18" fill={SMALL_PALETTE[i].deep} opacity="0.22" />
          <line x1={ball.x} y1="820" x2={ball.x} y2={ball.y + 110} stroke={SMALL_PALETTE[i].bg} strokeWidth="3" strokeLinecap="round" opacity="0.28" />
          <SmallBingoBall
            cx={ball.x + (i % 2 === 0 ? -64 : 64)}
            cy={ball.y + 160}
            r={20}
            color={SMALL_PALETTE[(i + 2) % SMALL_PALETTE.length]}
            style={{
              transformOrigin: `${ball.x}px ${ball.y + 160}px`,
              animation: "wink-pop-up 2.6s cubic-bezier(.34,1.56,.64,1) infinite",
              animationDelay: `${ball.delay + 0.08}s`,
            }}
          />
          <MainBingoBall
            index={i}
            cx={ball.x}
            cy={ball.y}
            style={{
              transformOrigin: `${ball.x}px ${ball.y}px`,
              animation: "wink-pop-up 2.6s cubic-bezier(.34,1.56,.64,1) infinite",
              animationDelay: `${ball.delay}s`,
            }}
          />
        </g>
      ))}
    </EffectSvg>
  );
}
