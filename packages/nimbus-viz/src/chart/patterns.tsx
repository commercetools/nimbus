import type { ReactElement } from "react";

/**
 * SVG texture fills — a redundant, non-color encoding for series identity. Color
 * alone fails for monochrome print, photocopies, and `forced-colors` mode (where
 * the OS flattens hue and the CVD ΔE math no longer applies); a per-series
 * texture keeps categories distinguishable by *shape*. Opt-in: a chart renders
 * `<ChartPatternDefs>` once and fills marks with `patternFill(i)`.
 */

// Kind per categorical slot, cycled by index. Slot 0 is a solid fill so the
// most common single-series case is untextured.
const PATTERN_KINDS = [
  "solid",
  "diagonal",
  "dots",
  "diagonal-reverse",
  "grid",
  "horizontal",
  "vertical",
  "cross",
] as const;

export type PatternKind = (typeof PATTERN_KINDS)[number];

const TILE = 6;

function patternId(prefix: string, index: number): string {
  return `${prefix}-${index}`;
}

/** `url(#…)` fill referencing the texture for categorical slot `index`. */
export function patternFill(index: number, prefix = "nv-tex"): string {
  return `url(#${patternId(prefix, index)})`;
}

function geometry(kind: PatternKind, color: string): ReactElement {
  const s = TILE;
  switch (kind) {
    case "solid":
      return <rect width={s} height={s} fill={color} />;
    case "diagonal":
      return <path d={`M0,${s} L${s},0`} stroke={color} strokeWidth={1.4} />;
    case "diagonal-reverse":
      return <path d={`M0,0 L${s},${s}`} stroke={color} strokeWidth={1.4} />;
    case "cross":
      return (
        <path
          d={`M0,${s} L${s},0 M0,0 L${s},${s}`}
          stroke={color}
          strokeWidth={1.1}
        />
      );
    case "dots":
      return <circle cx={s / 2} cy={s / 2} r={1.3} fill={color} />;
    case "grid":
      return (
        <path d={`M0,0 L0,${s} M0,0 L${s},0`} stroke={color} strokeWidth={1} />
      );
    case "horizontal":
      return (
        <path
          d={`M0,${s / 2} L${s},${s / 2}`}
          stroke={color}
          strokeWidth={1.4}
        />
      );
    case "vertical":
      return (
        <path
          d={`M${s / 2},0 L${s / 2},${s}`}
          stroke={color}
          strokeWidth={1.4}
        />
      );
  }
}

export interface ChartPatternDefsProps {
  /** Series colors, in categorical order. One texture is emitted per color. */
  colors: readonly string[];
  /** Id prefix; must match the one passed to {@link patternFill}. */
  idPrefix?: string;
}

/**
 * Renders one `<pattern>` per color into a `<defs>`. Place inside the chart's
 * `<svg>` (e.g. at the top of the plot group), then fill marks with
 * `patternFill(i, idPrefix)`.
 */
export function ChartPatternDefs({
  colors,
  idPrefix = "nv-tex",
}: ChartPatternDefsProps): ReactElement {
  return (
    <defs>
      {colors.map((color, i) => {
        const kind = PATTERN_KINDS[i % PATTERN_KINDS.length];
        return (
          <pattern
            key={i}
            id={patternId(idPrefix, i)}
            width={TILE}
            height={TILE}
            patternUnits="userSpaceOnUse"
          >
            {/* Base wash keeps the fill legible where the texture is sparse. */}
            <rect width={TILE} height={TILE} fill={color} fillOpacity={0.18} />
            {geometry(kind, color)}
          </pattern>
        );
      })}
    </defs>
  );
}
