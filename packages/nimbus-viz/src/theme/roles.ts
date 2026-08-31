/**
 * The chart theme catalog and the semantic color roles charts draw from.
 *
 * A theme is data: a complete {@link ChartRoles} object per mode. Charts never
 * name a hue or a token step — they read a role from `useChartTheme()`, and the
 * active theme supplies the value for the current mode. Themes are independent of
 * the Nimbus UI palette (which is tuned for UI, not data-viz legibility): each is
 * a set of colors validated for the six data-viz checks (CVD ΔE, lightness band,
 * chroma floor, contrast) in both light and dark. Adding a theme is one entry in
 * {@link THEMES}; the seed `nimbus` theme is the validated data-viz reference set.
 */

export type ColorMode = "light" | "dark";

/**
 * Named single-hue sequential ramps. `blue`/`teal`/`gray` are always present (so
 * `ramps.blue` is never `undefined`); a chart's `hue` prop indexes by name and
 * falls back to `blue` for anything else.
 */
export interface ChartRamps {
  blue: string[];
  teal: string[];
  gray: string[];
  [name: string]: string[];
}

/**
 * The semantic roles a chart draws from, resolved for one mode. Every field is a
 * concrete color string. `ramps`/`diverging` back the sequential and diverging
 * scales (see `sequential.ts`), so charts never reach for a raw hue name.
 */
export interface ChartRoles {
  mode: ColorMode;
  /** Primary emphasis (single-series accent, focused element). */
  accent: string;
  /** Valence — up/good. Carried WITH a non-color cue, never color alone. */
  positive: string;
  /** Valence — down/bad. Carried WITH a non-color cue, never color alone. */
  negative: string;
  /** Ordered categorical series colors. Assigned in order, never cycled. */
  categorical: string[];
  /** Strong text/ink (titles, values). */
  ink: string;
  /** Secondary text (axis labels, legends, captions). */
  mutedInk: string;
  /** Gridlines. */
  grid: string;
  /** Axis lines / ticks. */
  axis: string;
  /** Raised surface — a card or the chart's own background. */
  surface: string;
  /** Recessed app/page background, one step behind `surface`. */
  surfacePage: string;
  /**
   * Named single-hue sequential ramps, as OKLab anchor stops ordered so that
   * `t=0` is nearest the surface and `t=1` is the strongest reading (light→dark
   * in light mode, dark→bright in dark mode). Always includes `blue` (the
   * default magnitude ramp), plus `teal` and `gray`.
   */
  ramps: ChartRamps;
  /** Diverging scale poles + neutral midpoint (blue ↔ red). */
  diverging: { negative: string; neutral: string; positive: string };
}

/** A named theme: one {@link ChartRoles} per mode. */
export interface ChartTheme {
  name: string;
  light: ChartRoles;
  dark: ChartRoles;
}

/** Recursively freeze an object graph so a chart can't mutate the shared palette. */
function deepFreeze<T>(obj: T): T {
  for (const value of Object.values(obj as Record<string, unknown>)) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }
  Object.freeze(obj);
  return obj;
}

/* -------------------------------------------------------------------------- */
/* The `nimbus` theme — the validated data-viz reference palette               */
/* -------------------------------------------------------------------------- */

const nimbus: ChartTheme = deepFreeze<ChartTheme>({
  name: "nimbus",
  light: {
    mode: "light",
    accent: "#2a78d6",
    positive: "#006300",
    negative: "#e34948",
    categorical: [
      "#2a78d6", // blue
      "#eb6834", // orange
      "#1baf7a", // aqua
      "#eda100", // yellow
      "#e87ba4", // magenta
      "#008300", // green
      "#4a3aa7", // violet
      "#e34948", // red
    ],
    ink: "#0b0b0b",
    mutedInk: "#52514e",
    grid: "#e1e0d9",
    axis: "#c3c2b7",
    surface: "#fcfcfb",
    surfacePage: "#f9f9f7",
    ramps: {
      // light→dark (t=1 is the strongest reading)
      blue: ["#cde2fb", "#86b6ef", "#3987e5", "#2a78d6", "#184f95", "#0d366b"],
      teal: ["#d3f3e8", "#5fcdaa", "#1baf7a", "#0f7d57", "#0a5a3f"],
      gray: ["#e1e0d9", "#a9a8a2", "#898781", "#5c5b57", "#3a3a37"],
    },
    diverging: { negative: "#e34948", neutral: "#f0efec", positive: "#2a78d6" },
  },
  dark: {
    mode: "dark",
    accent: "#3987e5",
    positive: "#0ca30c",
    negative: "#e66767",
    categorical: [
      "#3987e5", // blue
      "#d95926", // orange
      "#199e70", // aqua
      "#c98500", // yellow
      "#d55181", // magenta
      "#008300", // green
      "#9085e9", // violet
      "#e66767", // red
    ],
    ink: "#ffffff",
    mutedInk: "#c3c2b7",
    grid: "#2c2c2a",
    axis: "#383835",
    surface: "#1a1a19",
    surfacePage: "#0d0d0d",
    ramps: {
      // dark→bright (t=1 is the strongest reading)
      blue: ["#12233b", "#184f95", "#256abf", "#3987e5", "#6da7ec", "#b7d3f6"],
      teal: ["#0d4735", "#137a58", "#199e70", "#38c496", "#8fe0c3"],
      gray: ["#2c2c2a", "#54534e", "#898781", "#b0afa8", "#d8d7cf"],
    },
    diverging: { negative: "#e66767", neutral: "#383835", positive: "#3987e5" },
  },
});

/** The theme registry. Adding a theme is one entry here. */
export const THEMES = { nimbus } as const;

/** A registered theme name. Grows as themes are added. */
export type ChartThemeName = keyof typeof THEMES;

const DEFAULT_THEME: ChartThemeName = "nimbus";

/**
 * Resolve a theme name + mode to its (frozen) role set. Never throws: an
 * unrecognized name or mode falls back to `nimbus` / `light` with a dev warning,
 * mirroring the resolver philosophy in `selection/resolve.tsx`.
 */
export function resolveTheme(
  name: ChartThemeName,
  mode: ColorMode
): ChartRoles {
  const theme = THEMES[name];
  if (!theme) {
    console.warn(
      `nimbus-viz: unknown chart theme "${String(name)}"; using "${DEFAULT_THEME}"`
    );
    return THEMES[DEFAULT_THEME][mode === "dark" ? "dark" : "light"];
  }
  return theme[mode === "dark" ? "dark" : "light"];
}

/** Back-compat shim: the default theme's roles for a mode. */
export function resolveRoles(mode: ColorMode): ChartRoles {
  return resolveTheme(DEFAULT_THEME, mode);
}
