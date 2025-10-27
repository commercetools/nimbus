/**
 * Color Mode Toggle Component
 *
 * A standalone toggle button that cycles through light, dark, and system color modes.
 * Displays an icon representing the current mode and updates on click.
 */

import { IconButton, Icon, useColorMode } from "@commercetools/nimbus";
import {
  LightMode,
  DarkMode,
  SettingsBrightness,
} from "@commercetools/nimbus-icons";
import { useState, useEffect } from "react";

type ThemeMode = "light" | "dark" | "system";

export function ColorModeToggle() {
  const { setColorMode } = useColorMode();
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Read initial value from localStorage
    return (localStorage.getItem("theme") as ThemeMode) || "system";
  });

  // Listen for external changes to theme (e.g., from Settings Menu)
  useEffect(() => {
    const handleStorageChange = () => {
      const newTheme = (localStorage.getItem("theme") as ThemeMode) || "system";
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
    // Cycle through: light -> dark -> system -> light
    let nextMode: ThemeMode;
    if (themeMode === "light") {
      nextMode = "dark";
    } else if (themeMode === "dark") {
      nextMode = "system";
    } else {
      nextMode = "light";
    }

    setThemeMode(nextMode);
    setColorMode(nextMode);
    // Dispatch custom event for same-tab sync
    window.dispatchEvent(new Event("theme-changed"));
  };

  // Choose icon based on current mode
  const ModeIcon =
    themeMode === "light"
      ? LightMode
      : themeMode === "dark"
        ? DarkMode
        : SettingsBrightness;

  const ariaLabel =
    themeMode === "light"
      ? "Light mode (click for dark)"
      : themeMode === "dark"
        ? "Dark mode (click for system)"
        : "System mode (click for light)";

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
