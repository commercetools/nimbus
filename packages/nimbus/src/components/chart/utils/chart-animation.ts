/**
 * Decides whether Recharts animates the drawing.
 *
 * An explicit `isAnimationActive` prop always wins. Without it, the chart
 * animates unless the user prefers reduced motion.
 *
 * @param prop - The `isAnimationActive` prop of the chart, if set
 * @param prefersReducedMotion - Whether the user prefers reduced motion
 * @returns Whether the draw animation is on
 */
export const resolveIsAnimationActive = (
  prop: boolean | undefined,
  prefersReducedMotion: boolean
): boolean => prop ?? !prefersReducedMotion;
