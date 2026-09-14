import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { resolveTheme } from "./roles";
import type {
  ChartRoles,
  ChartTheme,
  ChartThemeName,
  ColorMode,
} from "./roles";

const ChartThemeContext = createContext<ChartRoles | null>(null);

export interface ChartThemeProviderProps {
  /**
   * Color mode. Explicit by default; for host sync pass the app's active mode,
   * e.g. `mode={coerceColorMode(useColorMode().colorMode)}` inside a
   * NimbusProvider (see `coerceColorMode` in `roles.ts`).
   */
  mode?: ColorMode;
  /**
   * Which chart theme to use: a built-in name (`"nimbus"`), a name registered
   * via `registerTheme`, or a raw {@link ChartTheme} object. Defaults to
   * `"nimbus"` (the validated data-viz reference palette).
   */
  theme?: ChartThemeName | (string & {}) | ChartTheme;
  children: ReactNode;
}

export function ChartThemeProvider({
  mode = "light",
  theme = "nimbus",
  children,
}: ChartThemeProviderProps) {
  const roles = useMemo(() => {
    // A raw ChartTheme object bypasses the registry (one-off / test / brand).
    if (typeof theme === "object") {
      return mode === "dark" ? theme.dark : theme.light;
    }
    return resolveTheme(theme, mode);
  }, [theme, mode]);
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
