/**
 * Accessibility props of an illustration. Without `alt` it is decorative and
 * hidden from assistive technology. With `alt` it is an image with that name.
 */
export const illustrationA11yProps = (alt?: string) =>
  alt
    ? ({ role: "img", "aria-label": alt } as const)
    : ({ "aria-hidden": true } as const);
