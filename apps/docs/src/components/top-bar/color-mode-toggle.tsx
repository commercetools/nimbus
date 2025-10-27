/**
 * Color Mode Toggle Component
 *
 * A standalone toggle button that cycles through light and dark color modes.
 * Displays an icon representing the current mode and updates on click.
 */

import { IconButton, Icon, useColorMode } from "@commercetools/nimbus";
import { LightMode, DarkMode } from "@commercetools/nimbus-icons";
import { useState, useEffect } from "react";

type ThemeMode = "light" | "dark";

export function ColorModeToggle() {
  const { setColorMode } = useColorMode();
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Read initial value from localStorage
    return (localStorage.getItem("theme") as ThemeMode) || "light";
  });

  // Listen for external changes to theme (e.g., from Settings Menu)
  useEffect(() => {
    const handleStorageChange = () => {
      const newTheme = (localStorage.getItem("theme") as ThemeMode) || "light";
      setThemeMode(newTheme);
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen to custom event for same-tab changes
    window.addEventListener("theme-changed", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("theme-changed", handleStorageChange);
    };
  }, []);

  const handleToggle = () => {
    // Toggle between light and dark
    const nextMode: ThemeMode = themeMode === "light" ? "dark" : "light";

    setThemeMode(nextMode);
    setColorMode(nextMode);
    // Dispatch custom event for same-tab sync
    window.dispatchEvent(new Event("theme-changed"));
  };

  // Choose icon based on current mode
  const ModeIcon = themeMode === "light" ? LightMode : DarkMode;

  const ariaLabel =
    themeMode === "light"
      ? "Light mode (click for dark)"
      : "Dark mode (click for light)";

  return (
    <IconButton
      aria-label={ariaLabel}
      size="xs"
      variant="ghost"
      onClick={handleToggle}
    >
      <Icon as={ModeIcon} slot="icon" />
    </IconButton>
  );
}
