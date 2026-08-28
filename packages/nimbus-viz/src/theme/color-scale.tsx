import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useChartTheme } from "./theme-provider";

export interface ColorScale {
  (key: string): string;
  domain: readonly string[];
}

/**
 * A categorical color scale keyed by entity id. Colors are assigned in fixed
 * order over the domain; a key not in the domain is appended stably on first
 * sight. Because assignment follows the entity — never its rank or its index in
 * a filtered subset — a chart that drops a category never repaints the
 * survivors (a dataviz non-negotiable).
 */
export function createColorScale(
  domain: readonly string[],
  categorical: string[]
): ColorScale {
  const map = new Map<string, string>();
  domain.forEach((k, i) => {
    if (!map.has(k)) map.set(k, categorical[i % categorical.length]);
  });
  const scale = ((key: string): string => {
    let color = map.get(key);
    if (color === undefined) {
      color = categorical[map.size % categorical.length];
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
    () => createColorScale(domain, theme.categorical),
    [domain, theme.categorical]
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
    () => shared ?? createColorScale(domain, theme.categorical),
    [shared, domain, theme.categorical]
  );
}
