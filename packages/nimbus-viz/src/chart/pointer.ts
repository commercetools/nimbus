import { localPoint } from "@visx/event";
import type { MouseEvent as ReactMouseEvent } from "react";

export interface PlotPoint {
  x: number;
  y: number;
}

/**
 * Convert a pointer event into PLOT-local coordinates — the same space
 * `xScale`/`yScale` operate in (0,0 at the plot's top-left, i.e. *after* the
 * chart's margin, not the outer `<svg>`'s own origin).
 *
 * Wraps `@visx/event`'s `localPoint`, which reads the SVG's actual
 * `getScreenCTM()` — correct under a `viewBox` scale, CSS transforms, or
 * zoom. This replaces the `event.clientX - rect.left` /
 * `getBoundingClientRect()` arithmetic that was previously hand-rolled,
 * slightly differently, in five separate charts (only for nearest-datum
 * resolution, never for positioning a tooltip — see `svg-tooltip.tsx`).
 *
 * `localPoint` itself resolves relative to the outermost `<svg>`, i.e.
 * *before* the `<Group left={margin.left} top={margin.top}>` (or
 * equivalent) every chart draws its marks inside — so the margin is
 * subtracted here to land in the same coordinate space `xScale(...)` /
 * `yScale(...)` already use. Returns `null` when the point can't be
 * resolved (no SVG ancestor) — callers should no-op rather than fall back
 * to `(0, 0)`, which would be a real, wrong position.
 */
export function plotPointerPosition(
  event: ReactMouseEvent,
  margin: { left: number; top: number }
): PlotPoint | null {
  const point = localPoint(event);
  if (!point) return null;
  return { x: point.x - margin.left, y: point.y - margin.top };
}

/** Clamp a coordinate into `[0, max]` — keeps a pointer-derived position
 *  (e.g. for a tooltip) inside the plot even if the event fired on a mark
 *  that extends slightly past the plot's own edge (a bar's rounded cap, a
 *  point's radius). */
export function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}
