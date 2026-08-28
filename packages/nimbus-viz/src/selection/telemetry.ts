import type { Intent } from "./types";

/**
 * Selection telemetry (docs/06 caveat: "log every question → intent →
 * candidates → chosen tuple so the telemetry loop tunes weights against real
 * usage instead of our guesses").
 *
 * The sink is injectable and defaults to a no-op, so the library emits nothing
 * until a host opts in. `resolve` emits exactly one record per call — including
 * fallback calls, where `chosen` is the DataTable sentinel.
 */

/** One selection event. */
export interface TelemetryRecord {
  /** The intent the agent asked for (may be an invalid string on a bad call). */
  intent: Intent | string;
  /** Filter survivors considered, best-first; `[]` when the filter emptied. */
  candidates: string[];
  /** The chosen chart's name, or the DataTable sentinel on fallback. */
  chosen: string;
}

/** A telemetry sink receives one record per `resolve` call. */
export type TelemetrySink = (record: TelemetryRecord) => void;

const noop: TelemetrySink = () => {};

let sink: TelemetrySink = noop;

/**
 * Install the telemetry sink. Pass a function to start receiving records, or
 * omit the argument to reset to the default no-op.
 */
export function setTelemetrySink(next: TelemetrySink = noop): void {
  sink = next;
}

/** The currently installed sink (useful for tests/inspection). */
export function getTelemetrySink(): TelemetrySink {
  return sink;
}

/**
 * Emit one record. A throwing sink must never break selection, so emission is
 * defensively wrapped — telemetry is an observation, not part of the result.
 */
export function emitTelemetry(record: TelemetryRecord): void {
  try {
    sink(record);
  } catch {
    /* A broken sink must not affect resolve's return value. */
  }
}
