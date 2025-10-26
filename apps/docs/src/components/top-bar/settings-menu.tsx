/**
 * Settings Menu Component
 *
 * Provides user preferences controls:
 * - Color mode (light/dark/system)
 * - Font size (xs, sm, md, lg, xl)
 * - Density (compact, comfortable, spacious)
 * - Export/Import settings
 * - Reset to defaults
 */

import {
  Menu,
  IconButton,
  useColorMode,
  Separator,
  Icon,
} from "@commercetools/nimbus";
import {
  Settings,
  LightMode,
  DarkMode,
  SettingsBrightness,
  FileDownload,
  FileUpload,
  RestartAlt,
} from "@commercetools/nimbus-icons";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";

// User preferences atom
export const userPreferencesAtom = atomWithStorage("nimbus-docs-prefs", {
  fontSize: "md" as "xs" | "sm" | "md" | "lg" | "xl",
  density: "comfortable" as "compact" | "comfortable" | "spacious",
});

const DEFAULT_PREFERENCES = {
  fontSize: "md" as const,
  density: "comfortable" as const,
};

export function SettingsMenu() {
  const { colorMode, setColorMode } = useColorMode();
  const [preferences, setPreferences] = useAtom(userPreferencesAtom);

  // Cross-tab sync via storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nimbus-docs-prefs" && e.newValue) {
        try {
          const newPrefs = JSON.parse(e.newValue);
          setPreferences(newPrefs);
          applyFontSize(newPrefs.fontSize);
        } catch (error) {
          console.error("Failed to sync preferences across tabs:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setPreferences]);

  // Apply font size on mount
  useEffect(() => {
    applyFontSize(preferences.fontSize);
  }, []);

  const applyFontSize = (size: string) => {
    document.documentElement.style.fontSize =
      {
        xs: "12px",
        sm: "14px",
        md: "16px",
        lg: "18px",
        xl: "20px",
      }[size] || "16px";
  };

  const handleFontSizeChange = (selectedKeys: string[]) => {
    const size = Array.from(selectedKeys)[0] as string;
    if (size) {
      setPreferences({
        ...preferences,
        fontSize: size as "xs" | "sm" | "md" | "lg" | "xl",
      });
      applyFontSize(size);
    }
  };

  const handleDensityChange = (selectedKeys: Set<React.Key>) => {
    const density = Array.from(selectedKeys)[0] as string;
    if (density) {
      setPreferences({
        ...preferences,
        density: density as "compact" | "comfortable" | "spacious",
      });
    }
  };

  const handleColorModeChange = (selectedKeys: Set<React.Key>) => {
    const mode = Array.from(selectedKeys)[0] as string;
    if (mode) {
      setColorMode(mode as "light" | "dark" | "system");
    }
  };

  const handleExportSettings = () => {
    const settings = {
      preferences,
      colorMode,
      version: "1.0",
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nimbus-docs-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const settings = JSON.parse(text);

        if (settings.preferences) {
          setPreferences(settings.preferences);
          applyFontSize(settings.preferences.fontSize);
        }
        if (settings.colorMode) {
          setColorMode(settings.colorMode);
        }
      } catch {
        // Import failed
      }
    };
    input.click();
  };

  const handleResetSettings = () => {
    setPreferences(DEFAULT_PREFERENCES);
    applyFontSize(DEFAULT_PREFERENCES.fontSize);
    setColorMode("system");
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton aria-label="Settings" size="xs" variant="ghost">
          <Icon as={Settings} slot="icon" />
        </IconButton>
      </Menu.Trigger>

      <Menu.Content minWidth="200px">
        {/* Theme Section */}
        <Menu.Section
          label="Theme"
          selectionMode="single"
          selectedKeys={new Set([colorMode])}
          onSelectionChange={handleColorModeChange}
        >
          <Menu.Item id="light">
            <Icon as={LightMode} slot="icon" />
            Light
          </Menu.Item>
          <Menu.Item id="dark">
            <Icon as={DarkMode} slot="icon" />
            Dark
          </Menu.Item>
          <Menu.Item id="system">
            <Icon as={SettingsBrightness} slot="icon" />
            System
          </Menu.Item>
        </Menu.Section>

        <Separator />

        {/* Font Size Section */}
        <Menu.Section
          label="Font Size"
          selectionMode="single"
          selectedKeys={[preferences.fontSize]}
          onSelectionChange={handleFontSizeChange}
        >
          <Menu.Item id="xs">Extra Small</Menu.Item>
          <Menu.Item id="sm">Small</Menu.Item>
          <Menu.Item id="md">Medium</Menu.Item>
          <Menu.Item id="lg">Large</Menu.Item>
          <Menu.Item id="xl">Extra Large</Menu.Item>
        </Menu.Section>

        <Separator />

        {/* Density Section */}
        <Menu.Section
          label="Density"
          selectionMode="single"
          selectedKeys={new Set([preferences.density])}
          onSelectionChange={handleDensityChange}
        >
          <Menu.Item id="compact">Compact</Menu.Item>
          <Menu.Item id="comfortable">Comfortable</Menu.Item>
          <Menu.Item id="spacious">Spacious</Menu.Item>
        </Menu.Section>

        <Separator />

        {/* Settings Management */}
        <Menu.Section label="Settings">
          <Menu.Item id="export" onAction={handleExportSettings}>
            <Icon as={FileDownload} slot="icon" />
            Export Settings
          </Menu.Item>
          <Menu.Item id="import" onAction={handleImportSettings}>
            <Icon as={FileUpload} slot="icon" />
            Import Settings
          </Menu.Item>
          <Menu.Item id="reset" onAction={handleResetSettings}>
            <Icon as={RestartAlt} slot="icon" />
            Reset to Defaults
          </Menu.Item>
        </Menu.Section>
      </Menu.Content>
    </Menu.Root>
  );
}
