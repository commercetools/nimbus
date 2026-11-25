import { useRef } from "react";

/**
 * Returns the set from the previous render while it holds the same keys, in
 * any order.
 *
 * Consumers often pass a set that is new on every render but holds the same
 * keys: `draggableKeys={new Set(["a"])}`. Each new set would otherwise
 * re-create everything derived from it, such as the wrapped
 * `dragAndDropHooks`, and re-evaluate every row. A changed key still yields
 * the new set.
 *
 * @param set - The set passed in this render
 * @returns The previous set when its keys are the same, otherwise `set`
 */
export function useStableSet<T>(set: Set<T> | undefined): Set<T> | undefined {
  const previousRef = useRef(set);
  const previous = previousRef.current;
  if (previous !== set && !haveSameKeys(previous, set)) {
    previousRef.current = set;
  }
  return previousRef.current;
}

function haveSameKeys<T>(
  a: Set<T> | undefined,
  b: Set<T> | undefined
): boolean {
  if (!a || !b || a.size !== b.size) return false;
  for (const key of a) {
    if (!b.has(key)) return false;
  }
  return true;
}
