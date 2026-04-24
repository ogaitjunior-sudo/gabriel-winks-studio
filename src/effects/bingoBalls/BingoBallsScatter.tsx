import { EffectSvg } from "../_shared";
import { MainBingoBall, SmallBingoBall, BINGO_LETTERS, SMALL_PALETTE } from "./_bingoShared";

const SMALLS = [
  { x: 280, y: 220, sx: -30, sy: -20, c: 0, d: 0   },
  { x: 1640, y: 240, sx: 30, sy: -10, c: 1, d: 0.3 },
  { x: 220, y: 860, sx: -20, sy: 20, c: 2, d: 0.6 },
  { x: 1700, y: 840, sx: 30, sy: 25, c: 3, d: 0.9 },
  { x: 480, y: 180, sx: -10, sy: -30, c: 4, d: 0.2 },
  { x: 1440, y: 200, sx: 20, sy: -25, c: 0, d: 0.5 },
  { x: 380, y: 920, sx: -25, sy: 25, c: 1, d: 0.8 },
  { x: 1540, y: 920, sx: 25, sy: 25, c: 2, d: 1.1 },
];

export function BingoBallsScatter({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {/* small scattered balls */}
      {SMALLS.map((s, i) => (
        <SmallBingoBall
          key={i}
          cx={s.x}
          cy={s.y}
          r={32}
          color={SMALL_PALETTE[s.c]}
          style={{
            // @ts-expect-error css custom props
            "--sx": `${s.sx}px`, "--sy": `${s.sy}px`,
            transformOrigin: `${s.x}px ${s.y}px`,
            animation: "wink-scatter 3.2s ease-in-out infinite",
            animationDelay: `${s.d}s`,
          }}
        />
      ))}
      {/* main BINGO fixed */}
      {BINGO_LETTERS.map((_, i) => (
        <MainBingoBall
          key={i}
          index={i}
          style={{
            transformOrigin: "center",
            animation: "wink-glow-pulse 3.2s ease-in-out infinite",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </EffectSvg>
  );
}
