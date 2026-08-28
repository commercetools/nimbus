import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { ColorMode } from "./tokens";
import { resolveRoles } from "./roles";
import type { ChartRoles } from "./roles";

const ChartThemeContext = createContext<ChartRoles | null>(null);

export interface ChartThemeProviderProps {
  /**
   * Color mode. Prototype-stage this is an explicit prop; the intended
   * production wiring is to read the active Nimbus color mode from the host.
   */
  mode?: ColorMode;
  children: ReactNode;
}

export function ChartThemeProvider({
  mode = "light",
  children,
}: ChartThemeProviderProps) {
  const roles = useMemo(() => resolveRoles(mode), [mode]);
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
