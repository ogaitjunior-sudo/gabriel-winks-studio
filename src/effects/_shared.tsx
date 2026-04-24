import { ReactNode, SVGProps } from "react";

/** Standard SVG wrapper for every effect — full bleed, transparent, 1920x1080 viewBox */
export function EffectSvg({
  children,
  playing,
  ...rest
}: { children: ReactNode; playing: boolean } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid meet"
      className={`h-full w-full ${playing ? "" : "effect-paused"}`}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** 5-pointed star path centered at (cx, cy) with outer radius r */
export function starPath(cx: number, cy: number, r: number, inner = r * 0.4) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : inner;
    pts.push(`${cx + Math.cos(ang) * rad},${cy + Math.sin(ang) * rad}`);
  }
  return `M${pts.join(" L")} Z`;
}

export const GOLD = "hsl(43 94% 60%)";
export const GOLD_DEEP = "hsl(36 78% 40%)";
export const GOLD_LIGHT = "hsl(48 100% 84%)";
