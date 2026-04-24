interface SafeAreaOverlayProps {
  visible: boolean;
}

/** Safe area centered ~80% width / 80% height of stage */
export function SafeAreaOverlay({ visible }: SafeAreaOverlayProps) {
  if (!visible) return null;
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="safe-dash" patternUnits="userSpaceOnUse" width="14" height="14">
            <path d="M0 7H14" stroke="hsl(var(--safe-area))" strokeWidth="1.2" />
          </pattern>
        </defs>
        {/* Center markers */}
        <line x1="960" y1="0" x2="960" y2="1080" stroke="hsl(var(--safe-area) / 0.25)" strokeWidth="1" strokeDasharray="6 8" />
        <line x1="0" y1="540" x2="1920" y2="540" stroke="hsl(var(--safe-area) / 0.25)" strokeWidth="1" strokeDasharray="6 8" />
        {/* Safe area rectangle 80% */}
        <rect
          x="192" y="108" width="1536" height="864"
          fill="none"
          stroke="hsl(var(--safe-area) / 0.7)"
          strokeWidth="2.5"
          strokeDasharray="14 10"
          rx="12"
        />
        {/* Title-safe (60%) */}
        <rect
          x="384" y="216" width="1152" height="648"
          fill="none"
          stroke="hsl(var(--safe-area) / 0.35)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          rx="8"
        />
      </svg>
      <div className="absolute left-3 top-3 rounded-md bg-background/70 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[hsl(var(--safe-area))] backdrop-blur">
        Safe Area
      </div>
    </div>
  );
}
