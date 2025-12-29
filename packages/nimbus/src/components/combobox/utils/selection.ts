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
 * Denormalize selectedKeys from Set to array
 * Always returns an array regardless of selection mode for simpler API
 */
export const denormalizeSelectedKeys = (keys: Set<Key>): Key[] => {
  return Array.from(keys);
};
