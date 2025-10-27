/**
 * Color Theme Menu Component
 *
 * Allows users to change the primary color palette used throughout the app.
 * Dynamically overrides Chakra's primary palette CSS variables with the selected color.
 */

import { Menu, IconButton, Icon, Separator, Box } from "@commercetools/nimbus";
import { Palette, RestartAlt } from "@commercetools/nimbus-icons";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";

// Available Radix color palettes (excluding ignored ones)
const RADIX_COLORS = [
  "amber",
  "blue",
  "bronze",
  "brown",
  "crimson",
  "cyan",
  "gold",
  "grass",
  "gray",
  "green",
  "indigo",
  "iris",
  "jade",
  "lime",
  "mint",
  "orange",
  "pink",
  "plum",
  "purple",
  "red",
  "ruby",
  "sky",
  "teal",
  "tomato",
  "violet",
  "yellow",
] as const;

// Brand colors
const BRAND_COLORS = ["ctviolet", "ctyellow", "ctteal"] as const;

type ColorPalette =
  | (typeof RADIX_COLORS)[number]
  | (typeof BRAND_COLORS)[number];

// Default primary color
const DEFAULT_PRIMARY_COLOR: ColorPalette = "ctviolet";

// Store the selected primary color in localStorage
export const primaryColorAtom = atomWithStorage<ColorPalette>(
  "nimbus-docs-primary-color",
  DEFAULT_PRIMARY_COLOR
);

const STYLE_TAG_ID = "nimbus-primary-color-override";

/**
 * Generates CSS to override the primary palette with the selected color
 */
function generatePrimaryColorCSS(colorName: ColorPalette): string {
  return `
:root {
  --nimbus-colors-primary-1: var(--nimbus-colors-${colorName}-1);
  --nimbus-colors-primary-2: var(--nimbus-colors-${colorName}-2);
  --nimbus-colors-primary-3: var(--nimbus-colors-${colorName}-3);
  --nimbus-colors-primary-4: var(--nimbus-colors-${colorName}-4);
  --nimbus-colors-primary-5: var(--nimbus-colors-${colorName}-5);
  --nimbus-colors-primary-6: var(--nimbus-colors-${colorName}-6);
  --nimbus-colors-primary-7: var(--nimbus-colors-${colorName}-7);
  --nimbus-colors-primary-8: var(--nimbus-colors-${colorName}-8);
  --nimbus-colors-primary-9: var(--nimbus-colors-${colorName}-9);
  --nimbus-colors-primary-10: var(--nimbus-colors-${colorName}-10);
  --nimbus-colors-primary-11: var(--nimbus-colors-${colorName}-11);
  --nimbus-colors-primary-12: var(--nimbus-colors-${colorName}-12);
  --nimbus-colors-primary-contrast: var(--nimbus-colors-${colorName}-contrast);
}
`.trim();
}

/**
 * Applies the primary color override by injecting a style tag
 */
function applyPrimaryColor(colorName: ColorPalette) {
  // Remove existing style tag if present
  const existingTag = document.getElementById(STYLE_TAG_ID);
  if (existingTag) {
    existingTag.remove();
  }

  // Create and inject new style tag
  const styleTag = document.createElement("style");
  styleTag.id = STYLE_TAG_ID;
  styleTag.textContent = generatePrimaryColorCSS(colorName);
  document.head.appendChild(styleTag);
}

/**
 * Gets a display-friendly name for a color
 */
function getColorDisplayName(colorName: ColorPalette): string {
  // Capitalize first letter
  return colorName.charAt(0).toUpperCase() + colorName.slice(1);
}

export function ColorThemeMenu() {
  const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);

  // Apply the color on mount and when it changes
  useEffect(() => {
    applyPrimaryColor(primaryColor);
  }, [primaryColor]);

  const handleColorChange = (selection: "all" | Set<React.Key>) => {
    if (selection === "all") return;
    const color = Array.from(selection)[0] as ColorPalette;
    if (color) {
      setPrimaryColor(color);
    }
  };

  const handleReset = () => {
    setPrimaryColor(DEFAULT_PRIMARY_COLOR);
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton aria-label="Primary Color" size="xs" variant="ghost">
          <Icon as={Palette} slot="icon" />
        </IconButton>
      </Menu.Trigger>

      <Menu.Content>
        {/* Brand Colors Section */}
        <Menu.Section
          label="Brand Colors"
          selectionMode="single"
          selectedKeys={new Set([primaryColor])}
          onSelectionChange={handleColorChange}
        >
          {BRAND_COLORS.map((color) => (
            <Menu.Item key={color} id={color}>
              <Box
                slot="icon"
                borderRadius="full"
                boxSize=".75em"
                backgroundColor={color}
                outline="2px solid"
                outlineOffset="2px"
                outlineColor={color}
              />
              {getColorDisplayName(color)}
            </Menu.Item>
          ))}
        </Menu.Section>

        <Separator />

        {/* Radix Colors Section */}
        <Menu.Section
          label="System Colors"
          selectionMode="single"
          selectedKeys={new Set([primaryColor])}
          onSelectionChange={handleColorChange}
        >
          {RADIX_COLORS.map((color) => (
            <Menu.Item key={color} id={color}>
              <Box
                slot="icon"
                borderRadius="full"
                boxSize=".75em"
                backgroundColor={color}
                outline="2px solid"
                outlineOffset="2px"
                outlineColor={color}
              />
              {getColorDisplayName(color)}
            </Menu.Item>
          ))}
        </Menu.Section>

        <Separator />

        {/* Reset to Default */}
        <Menu.Item id="reset" onAction={handleReset}>
          <Icon as={RestartAlt} slot="icon" />
          Reset to Default
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}
