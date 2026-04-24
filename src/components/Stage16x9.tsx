import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StageBg = "checker" | "black" | "white";

interface Stage16x9Props {
  bg: StageBg;
  children: ReactNode;
  className?: string;
}

const bgClass: Record<StageBg, string> = {
  checker: "bg-checker",
  black: "bg-stage-black",
  white: "bg-stage-white",
};

export function Stage16x9({ bg, children, className }: Stage16x9Props) {
  return (
    <div className="relative w-full">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl shadow-stage ring-1 ring-border",
          bgClass[bg],
          className
        )}
        style={{ aspectRatio: "16 / 9" }}
      >
        {/* Effect canvas — uses full-bleed 1920x1080 viewBox */}
        <div className="absolute inset-0">{children}</div>
      </div>
      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl opacity-60 blur-3xl"
        style={{ background: "var(--gradient-stage-frame)" }} />
    </div>
  );
}
