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

export function FireworksRingShockwave({ playing }: { playing: boolean }) {
  const glow = fireworkGlowId("fwrs", "center");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={glow} inner={FIREWORK_ACCENTS[5]} outer={FIREWORK_ACCENTS[2]} />
      </defs>

      <RocketTrail x={960} y={900} tx={0} ty={-500} color={FIREWORK_ACCENTS[0]} delay={0.18} duration={3.9} headRadius={7} strokeWidth={3.2} />

      <GlowFlash glowId={glow} cx={960} cy={400} r={90} opacity={0.74} animation="wink-glow-pulse 3.9s ease-in-out infinite" delay="1.0s" />
      <ExplosionRing cx={960} cy={400} radius={220} color={FIREWORK_ACCENTS[5]} delay={1.08} duration={3.9} strokeWidth={3} />

      <GlowFlash glowId={glow} cx={960} cy={400} r={170} opacity={0.88} animation="wink-glow-pulse 3.9s ease-in-out infinite" delay="1.34s" />
      <ExplosionRing cx={960} cy={400} radius={380} color={FIREWORK_ACCENTS[0]} delay={1.42} duration={3.9} strokeWidth={4.2} />
      <FireworkBurst cx={960} cy={400} radius={280} color={FIREWORK_ACCENTS[2]} tip={FIREWORK_ACCENTS[5]} delay={1.46} duration={3.9} rays={16} core={16} />
      <FireworkStars cx={960} cy={400} radius={420} delay={1.58} duration={3.9} count={10} color={FIREWORK_ACCENTS[5]} size={14} />
    </EffectSvg>
  );
}
