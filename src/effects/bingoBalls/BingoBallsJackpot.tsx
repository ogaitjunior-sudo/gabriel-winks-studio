import { EffectSvg, starPath, GOLD, GOLD_LIGHT } from "../_shared";
import { MainBingoBall, BINGO_LETTERS } from "./_bingoShared";

const SPARKS = Array.from({ length: 14 }, (_, i) => {
  const ang = (i / 14) * Math.PI * 2;
  return { x: 960 + Math.cos(ang) * 520, y: 540 + Math.sin(ang) * 280, delay: (i * 0.13) % 1.6 };
});

export function BingoBallsJackpot({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {/* Glow behind */}
      <ellipse cx={960} cy={540} rx={780} ry={220} fill={GOLD} opacity="0.18" style={{ animation: "wink-glow-pulse 2.4s ease-in-out infinite" }} />
      {SPARKS.map((s, i) => (
        <g key={i} style={{ transformOrigin: `${s.x}px ${s.y}px`, animation: "wink-sparkle 2s ease-in-out infinite", animationDelay: `${s.delay}s` }}>
          <path d={starPath(s.x, s.y, 18)} fill={GOLD_LIGHT} />
        </g>
      ))}
      {BINGO_LETTERS.map((_, i) => (
        <g key={i} style={{ transformOrigin: "center", animation: "wink-bounce-loop 1.8s ease-in-out infinite", animationDelay: `${i * 0.12}s` }}>
          <MainBingoBall index={i} />
        </g>
      ))}
    </EffectSvg>
  );
}
