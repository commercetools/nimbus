"use client";
import { useTheme } from "next-themes";

/**
 * Hook for managing color mode (light/dark theme) state.
 *
 * This hook provides access to the current color mode and functions to change it.
 * It integrates with the next-themes library to handle theme persistence and system preference detection.
 *
 * @returns An object containing:
 *   - `colorMode`: The current resolved theme ('light' | 'dark' | 'system' | undefined)
 *   - `setColorMode`: Function to set a specific color mode
 *   - `toggleColorMode`: Function to toggle between light and dark modes
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { colorMode, toggleColorMode } = useColorMode();
 *
 *   return (
 *     <button onClick={toggleColorMode}>
 *       Current mode: {colorMode}
 *     </button>
 *   );
 * }
 * ```
 */

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };
  return {
    colorMode: resolvedTheme,
    setColorMode: setTheme,
    toggleColorMode,
  };
}
