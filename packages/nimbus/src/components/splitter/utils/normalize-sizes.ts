/**
 * Normalize a 2-pane sizes record so its two entries sum to exactly 100, with
 * full float precision preserved (no rounding, no `minSize` clamp). Used both to
 * seed initial sizes from `defaultSizes` and to reconcile an inbound controlled
 * `sizes` prop.
 *
 * Returns `null` when the record does not carry two finite entries for `order`
 * or their sum is ≤ 0 — letting callers distinguish "valid sizes" from
 * "nothing usable" rather than silently inventing a layout.
 *
 * @param record - Id-keyed sizes (e.g. `defaultSizes` or a controlled `sizes`).
 * @param order - The two registered pane ids, in DOM order (`[a, b]`).
 * @returns A record summing to 100, or `null` when the input is unusable.
 *
 * @example
 * normalizeSizes({ nav: 25, main: 75 }, ["nav", "main"]); // → { nav: 25, main: 75 }
 * normalizeSizes({ nav: 1, main: 3 }, ["nav", "main"]);   // → { nav: 25, main: 75 }
 * normalizeSizes({ nav: 25 }, ["nav", "main"]);           // → null
 */
export const normalizeSizes = (
  record: Record<string, number> | null | undefined,
  order: string[]
): Record<string, number> | null => {
  if (order.length !== 2) return null;
  const [a, b] = order as [string, string];

  const va = record?.[a];
  const vb = record?.[b];
  if (
    typeof va === "number" &&
    Number.isFinite(va) &&
    typeof vb === "number" &&
    Number.isFinite(vb)
  ) {
    const sum = va + vb;
    if (sum > 0) {
      // Normalize to exactly 100 without rounding (preserve float precision).
      return { [a]: (va / sum) * 100, [b]: (vb / sum) * 100 };
    }
  }

  return null;
};
