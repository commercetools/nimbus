import type { ChartRoles } from "../theme";

/**
 * The semantic role an overlay carries. Overlays never name a hue — they pick a
 * role and the theme resolves it, exactly like the base charts. `neutral` (a
 * recessive axis-gray) is the default so a reference/threshold reads as chrome,
 * not as another data series competing with the marks.
 */
export type OverlayVariant = "neutral" | "accent" | "positive" | "negative";

export function overlayColor(
  theme: ChartRoles,
  variant: OverlayVariant
): string {
  switch (variant) {
    case "accent":
      return theme.accent;
    case "positive":
      return theme.positive;
    case "negative":
      return theme.negative;
    case "neutral":
    default:
      return theme.axis;
  }
}
