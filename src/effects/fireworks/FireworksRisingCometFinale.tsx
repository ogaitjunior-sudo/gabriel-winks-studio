import { EffectSvg } from "../_shared";
import {
  FIREWORK_ACCENTS,
  ExplosionRing,
  FireworkBurst,
  FireworkGlowGradient,
  FireworkStars,
  GlowFlash,
  RocketTrail,
  fireworkGlowId,
} from "./_fireworksShared";

const COMETS = [
  { x: 380, y: 880, tx: 580, ty: -460, delay: 0.1, color: FIREWORK_ACCENTS[1] },
  { x: 620, y: 900, tx: 340, ty: -500, delay: 0.26, color: FIREWORK_ACCENTS[0] },
  { x: 1300, y: 900, tx: -340, ty: -500, delay: 0.42, color: FIREWORK_ACCENTS[2] },
  { x: 1540, y: 880, tx: -580, ty: -460, delay: 0.58, color: FIREWORK_ACCENTS[3] },
];

export function FireworksRisingCometFinale({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwrcf", "cross");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[5]} outer={FIREWORK_ACCENTS[0]} />
      </defs>

      {COMETS.map((comet, i) => (
        <RocketTrail
          key={i}
          x={comet.x}
          y={comet.y}
          tx={comet.tx}
          ty={comet.ty}
          color={comet.color}
          delay={comet.delay}
          duration={4}
          headRadius={6}
          strokeWidth={3}
        />
      ))}

      <GlowFlash glowId={glow} cx={960} cy={420} r={160} opacity={0.84} animation="wink-glow-pulse 4s ease-in-out infinite" delay="1.18s" />
      <FireworkBurst cx={960} cy={420} radius={360} color={FIREWORK_ACCENTS[0]} tip={FIREWORK_ACCENTS[5]} delay={1.42} duration={4} rays={18} core={20} width={3.1} />
      <ExplosionRing cx={960} cy={420} radius={350} color={FIREWORK_ACCENTS[5]} delay={1.5} duration={4} strokeWidth={3.2} />
      <FireworkStars cx={960} cy={420} radius={430} delay={1.66} duration={4} count={10} color={FIREWORK_ACCENTS[2]} size={14} />
    </EffectSvg>
  );
}
