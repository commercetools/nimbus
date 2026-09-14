import { scaleBand, scaleLinear, scaleLog, scaleSymlog } from "@visx/scale";

/**
 * Value-axis scale kinds. `symlog` is the safe default when offering a toggle:
 * it tolerates zero and negative values (which `log` cannot) and so fits the
 * charts' current `[0, max]` domains without special-casing.
 */
export type ValueScaleKind = "linear" | "log" | "symlog";

export interface ValueScaleConfig {
  /** Data domain `[min, max]`. */
  domain: [number, number];
  /** Pixel range, typically `[innerHeight, 0]` for a value axis. */
  range: [number, number];
  /** Round the domain to nice tick boundaries (linear/log). */
  nice?: boolean;
}

/**
 * The slice of a continuous d3/visx scale that charts and axes consume. Declared
 * explicitly (rather than inferred) so the emitted `.d.ts` doesn't need to name
 * the transitive `@types/d3-scale` types, which aren't portable across the pnpm
 * store. Pass to a visx axis with a cast if its stricter scale type complains.
 */
export interface ValueScale {
  (value: number): number;
  domain(): number[];
  range(): number[];
  ticks(count?: number): number[];
}

/**
 * Build a value-axis scale of the requested kind from one config, so a chart can
 * offer a `log`/`symlog` option for heavy-tailed data (revenue, long-tail SKU
 * counts) without each chart re-deriving the construction. There is no central
 * scale factory today — value axes are built inline per chart — so this is the
 * seam a `yScale` prop plugs into.
 *
 * `log` requires a strictly positive domain; a non-positive lower bound is
 * clamped up to a thousandth of the max (a log axis cannot represent zero).
 * Prefer `symlog` for a generic toggle over `[0, max]` data.
 */
export function makeValueScale(
  kind: ValueScaleKind,
  { domain, range, nice = true }: ValueScaleConfig
): ValueScale {
  switch (kind) {
    case "log": {
      const [lo, hi] = domain;
      const top = hi > 0 ? hi : 1;
      const safeLo = lo > 0 ? lo : top / 1000;
      return scaleLog<number>({
        domain: [safeLo, top],
        range,
        nice,
      }) as unknown as ValueScale;
    }
    case "symlog":
      return scaleSymlog<number>({ domain, range }) as unknown as ValueScale;
    case "linear":
    default:
      return scaleLinear<number>({
        domain,
        range,
        nice,
      }) as unknown as ValueScale;
  }
}

/* -------------------------------------------------------------------------- */
/* Value domains                                                              */
/* -------------------------------------------------------------------------- */

export interface ValueDomainOptions {
  /**
   * Anchor the domain at 0 when the data does not already cross it, so bars and
   * areas are measured from a common baseline. Default `true`. Set `false` for
   * a position encoding (dots, lines) where the data's own extent is the honest
   * frame.
   */
  includeZero?: boolean;
  /** Mirror the domain around 0 (`[-m, m]`) for diverging encodings. */
  symmetric?: boolean;
  /** Extra values the axis must show — control limits, targets, benchmarks. */
  include?: readonly number[];
}

/**
 * A value-axis domain that is safe for signed, all-equal, and empty input.
 *
 * d3/visx scales do not clamp: a value outside the stated domain is
 * extrapolated, so a `[0, max]` domain fed a negative value draws it beyond the
 * plot (or as an invisible zero-height bar), and a degenerate `[v, v]` domain
 * maps every input to the midpoint of the range. Both produce a plausible-looking
 * picture that does not match the data. This helper is the one place those two
 * mistakes are handled:
 *
 * - non-finite entries (`null`, `undefined`, `NaN`, `±Infinity`) are ignored;
 * - with `includeZero` (default) the domain is widened to reach 0, in whichever
 *   direction the data lies — all-negative input yields `[min, 0]`;
 * - an all-equal input is widened to a non-zero span (`[0, 1]` when the value
 *   is 0; otherwise reaching to 0, or ±50% of the value when zero is not
 *   included);
 * - empty input yields `[0, 1]`.
 *
 * Pass the result as the `domain` of a `scaleLinear` (with `nice: true`) or to
 * `makeValueScale`.
 */
