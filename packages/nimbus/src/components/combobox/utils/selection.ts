import { type Key } from "react-stately";
/**
 * Normalize selectedKeys to Set format
 */
export const normalizeSelectedKeys = (
  keys: Key | Key[] | undefined | null
): Set<Key> => {
  if (!keys) return new Set();
  if (keys instanceof Set) return keys;
  return new Set(Array.isArray(keys) ? keys : [keys]);
};

/**
 * Denormalize selectedKeys from Set to single value or array based on selectionMode
 */
export const denormalizeSelectedKeys = (
  keys: Set<Key>,
  selectionMode: "single" | "multiple"
): Key | Key[] => {
  const keysArray = Array.from(keys);
  if (selectionMode === "single") {
    return keysArray[0] ?? null;
  }
  return keysArray;
};
