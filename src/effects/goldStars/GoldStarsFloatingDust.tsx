import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA } from "./_goldShared";

const DUST = Array.from({ length: 18 }, (_, i) => ({
  x: GOLD_SAFE_AREA.left + 60 + ((i * 83) % (GOLD_SAFE_AREA.right - GOLD_SAFE_AREA.left - 120)),
  y: 900 + (i % 3) * 40,
  tx: ((i % 5) - 2) * 36,
  ty: -260 - (i % 4) * 40,
  size: 6 + (i % 3) * 3,
  delay: (i * 0.12) % 2.6,
}));

const PULSES = [
  { x: 700, y: 440, r: 24, delay: 0.9 },
  { x: 960, y: 320, r: 36, delay: 1.3 },
  { x: 1220, y: 450, r: 24, delay: 1.7 },
];

export function GoldStarsFloatingDust({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {DUST.map((star, i) => (
        <g
          key={i}
          style={{
            // @ts-expect-error css custom props
            "--tx": `${star.tx}px`,
            "--ty": `${star.ty}px`,
            animation: "wink-comet 3.2s ease-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, star.y, star.size)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="0.8" />
        </g>
      ))}

      {PULSES.map((star, i) => (
        <g
          key={`pulse-${i}`}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-twinkle 3.2s ease-in-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, star.y, star.r)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1.4" />
        </g>
      ))}
    </EffectSvg>
  );
}
