/**
 * Stability tiers. The library is prototype-stage and grew breadth-first, so
 * every chart shipped with the same thin treatment. This marks which charts are
 * hardened enough to depend on: the core commerce set is `stable`; everything
 * else is `experimental` while the API settles. Surfaces the tier the docs
 * `ChartMeta` / a consumer can read, without needing to annotate all ~33
 * registry entries individually.
 */
export type Stability = "stable" | "experimental";

/**
 * Charts promoted to `stable` — the ~6 forms that do most commerce dashboards,
 * targeted first for states / interaction / tests. Names match the selection
 * registry's base names.
 */
export const STABLE_CHARTS: ReadonlySet<string> = new Set([
  "line",
  "stacked-area",
  "bar",
  "bar-vertical",
  "bar-horizontal",
  "stacked-bar",
  "stat-card",
  "bullet",
  "funnel",
  "cohort-triangle",
  "heatmap",
]);

/** The stability tier for a chart base name. */
export function chartStability(name: string): Stability {
  return STABLE_CHARTS.has(name) ? "stable" : "experimental";
}
