import { EffectSvg } from "../_shared";
import {
  FIREWORK_ACCENTS,
  FireworkBurst,
  FireworkGlowGradient,
  FireworkStars,
  GlowFlash,
  RocketTrail,
  fireworkGlowId,
} from "./_fireworksShared";

const COMETS = [
  { x: 470, y: 860, tx: 240, ty: -430, color: FIREWORK_ACCENTS[0], delay: 0.0, apex: [710, 430] },
  { x: 1450, y: 850, tx: -260, ty: -430, color: FIREWORK_ACCENTS[1], delay: 0.24, apex: [1190, 420] },
  { x: 740, y: 900, tx: 150, ty: -510, color: FIREWORK_ACCENTS[3], delay: 0.48, apex: [890, 390] },
  { x: 1180, y: 900, tx: -150, ty: -510, color: FIREWORK_ACCENTS[2], delay: 0.72, apex: [1030, 390] },
  { x: 960, y: 920, tx: 0, ty: -590, color: FIREWORK_ACCENTS[5], delay: 0.96, apex: [960, 330] },
  { x: 590, y: 820, tx: 360, ty: -300, color: FIREWORK_ACCENTS[4], delay: 1.2, apex: [950, 520] },
  { x: 1330, y: 820, tx: -360, ty: -300, color: FIREWORK_ACCENTS[3], delay: 1.42, apex: [970, 520] },
] as const;

export function FireworksComets({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwcomets", "center");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[5]} outer={FIREWORK_ACCENTS[2]} />
      </defs>

      <GlowFlash glowId={glow} cx={960} cy={500} r={250} opacity={0.54} animation="wink-glow-pulse 3s ease-in-out infinite" delay="1.2s" />

      {COMETS.map((comet, i) => (
        <g key={i}>
          <RocketTrail
            x={comet.x}
            y={comet.y}
            tx={comet.tx}
            ty={comet.ty}
            color={comet.color}
            delay={comet.delay}
            duration={3}
            headRadius={7 + (i % 2)}
            strokeWidth={3.2}
            opacity={0.82}
          />
          <FireworkBurst
            cx={comet.apex[0]}
            cy={comet.apex[1]}
            radius={86 + (i % 3) * 26}
            color={comet.color}
            tip={FIREWORK_ACCENTS[(i + 5) % FIREWORK_ACCENTS.length]}
            delay={comet.delay + 0.86}
            duration={3}
            rays={10 + (i % 2) * 2}
            core={8}
            width={2}
          />
        </g>
      ))}

      <FireworkStars cx={960} cy={500} radius={360} delay={1.18} duration={3} count={10} color={FIREWORK_ACCENTS[5]} size={12} />
    </EffectSvg>
  );
}
