import { EffectSvg } from "../_shared";
import { dustDot, goldStar, sparkleCross } from "./_goldShared";

const CROWN = [
  { x: 720, y: 470, size: 24, delay: 0.06 },
  { x: 840, y: 382, size: 30, delay: 0.18 },
  { x: 960, y: 320, size: 40, delay: 0.3 },
  { x: 1080, y: 382, size: 30, delay: 0.42 },
  { x: 1200, y: 470, size: 24, delay: 0.54 },
];

export function GoldStarsCrown({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      <path
        d="M 700 500 Q 960 620 1220 500"
        stroke="hsl(43 94% 60%)"
        strokeWidth="2.6"
        fill="none"
        opacity="0.18"
        style={{ animation: "wink-fade-loop 2.8s ease-in-out infinite" }}
      />

      {CROWN.map((star, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${star.x}px ${star.y}px`,
            animation: "wink-pop 2.8s cubic-bezier(.22,1,.36,1) infinite",
            animationDelay: `${star.delay}s`,
          }}
        >
          {goldStar(star.x, star.y, star.size)}
        </g>
      ))}

      <g style={{ animation: "wink-sparkle 2.8s ease-in-out infinite", animationDelay: "1.22s" }}>
        {sparkleCross(960, 220, 18)}
      </g>

      {dustDot(840, 560, 4, 0.22)}
      {dustDot(1080, 560, 4, 0.22)}
    </EffectSvg>
  );
}
