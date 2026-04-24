const BASE_STYLE_ATTR = "data-base-style";
const CSS_TIME_RE = /(-?\d*\.?\d+)(ms|s)\b/g;
const CSS_TIME_VALUE_RE = /^\s*(-?\d*\.?\d+)\s*(ms|s)\s*$/i;

function formatTime(value: number, unit: "ms" | "s") {
  const precision = unit === "ms" ? 1 : 3;
  return `${Number(value.toFixed(precision))}${unit}`;
}

export function formatPlaybackSpeed(speed: number) {
  return `${Number(speed.toFixed(2))}x`;
}

export function parseCssTimeToMs(value: string) {
  const match = value.match(CSS_TIME_VALUE_RE);
  if (!match) return 0;

  const amount = Number.parseFloat(match[1]);
  if (!Number.isFinite(amount)) return 0;

  return match[2].toLowerCase() === "s" ? amount * 1000 : amount;
}

export function formatRuntime(duration: string, speed = 1) {
  const durationMs = parseCssTimeToMs(duration);
  if (!durationMs || speed <= 0) return duration;

  const runtimeSeconds = durationMs / speed / 1000;
  return `${Number(runtimeSeconds.toFixed(1))}s`;
}

export function scaleAnimationTimings(style: string, speed: number) {
  if (speed === 1) return style;

  return style.replace(CSS_TIME_RE, (_, rawValue: string, unit: "ms" | "s") => {
    const value = Number.parseFloat(rawValue);
    if (!Number.isFinite(value)) return `${rawValue}${unit}`;
    return formatTime(value / speed, unit);
  });
}

export function applyPlaybackSpeed(svg: SVGSVGElement | null, speed: number) {
  if (!svg) return;

  const elements = [svg, ...Array.from(svg.querySelectorAll<SVGElement>("[style]"))];

  for (const element of elements) {
    const currentStyle = element.getAttribute("style");
    if (!currentStyle) continue;

    const baseStyle = element.getAttribute(BASE_STYLE_ATTR) ?? currentStyle;
    element.setAttribute(BASE_STYLE_ATTR, baseStyle);
    element.setAttribute("style", scaleAnimationTimings(baseStyle, speed));
  }
}

export function stripPlaybackMetadata(svg: SVGSVGElement) {
  svg.removeAttribute(BASE_STYLE_ATTR);

  for (const element of svg.querySelectorAll<SVGElement>(`[${BASE_STYLE_ATTR}]`)) {
    element.removeAttribute(BASE_STYLE_ATTR);
  }
}
