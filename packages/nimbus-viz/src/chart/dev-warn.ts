const seen = new Set<string>();

/**
 * Development-only, once-per-key warning for input a chart accepts but cannot
 * draw faithfully — a negative value in a magnitude-only encoding, duplicate
 * keys where uniqueness is assumed, a ragged stack.
 *
 * This is the floor for a "plausible but excluded" input (see
 * `/chart:introspect` Lens E2): it changes nothing in production, costs one
 * `Set` lookup per render in development, and tells the first developer who
 * wires the chart to live data what they are looking at instead of leaving a
 * plausible-looking wrong picture on screen.
 *
 * The `process.env.NODE_ENV` check is the same guard core Nimbus uses; app
 * bundlers replace it at build time, and Vite library mode leaves it for the
 * consumer's bundler to resolve.
 */
export function devWarn(key: string, message: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (seen.has(key)) return;
  seen.add(key);
  console.warn(`[nimbus-viz] ${message}`);
}

/** Test hook: forget every key so the next `devWarn` fires again. */
export function resetDevWarnings(): void {
  seen.clear();
}
