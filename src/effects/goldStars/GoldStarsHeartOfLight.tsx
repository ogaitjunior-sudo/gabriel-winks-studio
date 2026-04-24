import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, glowCircle, glowId, goldGlowGradient, sparkleCross } from "./_goldShared";

const GATHER = [
  { x: 620, y: 300, tx: 340, ty: 240, size: 20, delay: 0 },
  { x: 780, y: 220, tx: 180, ty: 320, size: 16, delay: 0.12 },
  { x: 1140, y: 220, tx: -180, ty: 320, size: 16, delay: 0.24 },
  { x: 1300, y: 300, tx: -340, ty: 240, size: 20, delay: 0.36 },
  { x: 1440, y: 520, tx: -480, ty: 20, size: 18, delay: 0.48 },
  { x: 1320, y: 760, tx: -360, ty: -220, size: 16, delay: 0.6 },
  { x: 960, y: 860, tx: 0, ty: -320, size: 22, delay: 0.72 },
  { x: 600, y: 760, tx: 360, ty: -220, size: 16, delay: 0.84 },
  { x: 480, y: 520, tx: 480, ty: 20, size: 18, delay: 0.96 },
];

export function GoldStarsHeartOfLight({ playing }: { playing: boolean }) {
  const glow = glowId("gshl", "heart");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.16)}</defs>

      {GATHER.map((star, i) => (
        <g
          key={i}
          style={{
            // @ts-expect-error css custom props
            "--tx": `${star.tx}px`,
            "--ty": `${star.ty}px`,
            animation: "wink-comet 3.4s ease-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          <path d={starPath(star.x, star.y, star.size)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${GOLD_SAFE_AREA.centerX}px ${GOLD_SAFE_AREA.centerY}px`,
          animation: "wink-burst 3.4s ease-out infinite",
          animationDelay: "1.1s",
        }}
      >
        {glowCircle(glow, GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 240, 0.34)}
        {sparkleCross(GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 26, GOLD_LIGHT)}
      </g>

      {Array.from({ length: 8 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 8;
        const x = GOLD_SAFE_AREA.centerX + Math.cos(angle) * 180;
        const y = GOLD_SAFE_AREA.centerY + Math.sin(angle) * 120;

        return (
          <g
            key={`float-${i}`}
            style={{
              transformOrigin: `${x}px ${y}px`,
              animation: "wink-fade-loop 3.4s ease-in-out infinite",
              animationDelay: `${1.48 + i * 0.08}s`,
            }}
          >
            <path d={starPath(x, y, 18)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>
        );
      })}
    </EffectSvg>
  );
}
