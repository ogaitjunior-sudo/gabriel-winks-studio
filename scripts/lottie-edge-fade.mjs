const EASE_IN = { x: [0.667], y: [1] };
const EASE_OUT = { x: [0.333], y: [0] };

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const EDGE_FADE_RATIO = 0.1;
const EDGE_FULL_DISSOLVE_RATIO = 0.04;
const SAMPLE_STEP_FRAMES = 2;

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function smootherStep(value) {
  const x = clamp(value);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function isKeyframed(value) {
  return Array.isArray(value) && value.some((entry) => entry && typeof entry === "object" && "t" in entry);
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

function frameValue(frame, fallback) {
  if (!frame) {
    return fallback;
  }

  if (frame.s != null) {
    return frame.s;
  }

  if (frame.e != null) {
    return frame.e;
  }

  return fallback;
}

function interpolateValue(startValue, endValue, progress) {
  const start = toArray(startValue);
  const end = toArray(endValue);
  const length = Math.max(start.length, end.length);

  if (length <= 1) {
    return (Number(start[0]) || 0) + ((Number(end[0]) || 0) - (Number(start[0]) || 0)) * progress;
  }

  return Array.from({ length }, (_, index) => {
    const startPart = Number(start[index] ?? start.at(-1) ?? 0) || 0;
    const endPart = Number(end[index] ?? end.at(-1) ?? startPart) || 0;
    return startPart + (endPart - startPart) * progress;
  });
}

function evaluateKeyframes(keyframes, time, fallback) {
  if (!isKeyframed(keyframes)) {
    return keyframes ?? fallback;
  }

  const sorted = [...keyframes].sort((left, right) => left.t - right.t);
  const first = sorted[0];

  if (time <= first.t) {
    return frameValue(first, fallback);
  }

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const current = sorted[index];
    const next = sorted[index + 1];

    if (time < next.t) {
      const startValue = frameValue(current, fallback);
      if (current.h) {
        return startValue;
      }

      const endValue = current.e ?? frameValue(next, startValue);
      const duration = Math.max(next.t - current.t, 1);
      const progress = smootherStep((time - current.t) / duration);
      return interpolateValue(startValue, endValue, progress);
    }
  }

  return frameValue(sorted.at(-1), fallback);
}

function scalarAt(opacity, time) {
  const value = evaluateKeyframes(opacity, time, 100);
  return Number(toArray(value)[0] ?? 100) || 0;
}

function pointAt(position, time, width, height) {
  const value = evaluateKeyframes(position, time, [width / 2, height / 2, 0]);
  const point = toArray(value);
  return [Number(point[0] ?? width / 2) || 0, Number(point[1] ?? height / 2) || 0];
}

function axisEdgeAlpha(position, size) {
  const fadeEnd = size * EDGE_FADE_RATIO;
  const fullDissolve = size * EDGE_FULL_DISSOLVE_RATIO;
  const distance = Math.min(position, size - position);

  if (distance <= fullDissolve) {
    return 0;
  }

  if (distance >= fadeEnd) {
    return 1;
  }

  return smootherStep((distance - fullDissolve) / Math.max(fadeEnd - fullDissolve, 1));
}

function edgeAlphaAt(position, width, height) {
  const [x, y] = position;
  return axisEdgeAlpha(x, width) * axisEdgeAlpha(y, height);
}

function collectKeyframeTimes(value, times) {
  if (!isKeyframed(value)) {
    return;
  }

  for (const keyframe of value) {
    if (Number.isFinite(keyframe.t)) {
      times.add(Math.max(0, Math.round(keyframe.t)));
    }
  }
}

function roundOpacity(value) {
  return Math.round(clamp(value, 0, 100) * 100) / 100;
}

function compactSamples(samples) {
  return samples.filter((sample, index) => {
    if (index === 0 || index === samples.length - 1) {
      return true;
    }

    const previous = samples[index - 1];
    const next = samples[index + 1];
    return Math.abs(sample.value - previous.value) > 0.02 || Math.abs(sample.value - next.value) > 0.02;
  });
}

function toOpacityKeyframes(samples) {
  return samples.map((sample, index) => {
    const next = samples[index + 1];

    if (!next) {
      return { h: 1, s: [sample.value], t: sample.t };
    }

    return {
      e: [next.value],
      i: EASE_IN,
      o: EASE_OUT,
      s: [sample.value],
      t: sample.t,
    };
  });
}

export function withEdgeFadeOpacity({
  opacity = 100,
  position = [DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2, 0],
  totalFrames,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}) {
  const opacityAnimated = isKeyframed(opacity);
  const positionAnimated = isKeyframed(position);
  const maxFrame = Math.max(1, Math.round(totalFrames ?? 1));

  if (!positionAnimated) {
    const alpha = edgeAlphaAt(pointAt(position, 0, width, height), width, height);
    if (alpha >= 0.999) {
      return opacity;
    }

    if (!opacityAnimated) {
      return roundOpacity(scalarAt(opacity, 0) * alpha);
    }
  }

  const probeTimes = new Set([0, maxFrame]);
  collectKeyframeTimes(position, probeTimes);
  for (let frame = 0; frame <= maxFrame; frame += SAMPLE_STEP_FRAMES) {
    probeTimes.add(frame);
  }

  const edgeValues = [...probeTimes].map((time) => edgeAlphaAt(pointAt(position, time, width, height), width, height));
  if (edgeValues.every((value) => value >= 0.999)) {
    return opacity;
  }

  collectKeyframeTimes(opacity, probeTimes);
  const samples = [...probeTimes]
    .filter((time) => time >= 0 && time <= maxFrame)
    .sort((left, right) => left - right)
    .map((time) => ({
      t: time,
      value: roundOpacity(scalarAt(opacity, time) * edgeAlphaAt(pointAt(position, time, width, height), width, height)),
    }));

  const compacted = compactSamples(samples);
  if (!opacityAnimated && compacted.every((sample) => Math.abs(sample.value - compacted[0].value) <= 0.02)) {
    return compacted[0].value;
  }

  return toOpacityKeyframes(compacted);
}
