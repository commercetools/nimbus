/**
 * Logs a warning to the console in development mode only.
 * Warnings are suppressed in production builds via dead-code elimination.
 */
export function devWarn(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[Nimbus] ${message}`);
  }
}
