import { EffectSvg, GOLD, GOLD_LIGHT, starPath } from "../_shared";

const COMETS = [
  { x: 240, y: 760, tx: 220, ty: -300, size: 14, delay: 0 },
  { x: 520, y: 860, tx: 120, ty: -380, size: 18, delay: 0.35 },
  { x: 960, y: 900, tx: 0, ty: -440, size: 20, delay: 0.7 },
  { x: 1400, y: 860, tx: -120, ty: -380, size: 18, delay: 1.05 },
  { x: 1680, y: 760, tx: -220, ty: -300, size: 14, delay: 1.4 },
];

export function GoldStarsCometArc({ playing }: { playing: boolean }) {
  return (
    <EffectSvg playing={playing}>
      {COMETS.map((comet, i) => (
        <g key={i}>
          <g
            style={{
              // @ts-expect-error css custom props
              "--tx": `${comet.tx}px`,
              "--ty": `${comet.ty}px`,
              animation: "wink-comet 3.2s ease-out infinite",
              animationDelay: `${comet.delay}s`,
            }}
          >
            <line
              x1={comet.x}
              y1={comet.y}
              x2={comet.x - comet.tx * 0.22}
              y2={comet.y - comet.ty * 0.22}
              stroke={GOLD}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path d={starPath(comet.x, comet.y, comet.size)} fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="1" />
          </g>

          <g
            style={{
              transformOrigin: `${comet.x + comet.tx}px ${comet.y + comet.ty}px`,
              animation: "wink-twinkle 3.2s ease-in-out infinite",
              animationDelay: `${comet.delay + 0.9}s`,
            }}
          >
            <path
              d={starPath(comet.x + comet.tx, comet.y + comet.ty, comet.size + 8)}
              fill="hsl(50 100% 80%)"
              stroke={GOLD_LIGHT}
              strokeWidth="1.2"
            />
          </g>
        </g>
      ))}
    </EffectSvg>
  );
}
