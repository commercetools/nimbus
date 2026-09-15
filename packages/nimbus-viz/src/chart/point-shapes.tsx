import type { MouseEventHandler, ReactElement } from "react";

/**
 * Per-group marker SHAPE — a redundant, non-color encoding for point identity
 * on FILLED-POINT marks (circles sized by a data value: bubble/scatter).
 * `patternFill` (`chart/patterns.tsx`) is the honest texture for a mark whose
 * fill AREA carries the point, but a sized point's radius can be only a few
 * pixels (`bubble-chart.tsx`'s `R_MIN` is 4, well under `patterns.tsx`'s 6px
 * tile) — at that end of the range a fill pattern reads as noise, not a
 * shape. Marker shape has no minimum-size floor: a triangle is still a
 * legible triangle at r=4. Opt-in: swap a mark's `<circle>` for
 * `<PointMark shape={pointShapeFor(i)} .../>`.
 */

// Kind per group, cycled by index. Slot 0 is "circle" so the most common
// single-group case renders exactly as it did before this existed.
const POINT_SHAPE_KINDS = [
  "circle",
  "square",
  "triangle",
  "diamond",
  "star",
] as const;

export type PointShapeKind = (typeof POINT_SHAPE_KINDS)[number];

/** Marker shape for categorical slot `index`, cycling through {@link POINT_SHAPE_KINDS}. */
export function pointShapeFor(index: number): PointShapeKind {
  return POINT_SHAPE_KINDS[index % POINT_SHAPE_KINDS.length];
}

export interface PointMarkProps {
  /** Marker shape, from {@link pointShapeFor}. */
  shape: PointShapeKind;
  /** Center x, in the same coordinate space a `<circle>`'s `cx` would use. */
  cx: number;
  /** Center y, in the same coordinate space a `<circle>`'s `cy` would use. */
  cy: number;
  /** Visual radius — every shape occupies about the same footprint as a
   *  circle of this radius, so swapping `shape` never changes hit-target
   *  size or position math. */
  r: number;
  fill: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
  onClick?: MouseEventHandler;
}

function starPoints(cx: number, cy: number, r: number): string {
  const outerR = r * 1.3;
  const innerR = r * 0.5;
  const spikes = 5;
  const step = Math.PI / spikes;
  const pts: string[] = [];
  let angle = -Math.PI / 2;
  for (let i = 0; i < spikes * 2; i += 1) {
    const rad = i % 2 === 0 ? outerR : innerR;
    pts.push(`${cx + Math.cos(angle) * rad},${cy + Math.sin(angle) * rad}`);
    angle += step;
  }
  return pts.join(" ");
}

function polygonPoints(
  shape: "square" | "triangle" | "diamond",
  cx: number,
  cy: number,
  r: number
): string {
  switch (shape) {
    case "square": {
      // A touch smaller than the circle's bounding box so the square reads
      // as roughly the same visual area, not a visibly bigger footprint.
      const s = r * 0.88;
      return `${cx - s},${cy - s} ${cx + s},${cy - s} ${cx + s},${cy + s} ${cx - s},${cy + s}`;
    }
    case "triangle": {
      const h = r * 1.15;
      return `${cx},${cy - h} ${cx + h * 0.95},${cy + h * 0.7} ${cx - h * 0.95},${cy + h * 0.7}`;
    }
    case "diamond": {
      const d = r * 1.15;
      return `${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`;
    }
  }
}

/**
 * One marker, shaped per `shape`. `circle` and `star` need their own SVG
 * primitive (a polygon can't express a circle, and a star is concave); every
 * other shape is a `<polygon>`.
 */
export function PointMark({
  shape,
  cx,
  cy,
  r,
  fill,
  fillOpacity,
  stroke,
  strokeWidth,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: PointMarkProps): ReactElement {
  if (shape === "circle") {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
    );
  }
  const points =
    shape === "star" ? starPoints(cx, cy, r) : polygonPoints(shape, cx, cy, r);
  return (
    <polygon
      points={points}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    />
  );
}
