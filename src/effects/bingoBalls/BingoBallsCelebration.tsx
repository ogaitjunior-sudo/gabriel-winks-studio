import { EffectSvg, starPath, GOLD, GOLD_LIGHT } from "../_shared";
import { MainBingoBall, SmallBingoBall, BINGO_LETTERS, SMALL_PALETTE } from "./_bingoShared";

const SPARKLES = [
  { x: 400, y: 300, d: 0   },
  { x: 1520, y: 320, d: 0.3 },
  { x: 320, y: 780, d: 0.6 },
  { x: 1600, y: 760, d: 0.2 },
  { x: 540, y: 200, d: 0.5 },
  { x: 1380, y: 220, d: 0.8 },
  { x: 480, y: 880, d: 0.1 },
  { x: 1440, y: 880, d: 0.4 },
];

const CONFETTI = [
  { x: 280, y: 260, c: 0, d: 0 },
  { x: 1660, y: 260, c: 1, d: 0.5 },
  { x: 260, y: 820, c: 2, d: 1.0 },
  { x: 1680, y: 820, c: 3, d: 0.3 },
  { x: 600, y: 160, c: 4, d: 0.7 },
  { x: 1320, y: 180, c: 0, d: 1.2 },
];

export function BingoBallsCelebration({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {/* gold sparkles */}
      {SPARKLES.map((s, i) => (
        <g key={i} style={{ transformOrigin: `${s.x}px ${s.y}px`, animation: "wink-sparkle 2.6s ease-in-out infinite", animationDelay: `${s.d}s` }}>
          <path d={starPath(s.x, s.y, 22)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}
      {/* small confetti balls */}
      {CONFETTI.map((c, i) => (
        <SmallBingoBall
          key={i}
          cx={c.x}
          cy={c.y}
          r={26}
          color={SMALL_PALETTE[c.c]}
          style={{
            transformOrigin: `${c.x}px ${c.y}px`,
            animation: "wink-bounce-loop 2.4s ease-in-out infinite",
            animationDelay: `${c.d}s`,
          }}
        />
      ))}
      {/* central BINGO with subtle bounce */}
      {BINGO_LETTERS.map((_, i) => (
        <MainBingoBall
          key={i}
          index={i}
          style={{
            transformOrigin: "center",
            animation: "wink-bounce-loop 1.8s ease-in-out infinite",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </EffectSvg>
  );
}
