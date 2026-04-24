import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, glowCircle, glowId, goldGlowGradient } from "./_goldShared";

const PETALS = Array.from({ length: 10 }, (_, i) => ({
  angle: (Math.PI * 2 * i) / 10,
  rx: 160 + (i % 2) * 44,
  ry: 110 + (i % 3) * 22,
  size: 18 + (i % 3) * 5,
}));

export function GoldStarsExplosionBloom({ playing }: { playing: boolean }) {
  const glow = glowId("gseb", "bloom");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.14)}</defs>

      <g
        style={{
          transformOrigin: `${GOLD_SAFE_AREA.centerX}px ${GOLD_SAFE_AREA.centerY}px`,
          animation: "wink-burst 3.1s ease-out infinite",
        }}
      >
        {glowCircle(glow, GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 250, 0.3)}
        {PETALS.map((petal, i) => {
          const x = GOLD_SAFE_AREA.centerX + Math.cos(petal.angle) * petal.rx;
          const y = GOLD_SAFE_AREA.centerY + Math.sin(petal.angle) * petal.ry;

          return (
            <g key={i}>
              <line
                x1={GOLD_SAFE_AREA.centerX}
                y1={GOLD_SAFE_AREA.centerY}
                x2={x}
                y2={y}
                stroke={GOLD_ACCENTS[i % GOLD_ACCENTS.length]}
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.84"
              />
              <path d={starPath(x, y, petal.size)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1.2" />
            </g>
          );
        })}
      </g>
    </EffectSvg>
  );
}
