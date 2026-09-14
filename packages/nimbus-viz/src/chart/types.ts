/** One point in a series. `y` may be null to represent a gap. */
export interface SeriesPoint {
  x: number | Date;
  y: number | null;
}

/** A named series of points (a line, an area, one set of bars). */
export interface Series {
  /** Unique per chart — used to key series, colors, and interaction payloads. */
  id: string;
  /** Display text; need not be unique. */
  label: string;
  data: SeriesPoint[];
}

/**
 * A categorical magnitude (one bar, one slice).
 *
 * `category` is display text and need not be unique: charts position rows by
 * their index in the array, so two rows with the same category are two rows.
 * `value` may be negative where the chart's encoding can show it (bars, dots);
 * magnitude-only encodings (funnels, sizes) document their own sign contract.
 */
export interface CategoryDatum {
  category: string;
  value: number;
}

/** One stacked segment within a category. */
export interface StackSegment {
  key: string;
  value: number;
}

/**
 * A category with an ordered set of stacked segments.
 *
 * Rows conventionally share the same segment keys, but the set of keys a chart
 * draws (and lists in its legend) is the union across all rows in first-seen
 * order (`stackKeys` in `chart/stack.ts`), so a segment missing from the first
 * row is still drawn where it occurs. `category` is display text and need not
 * be unique; rows are positioned by index.
 */
export interface StackRow {
  category: string;
  segments: StackSegment[];
}

/** A point in a two-variable relationship. */
export interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
  /** Optional grouping — colors points by group in fixed categorical order. */
  group?: string;
}

/**
 * One row of a matrix/cohort heatmap; `null` cells are ragged/absent.
 * `label` is display text and need not be unique; rows are positioned by index.
 */
export interface HeatRow {
  label: string;
  values: Array<number | null>;
}

/**
 * An ordered stage in a funnel (stages are given top-to-bottom). `stage` is
 * display text and need not be unique. `value` is a non-negative count; a
 * funnel has no encoding for a negative stage.
 */
export interface FunnelStage {
  stage: string;
  value: number;
}

// Flow graph (Sankey). Node/link are type aliases (not interfaces) so they
// satisfy d3-sankey's index-signature generic constraint.
export type FlowNode = { name: string };
export type FlowLink = { source: number; target: number; value: number };
export interface FlowGraph {
  nodes: FlowNode[];
  links: FlowLink[];
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
