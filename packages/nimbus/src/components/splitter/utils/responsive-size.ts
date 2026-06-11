import type {
  ResponsiveSplitterSizeConfig,
  ResponsiveSplitterSizeValue,
} from "../splitter.types";
import { isSplitterSizeToken, resolveTokenToPx } from "./size-tokens";

/** A finite, positive container measurement is required to convert pixels/tokens. */
const isMeasurable = (px: number | null | undefined): px is number =>
  typeof px === "number" && Number.isFinite(px) && px > 0;

const PERCENT_PATTERN = /^-?\d+(?:\.\d+)?%$/;
const NUMERIC_KEY_PATTERN = /^-?\d+(?:\.\d+)?$/;

/** Type guard: a `` `${number}%` `` string. */
export const isPercentValue = (value: unknown): value is `${number}%` =>
  typeof value === "string" && PERCENT_PATTERN.test(value);

/**
 * Resolve a single size value to a percentage of `containerPx`. A bare `number`
 * is pixels, a token resolves to pixels, a `"N%"` string passes through. Returns
 * `null` when unresolvable — a pixel/token value without a usable measurement,
 * or an unknown token.
 */
export const valueToPercent = (
  value: ResponsiveSplitterSizeValue,
  containerPx: number | null
): number | null => {
  if (typeof value === "number") {
    return isMeasurable(containerPx) ? (value / containerPx) * 100 : null;
  }
  if (isPercentValue(value)) {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : null;
  }
  if (isSplitterSizeToken(value)) {
    const px = resolveTokenToPx(value);
    if (px === null || !isMeasurable(containerPx)) return null;
    return (px / containerPx) * 100;
  }
  return null;
};

/** Clamp a percentage into `[min, max]` (defaults `[0, 100]`). */
export const clampPercent = (percent: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, percent));

/** Convert a percentage back to pixels for persistence. */
export const percentToPx = (percent: number, containerPx: number): number =>
  (percent / 100) * containerPx;

/** A resolved band: the container min-width threshold (px) and its size value. */
export type SizeBand = {
  thresholdPx: number;
  value: ResponsiveSplitterSizeValue;
};

const thresholdKeyToPx = (key: string): number | null => {
  if (NUMERIC_KEY_PATTERN.test(key)) {
    const n = parseFloat(key);
    return Number.isFinite(n) ? n : null;
  }
  if (isSplitterSizeToken(key)) return resolveTokenToPx(key);
  return null;
};

/** True when the config is a threshold map rather than a single value. */
export const isThresholdMap = (
  config: ResponsiveSplitterSizeConfig
): config is Partial<Record<string, ResponsiveSplitterSizeValue>> =>
  config !== null && typeof config === "object";

/**
 * Resolve a config into bands sorted ascending by threshold. A single value
 * becomes one band at threshold `0`; map keys resolve to pixels (numeric or
 * token), and unresolvable keys/values are dropped.
 */
export const toBands = (config: ResponsiveSplitterSizeConfig): SizeBand[] => {
  if (!isThresholdMap(config)) {
    return [{ thresholdPx: 0, value: config }];
  }
  const bands: SizeBand[] = [];
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) continue;
    const thresholdPx = thresholdKeyToPx(key);
    if (thresholdPx === null) continue;
    bands.push({ thresholdPx, value });
  }
  bands.sort((a, b) => a.thresholdPx - b.thresholdPx);
  return bands;
};

/** The configured value at a given threshold (for persistence unit lookup). */
export const bandValueAt = (
  config: ResponsiveSplitterSizeConfig,
  thresholdPx: number
): ResponsiveSplitterSizeValue | undefined =>
  toBands(config).find((b) => b.thresholdPx === thresholdPx)?.value;

/**
 * Select the active band for a measured size: the largest threshold `≤`
 * measured, with the smallest band applying below it. When an `activeThresholdPx`
 * is supplied, a hysteresis `deadbandPx` keeps the active band until the measured
 * size crosses the band's boundaries by more than the deadband, preventing
 * per-frame flapping at a threshold.
 */
export const selectBand = (
  bands: SizeBand[],
  measuredPx: number,
  opts?: { activeThresholdPx?: number | null; deadbandPx?: number }
): SizeBand | null => {
  if (bands.length === 0) return null;

  const pick = (m: number): SizeBand => {
    let chosen = bands[0]!;
    for (const band of bands) {
      if (band.thresholdPx <= m) chosen = band;
      else break;
    }
    return chosen;
  };

  const candidate = pick(measuredPx);
  const active = opts?.activeThresholdPx;
  const deadband = opts?.deadbandPx ?? 0;
  if (active == null || deadband <= 0 || candidate.thresholdPx === active) {
    return candidate;
  }

  const activeIdx = bands.findIndex((b) => b.thresholdPx === active);
  if (activeIdx === -1) return candidate;
  const activeBand = bands[activeIdx]!;
  const upperBound = bands[activeIdx + 1]?.thresholdPx ?? Infinity;
  // The active band covers [active, upperBound). Keep it until the measured size
  // is clearly outside that range by more than the deadband.
  if (measuredPx >= active - deadband && measuredPx < upperBound + deadband) {
    return activeBand;
  }
  return candidate;
};

/** A persisted band value: a pixel width or a percentage. */
export type StoredBand = { unit: "px" | "pct"; value: number };

/**
 * Resolve one size dimension to a percentage given the current measurement,
 * optional hysteresis state, and (for the size dimension) an optional stored
 * override that takes precedence over the config default for the active band.
 *
 * Returns the resolved `percent` (or `null` when not yet resolvable — a
 * pixel/token value awaiting measurement) and the active band's `thresholdPx`
 * (the persistence key).
 */
export const resolveDimension = (
  config: ResponsiveSplitterSizeConfig,
  measuredPx: number | null,
  opts?: {
    activeThresholdPx?: number | null;
    deadbandPx?: number;
    stored?: Record<number, StoredBand> | null;
  }
): { percent: number | null; thresholdPx: number | null } => {
  const bands = toBands(config);
  if (bands.length === 0) return { percent: null, thresholdPx: null };

  let active: SizeBand | null;
  if (bands.length === 1) {
    active = bands[0]!;
  } else {
    if (!isMeasurable(measuredPx)) return { percent: null, thresholdPx: null };
    active = selectBand(bands, measuredPx, {
      activeThresholdPx: opts?.activeThresholdPx,
      deadbandPx: opts?.deadbandPx,
    });
  }
  if (!active) return { percent: null, thresholdPx: null };

  const stored = opts?.stored?.[active.thresholdPx];
  if (stored) {
    const pct =
      stored.unit === "pct"
        ? stored.value
        : isMeasurable(measuredPx)
          ? (stored.value / measuredPx) * 100
          : null;
    // A stored px without a measurement yet → fall through to the config default.
    if (pct !== null) return { percent: pct, thresholdPx: active.thresholdPx };
  }

  return {
    percent: valueToPercent(active.value, measuredPx),
    thresholdPx: active.thresholdPx,
  };
};
