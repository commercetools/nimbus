import { useMemo, useState } from "react";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useEntityColors } from "../../theme";
import { formatPercent } from "../../chart/format";
import type { CategoryDatum } from "../../chart/types";

export interface WaffleChartProps {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** One `CategoryDatum` (`{ category, value }`) per category; cells are
   *  allocated in proportion to `value`, in array order. */
  data: CategoryDatum[];
  /** Grid side length in cells (default 10 → 100 cells = whole). */
  cells?: number;
  ariaLabel?: string;
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

/**
 * Part-to-whole as a grid of squares (a "gridplot"/waffle). Each category fills
 * a proportional number of cells; color is identity (one hue per category, fixed
 * order), so a legend is always present. Reads shares more accurately than a pie
 * for a handful of categories. Hovering a cell dims the other categories and
 * shows that category's share.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function WaffleChart({
  width,
  height,
  data,
  cells = 10,
  ariaLabel,
}: WaffleChartProps) {
  const [hover, setHover] = useState<string | null>(null);
  const total = useMemo(
    () => data.reduce((s, d) => s + Math.max(0, d.value), 0),
    [data]
  );
  const color = useEntityColors(
    useMemo(() => data.map((d) => d.category), [data])
  );

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
      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      ariaLabel={ariaLabel ?? `Waffle chart of ${data.length} categories`}
      legend={data.map((d) => ({
        label: d.category,
        color: color(d.category),
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
            {Array.from({ length: cells * cells }, (_, idx) => {
              // Fill bottom-to-top so the grid "grows" upward.
              const rowFromTop = Math.floor(idx / cells);
              const col = idx % cells;
              const cellIndex = (cells - 1 - rowFromTop) * cells + col;
              const owner = cellOwners[cellIndex];
              const cat = owner != null ? data[owner]?.category : undefined;
              const dimmed = hover != null && cat != null && hover !== cat;
              return (
                <rect
                  key={idx}
                  x={offsetX + col * side + gap / 2}
                  y={offsetY + rowFromTop * side + gap / 2}
                  width={Math.max(0, side - gap)}
                  height={Math.max(0, side - gap)}
                  rx={2}
                  fill={cat != null ? color(cat) : undefined}
                  fillOpacity={cat == null ? 0 : dimmed ? 0.3 : 1}
                  onMouseEnter={() => cat != null && setHover(cat)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
            {hover != null && activeShare != null && (
              <SvgTooltip
                x={innerWidth / 2}
                innerWidth={innerWidth}
                top={4}
                lines={[hover, formatPercent(activeShare)]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
