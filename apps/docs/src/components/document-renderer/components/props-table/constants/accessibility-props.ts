/**
 * Accessibility prop names that should be grouped in the accessibility category
 * (in addition to props starting with "aria")
 */
export const ACCESSIBILITY_PROPS = new Set([
  "role",
  "id",
  "tabIndex",
  "excludeFromTabOrder",
  "preventFocusOnPress",
]);
