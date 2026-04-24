import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";
import { GOLD_ACCENTS, GOLD_SAFE_AREA, glowCircle, glowId, goldGlowGradient, sparkleCross } from "./_goldShared";

const SIDES = [
  { x: 300, y: 330, tx: 500, ty: 170, size: 22, delay: 0.02 },
  { x: 310, y: 520, tx: 520, ty: 24, size: 18, delay: 0.14 },
  { x: 300, y: 720, tx: 560, ty: -160, size: 20, delay: 0.26 },
  { x: 1620, y: 330, tx: -500, ty: 170, size: 22, delay: 0.38 },
  { x: 1610, y: 520, tx: -520, ty: 24, size: 18, delay: 0.5 },
  { x: 1620, y: 720, tx: -560, ty: -160, size: 20, delay: 0.62 },
] as const;

const CENTER = Array.from({ length: 10 }, (_, i) => ({
  angle: (Math.PI * 2 * i) / 10,
  delay: 0.78 + i * 0.045,
}));

export function GoldStarsMirrorBurst({ playing }: { playing: boolean }) {
  const glow = glowId("gsmb", "mirror");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.24)}</defs>

      {glowCircle(glow, GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 250, 0.42)}
      <line x1="360" y1="540" x2="1560" y2="540" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" opacity="0.18" />
      <ellipse cx={GOLD_SAFE_AREA.centerX} cy={GOLD_SAFE_AREA.centerY} rx="320" ry="120" fill="none" stroke={GOLD_LIGHT} strokeWidth="1.2" opacity="0.14" />

      {SIDES.map((star, i) => (
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
          <path d={starPath(star.x, star.y, star.size)} fill={GOLD_ACCENTS[i % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="1" />
        </g>
      ))}

      <g
        style={{
          transformOrigin: `${GOLD_SAFE_AREA.centerX}px ${GOLD_SAFE_AREA.centerY}px`,
          animation: "wink-burst 3.2s ease-out infinite",
          animationDelay: "0.86s",
        }}
      >
        {sparkleCross(GOLD_SAFE_AREA.centerX, GOLD_SAFE_AREA.centerY, 46, GOLD_LIGHT)}
        {CENTER.map((spark, i) => {
          const x = GOLD_SAFE_AREA.centerX + Math.cos(spark.angle) * 210;
          const y = GOLD_SAFE_AREA.centerY + Math.sin(spark.angle) * 100;
          return <path key={i} d={starPath(x, y, 12 + (i % 2) * 4)} fill={GOLD_ACCENTS[(i + 2) % GOLD_ACCENTS.length]} stroke={GOLD_LIGHT} strokeWidth="0.8" />;
        })}
      </g>
    </EffectSvg>
  );
}
