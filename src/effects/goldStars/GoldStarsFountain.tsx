import { EffectSvg } from "../_shared";
import { GOLD_ACCENTS, dustDot, goldStar, glowCircle, glowId, goldGlowGradient } from "./_goldShared";

const JETS = Array.from({ length: 10 }, (_, i) => {
  const angle = -Math.PI / 2 + (i - 4.5) * 0.18;
  return {
    tx: Math.cos(angle) * (260 + (i % 2) * 40),
    ty: Math.sin(angle) * (300 + (i % 3) * 22),
    delay: i * 0.12,
    size: 14 + (i % 3) * 4,
  };
});

export function GoldStarsFountain({ playing }: { playing: boolean }) {
  const glow = glowId("gsf", "base");

  return (
    <EffectSvg playing={playing}>
      <defs>{goldGlowGradient(glow, 0.2)}</defs>

      {JETS.map((jet, i) => (
        <g
          key={i}
          style={{
            transformOrigin: "960px 720px",
            // @ts-expect-error css custom props
            "--tx": `${jet.tx}px`,
            "--ty": `${jet.ty}px`,
            animation: "wink-comet 2.4s ease-out infinite",
            animationDelay: `${jet.delay}s`,
          }}
        >
          {goldStar(960, 720, jet.size, GOLD_ACCENTS[i % GOLD_ACCENTS.length])}
        </g>
      ))}

      {glowCircle(glow, 960, 724, 140, 0.44)}
      <ellipse cx={960} cy={730} rx={110} ry={14} fill="hsl(43 94% 60%)" opacity="0.28" style={{ animation: "wink-glow-pulse 1.6s ease-in-out infinite" }} />
      {dustDot(960, 620, 4, 0.24)}
    </EffectSvg>
  );
}
