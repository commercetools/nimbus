import { useMemo, useState } from "react";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatPercent } from "../../chart/format";
import { ChartPatternDefs, patternFill } from "../../chart/patterns";
import { useForcedColors } from "../../chart/use-forced-colors";
import type { CategoryDatum } from "../../chart/types";
import type { DatumInteractionProps } from "../../chart/interaction";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";
import { clamp, plotPointerPosition } from "../../chart/pointer";

export interface WaffleChartProps extends DatumInteractionProps<CategoryDatum> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** One `CategoryDatum` (`{ category, value }`) per category; cells are
   *  allocated in proportion to `value`, in array order. */
  data: CategoryDatum[];
  /** Grid side length in cells (default 10 → 100 cells = whole). */
  cells?: number;
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /**
   * Fill each owned cell with a per-category SVG texture
   * (`chart/patterns.tsx`) in addition to its color, so categories stay
   * distinguishable by shape alone — monochrome print, a photocopy, or
   * `forced-colors` mode, where the OS flattens hue and the color-only
   * encoding stops working. Default `false` (color only, unchanged). Turned
   * on automatically (regardless of this prop) when the OS is already in a
   * forced-colors context — see `useForcedColors`.
   */
  texture?: boolean;
}

/**
 * Allocate `total` cells across categories by largest-remainder rounding, so the
 * cell counts sum exactly to `total` and each category's share is preserved as
 * closely as integer cells allow.
 */
function allocateCells(values: number[], total: number): number[] {
  const sum = values.reduce((s, v) => s + Math.max(0, v), 0);
  if (sum <= 0) return values.map(() => 0);
  const raw = values.map((v) => (Math.max(0, v) / sum) * total);
  const floors = raw.map((r) => Math.floor(r));
  let remainder = total - floors.reduce((s, v) => s + v, 0);
  const byFrac = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < byFrac.length && remainder > 0; k += 1, remainder -= 1) {
    floors[byFrac[k].i] += 1;
  }
  return floors;
}

// Named so the pointer math below (which needs the same left/top offset
// xScale/yScale are drawn relative to) can never drift from what's
// actually passed to ChartContainer.
const MARGIN = { top: 8, right: 8, bottom: 8, left: 8 };

/**
 * Part-to-whole as a grid of squares (a "gridplot"/waffle). Each category fills
 * a proportional number of cells; color is identity (one hue per category, fixed
 * order), so a legend is always present. Reads shares more accurately than a pie
 * for a handful of categories. Hovering a cell outlines every cell of that
 * category (its siblings are never dimmed) and shows that category's share,
 * the tooltip tracking the live pointer while it stays inside the grid.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function WaffleChart({
  width,
  height,
  data,
  cells = 10,
  ariaLabel,
  onDatumClick,
  onDatumHover,
  texture,
}: WaffleChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<string | null>(null);
  // Live pointer position (plot-local), while a cell is being hovered by
  // mouse -- null on keyboard focus (not applicable here, there is none) or
  // once the pointer leaves, so the tooltip falls back to a fixed position
  // rather than a stale coordinate from a previous hover.
  const [pointerPos, setPointerPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;
  const total = useMemo(
    () => data.reduce((s, d) => s + Math.max(0, d.value), 0),
    [data]
  );
  const color = useEntityColors(
    useMemo(() => data.map((d) => d.category), [data])
  );
  // In a forced-colors context, real hues aren't preserved by the OS anyway
  // -- one system foreground color for every category, with the per-category
  // pattern kind (below) as the only identity carrier.
  const colorFor = (i: number) =>
    forcedColors ? "CanvasText" : color(data[i].category);

  // One category index per grid cell, filled category-by-category.
  const cellOwners = useMemo(() => {
    const counts = allocateCells(
      data.map((d) => d.value),
      cells * cells
    );
    const owners: number[] = [];
    counts.forEach((count, i) => {
      for (let k = 0; k < count; k += 1) owners.push(i);
    });
    return owners;
  }, [data, cells]);

  if (width <= 0 || height <= 0 || data.length === 0 || total <= 0) return null;

  const table = {
    columns: ["Category", "Value", "Share"],
    rows: data.map((d) => [
      d.category,
      d.value,
      formatPercent(d.value / total),
    ]),
  };
  const activeShare =
    hover != null
      ? (data.find((d) => d.category === hover)?.value ?? 0) / total
      : null;

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={MARGIN}
      ariaLabel={ariaLabel ?? `Waffle chart of ${data.length} categories`}
      legend={data.map((d, i) => ({
        label: d.category,
        color: colorFor(i),
      }))}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const side = Math.max(0, Math.min(innerWidth, innerHeight) / cells);
        const gap = Math.min(3, side * 0.14);
        const gridSize = side * cells;
        const offsetX = (innerWidth - gridSize) / 2;
        const offsetY = (innerHeight - gridSize) / 2;
        return (
          <>
            {effectiveTexture && (
              <ChartPatternDefs colors={data.map((_, i) => colorFor(i))} />
            )}
            {Array.from({ length: cells * cells }, (_, idx) => {
              // Fill bottom-to-top so the grid "grows" upward.
              const rowFromTop = Math.floor(idx / cells);
              const col = idx % cells;
              const cellIndex = (cells - 1 - rowFromTop) * cells + col;
              const owner = cellOwners[cellIndex];
              const cat = owner != null ? data[owner]?.category : undefined;
              // Outline every cell of the hovered category; never dim the
              // other categories' cells (`chart/marks.ts`'s
              // `ACTIVE_STROKE_WIDTH` -- the shared convention, replacing a
              // per-chart "dim everyone else" opacity ternary). `hover` is
              // keyed by category (not by cell), so the whole category's
              // block of cells is the "active mark" here, not just the one
              // cell under the pointer.
              const isHovered = hover != null && cat != null && hover === cat;
              return (
                <rect
                  key={idx}
                  x={offsetX + col * side + gap / 2}
                  y={offsetY + rowFromTop * side + gap / 2}
                  width={Math.max(0, side - gap)}
                  height={Math.max(0, side - gap)}
                  rx={2}
                  fill={
                    cat == null
                      ? undefined
                      : effectiveTexture
                        ? patternFill(owner)
                        : colorFor(owner)
                  }
                  fillOpacity={cat == null ? 0 : 1}
                  stroke={isHovered ? theme.ink : "none"}
                  strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 0}
                  onMouseEnter={(e) => {
                    if (cat == null || owner == null) return;
                    setHover(cat);
                    const p = plotPointerPosition(e, MARGIN);
                    if (p) setPointerPos(p);
                    onDatumHover?.({ datum: data[owner], index: owner });
                  }}
                  onMouseMove={(e) => {
                    if (cat == null) return;
                    const p = plotPointerPosition(e, MARGIN);
                    if (p) setPointerPos(p);
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    setPointerPos(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() => {
                    if (owner == null) return;
                    onDatumClick?.({ datum: data[owner], index: owner });
                  }}
                />
              );
            })}
            {hover != null && activeShare != null && (
              <SvgTooltip
                x={
                  pointerPos != null
                    ? clamp(pointerPos.x, innerWidth)
                    : innerWidth / 2
                }
                innerWidth={innerWidth}
                top={pointerPos != null ? clamp(pointerPos.y, innerHeight) : 4}
                lines={[hover, formatPercent(activeShare)]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
