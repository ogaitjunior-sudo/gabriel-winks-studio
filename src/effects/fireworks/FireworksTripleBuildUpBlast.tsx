import { EffectSvg } from "../_shared";
import {
  FIREWORK_ACCENTS,
  ExplosionRing,
  FireworkBurst,
  FireworkGlowGradient,
  GlowFlash,
  RocketTrail,
  fireworkGlowId,
} from "./_fireworksShared";

const ROCKETS = [
  { x: 500, tx: 120, ty: -520, color: FIREWORK_ACCENTS[1], riseDelay: 0.08, flashDelay: "0.9s", burstDelay: 1.08, radius: 220 },
  { x: 1420, tx: -120, ty: -520, color: FIREWORK_ACCENTS[3], riseDelay: 0.42, flashDelay: "1.28s", burstDelay: 1.46, radius: 220 },
  { x: 960, tx: 0, ty: -620, color: FIREWORK_ACCENTS[0], riseDelay: 0.78, flashDelay: "1.72s", burstDelay: 1.9, radius: 340 },
];

export function FireworksTripleBuildUpBlast({ playing }: { playing: boolean }) {
  const leftGlow = fireworkGlowId("fwtbb", "left");
  const rightGlow = fireworkGlowId("fwtbb", "right");
  const centerGlow = fireworkGlowId("fwtbb", "center");

  return (
    <EffectSvg playing={playing}>
      <defs>
        <FireworkGlowGradient id={leftGlow} inner={FIREWORK_ACCENTS[1]} />
        <FireworkGlowGradient id={rightGlow} inner={FIREWORK_ACCENTS[3]} />
        <FireworkGlowGradient id={centerGlow} inner={FIREWORK_ACCENTS[0]} outer={FIREWORK_ACCENTS[5]} />
      </defs>

      {ROCKETS.map((rocket, i) => (
        <RocketTrail
          key={i}
          x={rocket.x}
          y={900}
          tx={rocket.tx}
          ty={rocket.ty}
          color={rocket.color}
          delay={rocket.riseDelay}
          duration={4}
          headRadius={6}
          strokeWidth={3}
        />
      ))}

      <GlowFlash glowId={leftGlow} cx={620} cy={380} r={90} opacity={0.66} animation="wink-glow-pulse 4s ease-in-out infinite" delay="0.9s" />
      <GlowFlash glowId={rightGlow} cx={1300} cy={380} r={90} opacity={0.66} animation="wink-glow-pulse 4s ease-in-out infinite" delay="1.28s" />
      <GlowFlash glowId={centerGlow} cx={960} cy={280} r={170} opacity={0.86} animation="wink-glow-pulse 4s ease-in-out infinite" delay="1.72s" />

      <FireworkBurst cx={620} cy={380} radius={220} color={FIREWORK_ACCENTS[1]} tip={FIREWORK_ACCENTS[5]} delay={1.08} duration={4} rays={12} core={12} />
      <FireworkBurst cx={1300} cy={380} radius={220} color={FIREWORK_ACCENTS[3]} tip={FIREWORK_ACCENTS[5]} delay={1.46} duration={4} rays={12} core={12} />
      <FireworkBurst cx={960} cy={280} radius={340} color={FIREWORK_ACCENTS[0]} tip={FIREWORK_ACCENTS[5]} delay={1.9} duration={4} rays={18} core={18} width={3.1} />
      <ExplosionRing cx={960} cy={280} radius={360} color={FIREWORK_ACCENTS[5]} delay={1.98} duration={4} strokeWidth={3.6} />
    </EffectSvg>
  );
}
