/**
 * Formats any value as JSON text and never throws:
 *
 * - circular references become the string `"[Circular]"`
 * - `BigInt` values become their decimal string
 * - values that JSON cannot represent at the top level (`undefined`,
 *   functions, symbols) become the text `undefined`
 * - values whose serialization throws (for example a throwing `toJSON`)
 *   become the text `[Unserializable]`
 */
export const stringifyJson = (value: unknown, indent = 2): string => {
  // The objects on the path from the root to the value being serialized.
  const ancestors: unknown[] = [];

  function replacer(this: unknown, _key: string, current: unknown): unknown {
    if (typeof current === "bigint") return current.toString();
    if (typeof current !== "object" || current === null) return current;
    // `this` is the object that holds `current`; leave the branches that
    // JSON.stringify has finished.
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(current)) return "[Circular]";
    ancestors.push(current);
    return current;
  }

  try {
    return JSON.stringify(value, replacer, indent) ?? "undefined";
  } catch {
    return "[Unserializable]";
  }
};
