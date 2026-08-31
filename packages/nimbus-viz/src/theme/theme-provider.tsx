import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { resolveTheme } from "./roles";
import type { ChartRoles, ChartThemeName, ColorMode } from "./roles";

const ChartThemeContext = createContext<ChartRoles | null>(null);

export interface ChartThemeProviderProps {
  /**
   * Color mode. Prototype-stage this is an explicit prop; the intended
   * production wiring is to read the active Nimbus color mode from the host.
   */
  mode?: ColorMode;
  /**
   * Which chart theme from the catalog to use. Defaults to `"nimbus"` (the
   * validated data-viz reference palette). See {@link THEMES}.
   */
  theme?: ChartThemeName;
  children: ReactNode;
}

export function ChartThemeProvider({
  mode = "light",
  theme = "nimbus",
  children,
}: ChartThemeProviderProps) {
  const roles = useMemo(() => resolveTheme(theme, mode), [theme, mode]);
  return (
    <ChartThemeContext.Provider value={roles}>
      {children}
    </ChartThemeContext.Provider>
  );
}

export function useChartTheme(): ChartRoles {
  const ctx = useContext(ChartThemeContext);
  if (!ctx) {
    throw new Error(
      "nimbus-viz: useChartTheme must be used within a <ChartThemeProvider>"
    );
  }
  return ctx;
}
