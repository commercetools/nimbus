// Sizes records are compared within this tolerance so a value re-normalized on
// the way in (e.g. a consumer feeding back the record we just emitted) reads as
// equal despite last-ULP float drift — looser than that drift, far tighter than
// any meaningful proportion change.
const SIZES_EPSILON = 1e-6;

/**
 * Order-independent value equality for two id-keyed sizes records, within
 * `SIZES_EPSILON`. Used to short-circuit the controlled-`sizes` reconcile effect
 * when the incoming value already matches internal state (no write, no loop).
 *
 * @example
 * sizesEqual({ a: 30, b: 70 }, { b: 70, a: 30 }); // → true
 * sizesEqual({ a: 30, b: 70 }, { a: 31, b: 69 }); // → false
 */
export const sizesEqual = (
  a: Record<string, number> | null | undefined,
  b: Record<string, number> | null | undefined
): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;
  for (const key of aKeys) {
    const bv = b[key];
    if (bv === undefined || Math.abs(a[key]! - bv) > SIZES_EPSILON)
      return false;
  }
  return true;
};
