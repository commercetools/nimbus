import { fallbackColor, SHADOW, type PaletteStep } from "./tokens";

const variable = (step: PaletteStep, mode: "light" | "dark") =>
  `var(--nimbus-colors-color-palette-${step}, ${fallbackColor(step, mode)})`;

/**
 * Palette step per color mode. The same step in both modes gives a plain
 * variable. Nimbus scales flip lightness in dark mode, so roles that need a
 * different step use `light-dark()`, which needs `color-scheme: dark` on an
 * ancestor.
 */
const scheme = (light: PaletteStep, dark: PaletteStep = light) =>
  light === dark
    ? variable(light, "light")
    : `light-dark(${variable(light, "light")}, ${variable(dark, "dark")})`;

/** Every color in an illustration is one of these roles. */
export const ROLES = {
  /** panels, fields, cards */
  surface: scheme(1, 3),
  surfaceStroke: scheme(6),
  /** the active, selected or primary element */
  strong: scheme(9),
  /** marks placed on `strong` */
  onStrong: scheme("contrast"),
  /** text placeholder on a surface */
  text: scheme(7),
  /** emphasised text: headers, selected rows */
  textStrong: scheme(8),
  /** text placeholder placed straight on the canvas */
  onBg: scheme(8),
  /** hidden or disabled marks, idle days */
  muted: scheme(5),
  /** separators */
  line: scheme(5),
  icon: scheme(9, 11),
  /** selected row, range band */
  tint: scheme(4),
  /** idle switch track */
  track: scheme(6),
  /** switch knob on an idle track */
  knob: scheme(1, 12),
  cursor: scheme(1, 12),
  cursorStroke: scheme(12, 1),
} as const;

export type Role = keyof typeof ROLES;

/** Roles that can fill a shape. */
export type FillRole = Exclude<Role, "surfaceStroke" | "cursorStroke">;

export const paint = (role: Role): string => ROLES[role];

const BACKGROUND_START = `var(--illustration-gradient-start, ${scheme(4, 2)})`;
const BACKGROUND_END = `var(--illustration-gradient-end, ${BACKGROUND_START})`;

/** Canvas gradient. A page sets the two variables; the end defaults to start. */
export const BACKGROUND = {
  start: BACKGROUND_START,
  end: BACKGROUND_END,
} as const;

/** Drop shadow color: `shadow.3` in light mode, stronger in dark mode. */
export const SHADOW_FLOOD = `light-dark(hsla(0, 0%, 0%, ${SHADOW.light}), hsla(0, 0%, 0%, ${SHADOW.dark}))`;

/** Every paint string a generated SVG may contain (besides `none` and `url(#)`). */
export const ALLOWED_PAINTS: ReadonlySet<string> = new Set([
  ...Object.values(ROLES),
  BACKGROUND_START,
  BACKGROUND_END,
  SHADOW_FLOOD,
]);
