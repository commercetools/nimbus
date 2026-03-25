/**
 * Logs a warning in development mode only.
 *
 * The check is compiled away in production builds, so there is no runtime
 * cost. Use this instead of inlining `process.env.NODE_ENV` checks.
 */
export function devWarn(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(message);
  }
}
