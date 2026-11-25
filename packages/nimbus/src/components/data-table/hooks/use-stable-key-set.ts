import { useEffect, useRef } from "react";
import type { Key } from "react-aria-components";

/** Renders in a row with equal keys in a new object before warning. */
const CHURN_WARNING_THRESHOLD = 3;

/**
 * Normalizes an iterable of keys to a `Set<string>` and returns the set from
 * the previous render while it holds the same keys, in any order.
 *
 * Consumers often pass a new iterable with the same keys on every render:
 * `draggableKeys={new Set(["a"])}`. Each new set would otherwise re-create
 * everything derived from it and re-evaluate every row. The comparison only
 * runs when the input identity changes, and it costs O(keys), not O(rows).
 * In development it warns once when equal keys keep arriving in new objects.
 *
 * @param keys - The keys passed in this render
 * @param name - Prop name used in the development warning
 * @returns A set that keeps its identity while its keys stay the same
 */
export function useStableKeySet(
  keys: Iterable<Key> | undefined,
  name = "draggableKeys"
): ReadonlySet<string> | undefined {
  const inputRef = useRef(keys);
  // Filled once: `useRef(toKeySet(keys))` would convert the keys on every render.
  const setRef = useRef<ReadonlySet<string> | undefined>(undefined);
  const isInitializedRef = useRef(false);
  if (!isInitializedRef.current) {
    isInitializedRef.current = true;
    setRef.current = toKeySet(keys);
  }
  const churnRef = useRef(0);

  if (inputRef.current !== keys) {
    inputRef.current = keys;
    const next = toKeySet(keys);
    if (haveSameKeys(setRef.current, next)) {
      churnRef.current += 1;
    } else {
      churnRef.current = 0;
      setRef.current = next;
    }
  } else {
    churnRef.current = 0;
  }

  const isChurning = churnRef.current >= CHURN_WARNING_THRESHOLD;
  const hasWarnedRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!isChurning || hasWarnedRef.current) return;
    hasWarnedRef.current = true;
    console.warn(
      `[Nimbus] DataTable: \`${name}\` gets a new object with the same keys on every render. Keep it stable, for example with useMemo.`
    );
  }, [isChurning, name]);

  return setRef.current;
}

function toKeySet(keys: Iterable<Key> | undefined) {
  if (keys === undefined) return undefined;
  const set = new Set<string>();
  for (const key of keys) set.add(String(key));
  return set;
}

function haveSameKeys(
  a: ReadonlySet<string> | undefined,
  b: ReadonlySet<string> | undefined
): boolean {
  if (a === undefined || b === undefined) return a === b;
  if (a.size !== b.size) return false;
  for (const key of a) {
    if (!b.has(key)) return false;
  }
  return true;
}
