import { EffectSvg } from "../_shared";
import { GOLD_ACCENTS, glowCircle, glowId, goldGlowGradient, goldStar } from "./_goldShared";

const SPARKLES = Array.from({ length: 8 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 8;
  return {
    x: 960 + Math.cos(angle) * 270,
    y: 540 + Math.sin(angle) * 220,
    delay: (i * 0.16) % 1.8,
  };
});

export function GoldStarsBigStar({ playing }: { playing: boolean }) {
  const glow = glowId("gsbig", "hero");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.18)}</defs>

      <g style={{ transformOrigin: "960px 540px", animation: "wink-pop 2.8s ease-in-out infinite" }}>
        {glowCircle(glow, 960, 540, 320, 0.38)}
        {goldStar(960, 540, 210, GOLD_ACCENTS[0], undefined, 2.2)}
      </g>

      {SPARKLES.map((sparkle, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${sparkle.x}px ${sparkle.y}px`,
            animation: "wink-sparkle 1.8s ease-in-out infinite",
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          {goldStar(sparkle.x, sparkle.y, 14 + (i % 2) * 4, GOLD_ACCENTS[(i + 1) % GOLD_ACCENTS.length], undefined, 1)}
        </g>
      ))}
    </EffectSvg>
  );
}
