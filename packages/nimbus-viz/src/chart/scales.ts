import { scaleLinear, scaleLog, scaleSymlog } from "@visx/scale";

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
