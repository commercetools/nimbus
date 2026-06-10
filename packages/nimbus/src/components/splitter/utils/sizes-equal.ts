// Aside sizes are compared within this tolerance so a value re-normalized on the
// way in (e.g. a consumer feeding back the value we just emitted) reads as equal
// despite last-ULP float drift — looser than that drift, far tighter than any
// meaningful proportion change.
const SIZE_EPSILON = 1e-6;

/**
 * Value equality for two aside sizes, within `SIZE_EPSILON`. Used to
 * short-circuit the controlled-`size` reconcile effect when the incoming value
 * already matches internal state (no write, no loop).
 *
 * @example
 * sizeEqual(30, 30);        // → true
 * sizeEqual(30, 30.0000001); // → true
 * sizeEqual(30, 31);         // → false
 */
export const sizeEqual = (
  a: number | null | undefined,
  b: number | null | undefined
): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  return Math.abs(a - b) <= SIZE_EPSILON;
};
