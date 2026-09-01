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

/* -------------------------------------------------------------------------- */
/* `okabe-ito` theme — colorblind-max (Okabe & Ito 2008, derived)             */
/* -------------------------------------------------------------------------- */

/**
 * A maximum-accessibility theme built on the Okabe–Ito qualitative set, the
 * de-facto CVD-safe palette. Derived, not literal: Okabe–Ito's yellow (#f0e442)
 * sits above this catalog's lightness ceiling, so it (and a couple of neighbours)
 * are retuned to clear the gate in both modes, and an 8th slot (a cool
 * slate-blue) extends the 7 chromatic hues. Its valence pair is intentionally
 * blue-green/vermillion rather than green/red, so the a11y theme is not itself
 * red-green ambiguous.
 */
const okabeIto: ChartTheme = deepFreeze<ChartTheme>({
  name: "okabe-ito",
  light: {
    accent: "#e69f00",
    positive: "#009e73",
    negative: "#d55e00",
    categorical: [
      "#e69f00", // orange
      "#56b4e9", // sky blue
      "#009e73", // bluish green
      "#d9b310", // yellow (darkened from #f0e442 to fit the lightness band)
      "#0072b2", // blue
      "#d55e00", // vermillion
      "#cc79a7", // reddish purple
      "#44546a", // slate-blue (extension of the 7 Okabe–Ito hues)
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
    diverging: { negative: "#d55e00", neutral: "#f0efec", positive: "#0072b2" },
  },
  dark: {
    accent: "#f0a800",
    positive: "#20b98a",
    negative: "#e77038",
    categorical: [
      "#f0a800", // orange
      "#6cc4f5", // sky blue
      "#20b98a", // bluish green
      "#e6cf3a", // yellow
      "#3f9fe0", // blue
      "#e77038", // vermillion
      "#d98cba", // reddish purple
      "#6f93d6", // slate-blue
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
    diverging: { negative: "#e77038", neutral: "#383835", positive: "#3f9fe0" },
  },
});

/* -------------------------------------------------------------------------- */
/* `commercetools` theme — brand palette (@commercetools/nimbus color tokens) */
/* -------------------------------------------------------------------------- */

/**
 * A brand theme anchored on the three commercetools-custom brand scales from
 * `@commercetools/nimbus` color tokens — violet (`ctviolet`, the primary),
 * teal (`ctteal`), and yellow (`ctyellow`) — with the remaining categorical
 * slots filled by data-viz hues so the ordering still clears the gate. Violet
 * leads as the single-series accent. The default magnitude ramp stays `blue`
 * (its conventional key); a brand `violet` ramp is added alongside.
 */
const commercetools: ChartTheme = deepFreeze<ChartTheme>({
  name: "commercetools",
  light: {
    accent: "#4e4ed8",
    positive: "#006300",
    negative: "#e34948",
    categorical: [
      "#4e4ed8", // violet (brand primary — ctviolet)
      "#eb6834", // orange
      "#0bbfbf", // teal (brand — ctteal)
      "#f6c326", // yellow (brand — ctyellow)
      "#e87ba4", // magenta
      "#008300", // green
      "#2a78d6", // blue
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
      teal: ["#d3f3f3", "#7fdede", "#0bbfbf", "#008080", "#005757"],
      gray: ["#e1e0d9", "#a9a8a2", "#898781", "#5c5b57", "#3a3a37"],
      violet: [
        "#e6e6fb",
        "#b4b4f0",
        "#7b7be6",
        "#4e4ed8",
        "#3a3aa8",
        "#272773",
      ],
    },
    diverging: { negative: "#e34948", neutral: "#f0efec", positive: "#4e4ed8" },
  },
  dark: {
    accent: "#7b7be6",
    positive: "#0ca30c",
    negative: "#e66767",
    categorical: [
      "#7b7be6", // violet (brand — ctvioletDark, lightened for dark surface)
      "#d95926", // orange
      "#2cd0d0", // teal (brand — cttealDark, lightened)
      "#f5c200", // yellow (brand — ctyellowDark)
      "#d55181", // magenta
      "#008300", // green
      "#3987e5", // blue
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
      teal: ["#0d3f3f", "#0a6b6b", "#0bbfbf", "#37d2d2", "#8fe6e6"],
      gray: ["#2c2c2a", "#54534e", "#898781", "#b0afa8", "#d8d7cf"],
      violet: [
        "#1e1e3b",
        "#2f2f7a",
        "#4141b8",
        "#5a5ad6",
        "#8f8fe6",
        "#c3c3f5",
      ],
    },
    diverging: { negative: "#e66767", neutral: "#383835", positive: "#7b7be6" },
  },
});

/** The seed theme registry (built-ins). Custom themes are added at runtime with
 * {@link registerTheme}; this const keeps the static union of built-in names. */
export const THEMES = { nimbus, "okabe-ito": okabeIto, commercetools } as const;

/** A built-in theme name (autocompletes). Registered custom names are accepted
 * anywhere a name is taken, via the `(string & {})` widening below. */
export type ChartThemeName = keyof typeof THEMES;

const DEFAULT_THEME: ChartThemeName = "nimbus";

// Live registry, seeded with the built-ins. Kept separate from THEMES so the
// static union of built-in names stays exact while custom themes register at
// runtime.
const registry = new Map<string, ChartTheme>(Object.entries(THEMES));

/**
 * Register a custom chart theme so it can be selected by name on
 * `<ChartThemeProvider theme="…">`. The theme is shape-checked and deep-frozen
 * (charts must not mutate the shared palette); re-registering a name replaces
 * it. Run the legibility gate (see `legibility.spec.ts`) on a new theme before
 * shipping it.
 */
export function registerTheme(theme: ChartTheme): void {
  if (!theme || typeof theme.name !== "string" || !theme.light || !theme.dark) {
    throw new Error(
      "nimbus-viz: registerTheme(theme) requires an object with { name, light, dark }."
    );
  }
  registry.set(theme.name, deepFreeze(theme));
}

/**
 * Resolve a theme name + mode to its (frozen) role set. Accepts a built-in name,
 * a name registered via {@link registerTheme}, or any string. Never throws: an
 * unknown name falls back to `nimbus` with a dev warning, mirroring the resolver
 * philosophy in `selection/resolve.tsx`.
 */
export function resolveTheme(
  name: ChartThemeName | (string & {}),
  mode: ColorMode
): ChartRoles {
  const theme = registry.get(name);
  if (!theme) {
    console.warn(
      `nimbus-viz: unknown chart theme "${String(name)}"; using "${DEFAULT_THEME}"`
    );
    return registry.get(DEFAULT_THEME)![mode === "dark" ? "dark" : "light"];
  }
  return theme[mode === "dark" ? "dark" : "light"];
}

/** Back-compat shim: the default theme's roles for a mode. */
export function resolveRoles(mode: ColorMode): ChartRoles {
  return resolveTheme(DEFAULT_THEME, mode);
}

/**
 * Coerce a host color-mode value (e.g. `next-themes` `resolvedTheme`, which can
 * be `"light" | "dark" | "system" | undefined`) to the strict {@link ColorMode}
 * charts use — anything but `"dark"` becomes `"light"`. This is the seam for
 * host-mode sync WITHOUT coupling the package to the host: a consumer inside a
 * NimbusProvider does
 * `<ChartThemeProvider mode={coerceColorMode(useColorMode().colorMode)}>`.
 */
export function coerceColorMode(value: string | null | undefined): ColorMode {
  return value === "dark" ? "dark" : "light";
}
