import type { ReactNode } from "react";
import { useChartTheme } from "../theme";
import { LABEL_PX } from "./typography";
import { LEGEND_HEIGHT } from "./marks";

export interface Facet<T> {
  key: string;
  label?: string;
  data: T;
}

export interface FacetGridProps<T> {
  facets: ReadonlyArray<Facet<T>>;
  width: number;
  height: number;
  /** Column count; defaults to `ceil(sqrt(n))` for a roughly square grid. */
  columns?: number;
  gap?: number;
  /** Reserved height for each cell's label strip. */
  labelHeight?: number;
  /** A single shared legend rendered once below the grid. */
  legendSlot?: ReactNode;
  legendHeight?: number;
  /**
   * Render one facet's chart at the given cell size. To share scales across
   * facets (the usual intent), compute a global domain from all facets and pass
   * it into each chart here — the grid handles layout, not domain unification.
   */
  renderCell: (
    facet: Facet<T>,
    size: { width: number; height: number }
  ) => ReactNode;
}

/**
 * Small-multiples layout: the same chart repeated across a partition key, in a
 * responsive grid with per-cell labels and one shared legend. The standard cure
 * for overplotting many categories/cohorts.
 */
export function FacetGrid<T>({
  facets,
  width,
  height,
  columns,
  gap = 12,
  labelHeight = 18,
  legendSlot,
  legendHeight = LEGEND_HEIGHT,
  renderCell,
}: FacetGridProps<T>) {
  const theme = useChartTheme();
  const n = facets.length;
  const cols = Math.max(1, columns ?? Math.ceil(Math.sqrt(n)));
  const rows = Math.max(1, Math.ceil(n / cols));
  const legendH = legendSlot ? legendHeight : 0;
  const gridH = Math.max(0, height - legendH);
  const cellW = Math.max(0, (width - gap * (cols - 1)) / cols);
  const cellPlotH = Math.max(
    0,
    (gridH - gap * (rows - 1)) / rows - labelHeight
  );

  return (
    <div style={{ width, height }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap,
          height: gridH,
        }}
      >
        {facets.map((f) => (
          <div key={f.key} style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: LABEL_PX,
                color: theme.mutedInk,
                height: labelHeight,
                lineHeight: `${labelHeight}px`,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {f.label ?? f.key}
            </div>
            {renderCell(f, { width: cellW, height: cellPlotH })}
          </div>
        ))}
      </div>
      {legendSlot && (
        <div style={{ height: legendH, paddingTop: 6 }}>{legendSlot}</div>
      )}
    </div>
  );
}
