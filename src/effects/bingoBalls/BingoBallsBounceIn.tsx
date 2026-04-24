import { EffectSvg, GOLD_LIGHT } from "../_shared";
import { BINGO_LETTERS, MainBingoBall, SAFE_AREA, SMALL_PALETTE, SmallBingoBall } from "./_bingoShared";

const POSITIONS = [
  { x: 440, y: 630 },
  { x: 700, y: 505 },
  { x: 960, y: 615 },
  { x: 1220, y: 505 },
  { x: 1480, y: 630 },
];

const CONFETTI = Array.from({ length: 12 }, (_, i) => ({
  x: SAFE_AREA.left + 80 + i * 105,
  y: 230 + (i % 3) * 70,
  delay: 0.1 + i * 0.08,
}));

export function BingoBallsBounceIn({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path d="M 380 690 C 600 470, 790 720, 960 590 C 1130 460, 1320 720, 1540 690" fill="none" stroke={GOLD_LIGHT} strokeWidth="3" strokeLinecap="round" opacity="0.18" />

      {CONFETTI.map((dot, i) => (
        <SmallBingoBall
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={18 + (i % 3) * 3}
          color={SMALL_PALETTE[i % SMALL_PALETTE.length]}
          style={{
            transformOrigin: `${dot.x}px ${dot.y}px`,
            animation: "wink-twinkle 2.8s ease-in-out infinite",
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}

      {BINGO_LETTERS.map((_, i) => {
        const pos = POSITIONS[i] ?? POSITIONS[0];
        return (
          <g key={i}>
            <circle
              cx={pos.x}
              cy={pos.y + 124}
              r={88}
              fill="none"
              stroke={SMALL_PALETTE[i].bg}
              strokeWidth="4"
              opacity="0.32"
              style={{
                transformOrigin: `${pos.x}px ${pos.y + 124}px`,
                animation: "wink-ring-expand 2.8s ease-out infinite",
                animationDelay: `${0.3 + i * 0.14}s`,
              }}
            />
            <MainBingoBall
              index={i}
              cx={pos.x}
              cy={pos.y}
              style={{
                transformOrigin: `${pos.x}px ${pos.y}px`,
                animation: "wink-bounce-in 2.8s cubic-bezier(.34,1.56,.64,1) infinite",
                animationDelay: `${i * 0.14}s`,
              }}
            />
          </g>
        );
      })}
    </EffectSvg>
  );
}
