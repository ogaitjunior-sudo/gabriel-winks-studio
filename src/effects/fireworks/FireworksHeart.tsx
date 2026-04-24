import { EffectSvg, starPath } from "../_shared";
import {
  FIREWORK_ACCENTS,
  FireworkGlowGradient,
  FireworkStars,
  GlowFlash,
  fireworkGlowId,
} from "./_fireworksShared";

const HEART_PTS = Array.from({ length: 36 }, (_, i) => {
  const t = (i / 36) * Math.PI * 2;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: 960 + x * 22, y: 545 + y * 20 };
});

export function FireworksHeart({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwh", "heart");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner="hsl(345 90% 68%)" outer="hsl(282 82% 70%)" />
      </defs>

      <GlowFlash glowId={glow} cx={960} cy={545} r={250} opacity={0.74} animation="wink-glow-pulse 2.8s ease-in-out infinite" delay="0.16s" />

      <g style={{ transformOrigin: "960px 545px", animation: "wink-burst 2.8s ease-out infinite" }}>
        {HEART_PTS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={7 + (i % 3)} fill={i % 2 === 0 ? "hsl(345 90% 65%)" : "hsl(282 82% 70%)"} />
        ))}
        {HEART_PTS.map((p, i) => (
          <circle key={`s-${i}`} cx={p.x} cy={p.y} r={2.4} fill="white" opacity="0.9" />
        ))}
      </g>

      {HEART_PTS.filter((_, i) => i % 4 === 0).map((p, i) => (
        <path
          key={`star-${i}`}
          d={starPath(p.x, p.y, 12 + (i % 2) * 3)}
          fill={FIREWORK_ACCENTS[(i + 3) % FIREWORK_ACCENTS.length]}
          opacity="0.9"
          style={{
            transformOrigin: `${p.x}px ${p.y}px`,
            animation: "wink-twinkle 2.8s ease-in-out infinite",
            animationDelay: `${0.08 + i * 0.08}s`,
          }}
        />
      ))}

      <FireworkStars cx={960} cy={545} radius={310} delay={0.72} duration={2.8} count={8} color="hsl(48 100% 84%)" size={12} />
      <circle cx={960} cy={545} r={18} fill="hsl(345 90% 70%)" style={{ animation: "wink-glow-pulse 1.4s ease-in-out infinite" }} />
    </EffectSvg>
  );
}
