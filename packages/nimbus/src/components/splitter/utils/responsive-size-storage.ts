import type { SplitterSizesStorage } from "../splitter.types";
import type { StoredBand } from "./responsive-size";

/** Current persisted-payload schema version. Bump + migrate on shape changes. */
export const STORAGE_VERSION = 1;

type StoredPayload = {
  v: number;
  /** Bands keyed by resolved pixel threshold (as a string, per JSON). */
  bands: Record<string, StoredBand>;
};

const isStoredBand = (value: unknown): value is StoredBand => {
  if (value === null || typeof value !== "object") return false;
  const band = value as Record<string, unknown>;
  return (
    (band.unit === "px" || band.unit === "pct") &&
    typeof band.value === "number" &&
    Number.isFinite(band.value)
  );
};

/**
 * Parse a raw stored payload string into a threshold-keyed band map. Tolerates
 * absent, corrupt, or older/unknown-version data by returning `null` (the caller
 * then resolves from config defaults). Versioned so future shape changes can
 * migrate rather than silently misread.
 */
export const parseStoredBands = (
  raw: string | null
): Record<number, StoredBand> | null => {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (parsed === null || typeof parsed !== "object") return null;
  const payload = parsed as Partial<StoredPayload>;
  if (payload.v !== STORAGE_VERSION || typeof payload.bands !== "object") {
    // Unknown/older version: no migration defined yet → ignore.
    return null;
  }
  const out: Record<number, StoredBand> = {};
  for (const [key, value] of Object.entries(payload.bands ?? {})) {
    const thresholdPx = Number(key);
    if (!Number.isFinite(thresholdPx)) continue;
    if (isStoredBand(value)) out[thresholdPx] = value;
  }
  return out;
};

/** Serialize a band map into the versioned payload string. */
export const serializeStoredBands = (
  bands: Record<number, StoredBand>
): string => JSON.stringify({ v: STORAGE_VERSION, bands });

/**
 * A `localStorage`-backed {@link SplitterSizesStorage} that never throws and
 * no-ops when `localStorage` is unavailable (SSR, privacy mode, quota). Used as
 * the default adapter.
 */
export const createLocalStorageAdapter = (): SplitterSizesStorage => ({
  getItem: (key) => {
    try {
      if (typeof localStorage === "undefined") return null;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof localStorage === "undefined") return;
      localStorage.setItem(key, value);
    } catch {
      // Quota / denied — persistence is best-effort.
    }
  },
});
