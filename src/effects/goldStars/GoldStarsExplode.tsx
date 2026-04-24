import { EffectSvg } from "../_shared";
import { GOLD_ACCENTS, glowCircle, glowId, goldGlowGradient, goldStar, sparkleCross } from "./_goldShared";

const RAYS = Array.from({ length: 10 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 10;
  return {
    tx: Math.cos(angle) * (220 + (i % 2) * 48),
    ty: Math.sin(angle) * (220 + (i % 3) * 24),
    delay: i * 0.05,
    size: 16 + (i % 3) * 4,
  };
});

export function GoldStarsExplode({ playing }: { playing: boolean }) {
  const glow = glowId("gse", "core");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.26)}</defs>

      <g style={{ animation: "wink-glow-pulse 2.6s ease-in-out infinite" }}>
        {glowCircle(glow, 960, 540, 170, 0.72)}
      </g>

      {RAYS.map((ray, i) => (
        <g
          key={i}
          style={{
            transformOrigin: "960px 540px",
            // @ts-expect-error css custom props
            "--tx": `${ray.tx}px`,
            "--ty": `${ray.ty}px`,
            animation: "wink-comet 2.6s ease-out infinite",
            animationDelay: `${ray.delay}s`,
          }}
        >
          {goldStar(960, 540, ray.size, GOLD_ACCENTS[i % GOLD_ACCENTS.length])}
        </g>
      ))}

      <g style={{ animation: "wink-sparkle 2.6s ease-in-out infinite", animationDelay: "1.06s" }}>
        {sparkleCross(960, 540, 22)}
      </g>
    </EffectSvg>
  );
}
