import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useChartTheme } from "./theme-provider";

export interface ColorScale {
  (key: string): string;
  domain: readonly string[];
}

export interface ColorScaleOptions {
  /**
   * Color for entities beyond the categorical palette. Categorical hues are
   * never cycled (a wrapped 9th hue is indistinguishable from the 1st and
   * breaks CVD safety); once the palette is exhausted, extra entities take this
   * single neutral instead. Defaults to a mid-neutral; callers with a theme in
   * scope pass the theme's muted ink so it adapts to light/dark.
   */
  overflow?: string;
  /** Invoked once, the first time the domain exceeds the palette size. */
  onOverflow?: (paletteSize: number) => void;
}

// Fallback for direct callers/tests that don't pass a theme-derived neutral.
const DEFAULT_OVERFLOW = "#8a8a86";

/**
 * A categorical color scale keyed by entity id. Colors are assigned in fixed
 * order over the domain; a key not in the domain is appended stably on first
 * sight. Because assignment follows the entity — never its rank or its index in
 * a filtered subset — a chart that drops a category never repaints the
 * survivors (a dataviz non-negotiable).
 *
 * The palette is **capped, not cycled**: entities past `categorical.length`
 * receive `options.overflow` (a neutral) and trigger a one-time warning, so an
 * over-large series count degrades to a visibly-"other" gray rather than
 * silently reusing a distinct hue. Fold such entities into an "Other" bucket,
 * facet, or fall back to the table upstream.
 */
export function createColorScale(
  domain: readonly string[],
  categorical: string[],
  options: ColorScaleOptions = {}
): ColorScale {
  const overflow = options.overflow ?? DEFAULT_OVERFLOW;
  const paletteSize = categorical.length;
  const map = new Map<string, string>();
  let warned = false;

  // The n-th DISTINCT entity (order of first sight) gets the n-th hue; past the
  // palette it gets the neutral overflow color and warns once.
  const assign = (index: number): string => {
    if (index < paletteSize) return categorical[index];
    if (!warned) {
      warned = true;
      options.onOverflow?.(paletteSize);
      // eslint-disable-next-line no-console
      console.warn(
        `[nimbus-viz] Categorical palette exhausted (${paletteSize} colors): ` +
          `additional entities are drawn in a neutral "overflow" color, not a ` +
          `repeated hue. Group extra series into "Other", facet, or use a table.`
      );
    }
    return overflow;
  };

  domain.forEach((k) => {
    if (!map.has(k)) map.set(k, assign(map.size));
  });

  const scale = ((key: string): string => {
    let color = map.get(key);
    if (color === undefined) {
      color = assign(map.size);
      map.set(key, color);
    }
    return color;
  }) as ColorScale;
  (scale as { domain: readonly string[] }).domain = domain;
  return scale;
}

const ColorScaleContext = createContext<ColorScale | null>(null);

/**
 * Share one entity→color scale across every chart in a dashboard, so an entity
 * keeps its color from one chart to the next.
 */
export function ColorScaleProvider({
  domain,
  children,
}: {
  domain: readonly string[];
  children: ReactNode;
}) {
  const theme = useChartTheme();
  const scale = useMemo(
    () =>
      createColorScale(domain, theme.categorical, {
        overflow: theme.mutedInk,
      }),
    [domain, theme.categorical, theme.mutedInk]
  );
  return (
    <ColorScaleContext.Provider value={scale}>
      {children}
    </ColorScaleContext.Provider>
  );
}

/**
 * Resolve categorical colors per entity id: the dashboard-level scale from a
 * surrounding <ColorScaleProvider> when present, else a local scale over the
 * given domain.
 */
export function useEntityColors(domain: readonly string[]): ColorScale {
  const shared = useContext(ColorScaleContext);
  const theme = useChartTheme();
  return useMemo(
    () =>
      shared ??
      createColorScale(domain, theme.categorical, {
        overflow: theme.mutedInk,
      }),
    [shared, domain, theme.categorical, theme.mutedInk]
  );
}
