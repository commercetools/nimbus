/** One point in a series. `y` may be null to represent a gap. */
export interface SeriesPoint {
  x: number | Date;
  y: number | null;
}

/** A named series of points (a line, an area, one set of bars). */
export interface Series {
  id: string;
  label: string;
  data: SeriesPoint[];
}

/** A categorical magnitude (one bar, one slice). */
export interface CategoryDatum {
  category: string;
  value: number;
}

/** One stacked segment within a category. */
export interface StackSegment {
  key: string;
  value: number;
}

/** A category with an ordered set of stacked segments (all rows share keys). */
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

/** One row of a matrix/cohort heatmap; `null` cells are ragged/absent. */
export interface HeatRow {
  label: string;
  values: Array<number | null>;
}

/** An ordered stage in a funnel (stages are given top-to-bottom). */
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
