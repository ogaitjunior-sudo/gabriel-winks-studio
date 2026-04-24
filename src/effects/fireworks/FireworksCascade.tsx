import { EffectSvg } from "../_shared";
import {
  FIREWORK_ACCENTS,
  FireworkBurst,
  FireworkGlowGradient,
  FireworkStars,
  GlowFlash,
  fireworkGlowId,
} from "./_fireworksShared";

const STREAMS = Array.from({ length: 22 }, (_, i) => ({
  x: 340 + i * 60,
  y: 120 + (i % 4) * 26,
  length: 210 + (i % 5) * 34,
  delay: (i * 0.18) % 2.4,
  hue: FIREWORK_ACCENTS[i % FIREWORK_ACCENTS.length],
  width: 2.4 + (i % 3) * 0.9,
}));

export function FireworksCascade({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwc", "curtain");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[0]} outer={FIREWORK_ACCENTS[2]} />
      </defs>

      <GlowFlash glowId={glow} cx={960} cy={560} r={270} opacity={0.58} animation="wink-glow-pulse 2.6s ease-in-out infinite" delay="0.72s" />

      {STREAMS.map((s, i) => {
        const drift = ((i % 3) - 1) * 28;

        return (
          <g
            key={i}
            style={{
              transformOrigin: `${s.x}px ${s.y}px`,
              animation: "wink-spark-fall 2.6s ease-in infinite",
              animationDelay: `${s.delay}s`,
            }}
          >
            <line x1={s.x} y1={s.y} x2={s.x + drift} y2={s.y + s.length} stroke={s.hue} strokeWidth={s.width} strokeLinecap="round" opacity="0.88" />
            <circle cx={s.x + drift} cy={s.y + s.length} r={5 + (i % 3)} fill={s.hue} />
            <circle cx={s.x} cy={s.y + s.length * 0.52} r={3.2} fill="white" opacity="0.76" />
          </g>
        );
      })}

      <FireworkBurst cx={960} cy={650} radius={260} color={FIREWORK_ACCENTS[0]} tip={FIREWORK_ACCENTS[5]} delay={0.95} duration={2.6} rays={16} core={16} width={2.4} />
      <FireworkStars cx={960} cy={650} radius={320} delay={1.1} duration={2.6} count={10} color={FIREWORK_ACCENTS[5]} size={12} />
    </EffectSvg>
  );
}
