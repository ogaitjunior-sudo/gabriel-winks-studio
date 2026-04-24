import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { BINGO_LETTERS, MAIN_GAP, MAIN_START_X, MainBingoBall, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const REELS = BINGO_LETTERS.map((_, i) => ({
  x: MAIN_START_X + i * MAIN_GAP,
  y: 540 + [28, -18, 0, -18, 28][i],
  delay: i * 0.28,
}));

const COINS = Array.from({ length: 12 }, (_, i) => ({
  x: 360 + i * 110,
  y: i % 2 === 0 ? 250 : 810,
  delay: 0.18 + i * 0.08,
}));

export function BingoBallsSlot({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <rect x="300" y="330" width="1320" height="410" rx="58" fill="hsl(43 94% 60%)" opacity="0.08" />
      <rect x="335" y="365" width="1250" height="340" rx="40" fill="none" stroke={GOLD_LIGHT} strokeWidth="4" opacity="0.24" />
      <line x1="360" y1="540" x2="1560" y2="540" stroke={GOLD} strokeWidth="2" strokeLinecap="round" opacity="0.22" />

      {COINS.map((coin, i) => (
        <SmallBingoBall
          key={i}
          cx={coin.x}
          cy={coin.y}
          r={18 + (i % 2) * 4}
          color={SMALL_PALETTE[(i + 2) % SMALL_PALETTE.length]}
          style={{
            transformOrigin: `${coin.x}px ${coin.y}px`,
            animation: "wink-twinkle 2.8s ease-in-out infinite",
            animationDelay: `${coin.delay}s`,
          }}
        />
      ))}

      {REELS.map((reel, i) => (
        <g key={i}>
          <rect x={reel.x - 118} y="395" width="236" height="290" rx="28" fill="black" opacity="0.1" />
          <circle
            cx={reel.x}
            cy={reel.y}
            r="126"
            fill="none"
            stroke={SMALL_PALETTE[i].bg}
            strokeWidth="4"
            opacity="0.22"
            style={{
              transformOrigin: `${reel.x}px ${reel.y}px`,
              animation: "wink-ring-expand 2.8s ease-out infinite",
              animationDelay: `${reel.delay + 0.36}s`,
            }}
          />
          <g
            style={{
              transformOrigin: `${reel.x}px ${reel.y}px`,
              animation: "wink-pop-up 2.8s cubic-bezier(.34,1.56,.64,1) infinite",
              animationDelay: `${reel.delay}s`,
            }}
          >
            <MainBingoBall index={i} cx={reel.x} cy={reel.y} />
          </g>
        </g>
      ))}

      <g style={{ transformOrigin: "960px 250px", animation: "wink-sparkle 2.8s ease-in-out infinite", animationDelay: "0.9s" }}>
        <path d={starPath(960, 250, 24)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
      </g>
    </EffectSvg>
  );
}
