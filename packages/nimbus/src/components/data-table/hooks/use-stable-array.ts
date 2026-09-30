import { useRef } from "react";

/**
 * Returns the array from the previous render while it holds the same items in
 * the same order, compared with `Object.is`.
 *
 * Consumers often pass arrays that are new on every render but hold the same
 * items: `rows={data.filter(isVisible)}`, `columns={[nameColumn, statusColumn]}`
 * or `visibleColumns={["name", "status"]}`. Each new array would otherwise
 * recompute everything derived from it and re-render every row, even though no
 * row or column changed. A changed item still yields the new array, so a new
 * column `render` function or a replaced row object is never ignored.
 *
 * @param array - The array passed in this render
 * @returns The previous array when its items are the same, otherwise `array`
 */
export function useStableArray<T>(array: T[]): T[];
export function useStableArray<T>(array: T[] | undefined): T[] | undefined;
export function useStableArray<T>(array: T[] | undefined): T[] | undefined {
  const previousRef = useRef(array);
  const previous = previousRef.current;
  if (previous !== array && !haveSameItems(previous, array)) {
    previousRef.current = array;
  }
  return previousRef.current;
}

function haveSameItems<T>(a: T[] | undefined, b: T[] | undefined): boolean {
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!Object.is(a[i], b[i])) return false;
  }
  return true;
}
