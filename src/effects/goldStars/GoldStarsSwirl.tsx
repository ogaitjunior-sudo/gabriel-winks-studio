import { EffectSvg } from "../_shared";
import { GOLD_ACCENTS, glowCircle, glowId, goldGlowGradient, goldStar } from "./_goldShared";

const ITEMS = Array.from({ length: 10 }, (_, i) => ({
  angle: (360 / 10) * i,
  delay: (i * 0.14) % 2.2,
  size: 14 + (i % 3) * 4,
}));

export function GoldStarsSwirl({ playing }: { playing: boolean }) {
  const glow = glowId("gss", "center");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.24)}</defs>

      {ITEMS.map((item, i) => (
        <g
          key={i}
          style={{
            transformOrigin: "960px 540px",
            transform: `rotate(${item.angle}deg)`,
          }}
        >
          <g
            style={{
              transformOrigin: "960px 540px",
              animation: "wink-swirl 3.2s ease-in-out infinite",
              animationDelay: `${item.delay}s`,
            }}
          >
            {goldStar(960, 540, item.size, GOLD_ACCENTS[i % GOLD_ACCENTS.length])}
          </g>
        </g>
      ))}

      <g style={{ transformOrigin: "960px 540px", animation: "wink-glow-pulse 3.2s ease-in-out infinite" }}>
        {glowCircle(glow, 960, 540, 180, 0.56)}
        {goldStar(960, 540, 54, GOLD_ACCENTS[0], undefined, 1.8)}
      </g>
    </EffectSvg>
  );
}