export function valueDomain(
  values: readonly (number | null | undefined)[],
  {
    includeZero = true,
    symmetric = false,
    include = [],
  }: ValueDomainOptions = {}
): [number, number] {
  let lo = Number.POSITIVE_INFINITY;
  let hi = Number.NEGATIVE_INFINITY;
  const consider = (v: number | null | undefined) => {
    if (typeof v !== "number" || !Number.isFinite(v)) return;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  };
  for (const v of values) consider(v);
  for (const v of include) consider(v);

  if (lo === Number.POSITIVE_INFINITY) return [0, 1];

  if (symmetric) {
    const m = Math.max(Math.abs(lo), Math.abs(hi)) || 1;
    return [-m, m];
  }

  if (includeZero) {
    lo = Math.min(0, lo);
    hi = Math.max(0, hi);
  }

  if (lo === hi) {
    if (lo === 0) return [0, 1];
    const pad = Math.abs(lo) / 2;
    return [lo - pad, hi + pad];
  }

  return [lo, hi];
}

/* -------------------------------------------------------------------------- */
/* Band layouts                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The d3 band-scale surface, declared structurally (like `ValueScale`) so the
 * emitted `.d.ts` stays free of `@types/d3-scale`. Mirrors `ScaleBand<string>`
 * member for member so it can be handed to a visx `AxisLeft`/`AxisBottom`
 * `scale` prop directly.
 */
export interface BandScale {
  (key: string): number | undefined;
  domain(): string[];
  domain(domain: Iterable<string>): this;
  range(): [number, number];
  range(range: Iterable<number>): this;
  rangeRound(range: Iterable<number>): this;
  round(): boolean;
  round(round: boolean): this;
  paddingInner(): number;
  paddingInner(padding: number): this;
  paddingOuter(): number;
  paddingOuter(padding: number): this;
  padding(): number;
  padding(padding: number): this;
  align(): number;
  align(align: number): this;
  bandwidth(): number;
  step(): number;
  copy(): this;
}

export interface BandLayoutOptions {
  /** Pixel range along the band axis, e.g. `[0, innerWidth]`. */
  range: [number, number];
  /** Combined inner + outer padding as a fraction of the step (d3 semantics). */
  padding?: number;
  paddingInner?: number;
  paddingOuter?: number;
  /** Snap band edges to whole pixels. */
  round?: boolean;
}

export interface BandLayout {
  /** Start position of the band for row `i`. */
  pos(i: number): number;
  /** Center of the band for row `i`. */
  center(i: number): number;
  /** Width of one band in pixels. */
  bandwidth: number;
  /** Distance from one band start to the next (bandwidth plus inner padding). */
  step: number;
  /** Number of bands. */
  count: number;
  /**
   * The underlying band scale. Its domain is the row indices as strings
   * (`"0"`, `"1"`, …), so pass it to an axis together with `tickFormat`.
   */
  scale: BandScale;
  /** Maps an index key from the scale's domain back to the row's label. */
  tickFormat(key: string): string;
}

/**
 * A band layout keyed by row **index**, never by the row's label text.
 *
 * `scaleBand({ domain: rows.map((d) => d.category) })` is the natural thing to
 * write and it is wrong: d3 dedupes the domain, so two rows that share a label
 * collapse onto one band and one of them is drawn on top of the other with no
 * error. Labels are display text; position must come from the row's index.
 *
 * Use `pos(i)` / `center(i)` for marks and React keys, `scale` + `tickFormat`
 * for an axis, and `labels[i]` (your own array) for any in-plot text.
 */
export function bandByIndex(
  labels: readonly string[],
  { range, padding, paddingInner, paddingOuter, round }: BandLayoutOptions
): BandLayout {
  const domain = labels.map((_, i) => String(i));
  const config: Parameters<typeof scaleBand<string>>[0] = { domain, range };
  if (padding !== undefined) config.padding = padding;
  if (paddingInner !== undefined) config.paddingInner = paddingInner;
  if (paddingOuter !== undefined) config.paddingOuter = paddingOuter;
  if (round !== undefined) config.round = round;
  const scale = scaleBand<string>(config) as unknown as BandScale;
  const bandwidth = scale.bandwidth();
  return {
    scale,
    bandwidth,
    step: scale.step(),
    count: labels.length,
    pos: (i) => scale(String(i)) ?? 0,
    center: (i) => (scale(String(i)) ?? 0) + bandwidth / 2,
    tickFormat: (key) => labels[Number(key)] ?? key,
  };
}
