import { EffectSvg } from "../_shared";
import { GOLD_ACCENTS, glowCircle, glowId, goldGlowGradient, goldStar, sparkleCross } from "./_goldShared";

const SATELLITES = Array.from({ length: 8 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 8;
  return {
    x: 960 + Math.cos(angle) * 260,
    y: 540 + Math.sin(angle) * 180,
    delay: (i % 4) * 0.06,
    size: 18 + (i % 2) * 6,
  };
});

export function GoldStarsBurst({ playing }: { playing: boolean }) {
  const glow = glowId("gsb", "core");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.18)}</defs>

      <g style={{ transformOrigin: "960px 540px", animation: "wink-burst 2.6s ease-out infinite" }}>
        {glowCircle(glow, 960, 540, 220, 0.34)}
      </g>

      <g style={{ transformOrigin: "960px 540px", animation: "wink-glow-pulse 2.6s ease-in-out infinite" }}>
        {goldStar(960, 540, 64, GOLD_ACCENTS[0], undefined, 1.8)}
      </g>

      {SATELLITES.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-burst 2.6s ease-out infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          {goldStar(star.x, star.y, star.size, GOLD_ACCENTS[(i + 1) % GOLD_ACCENTS.length])}
        </g>
      ))}

      <g style={{ transformOrigin: "960px 540px", animation: "wink-sparkle 2.6s ease-in-out infinite", animationDelay: "1.02s" }}>
        {sparkleCross(960, 540, 24)}
      </g>
    </EffectSvg>
  );
}
