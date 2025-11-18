import { Fragment, type ReactNode } from "react";
import { Flex, Stack, Text } from "@/components";
import type { NimbusColorPalette } from "@/type-utils";
import {
  BRAND_COLOR_PALETTES,
  SEMANTIC_COLOR_PALETTES,
  SYSTEM_COLOR_PALETTES,
} from "@/constants";

/**
 * Grouped palette configurations for organized display.
 * Each group includes a descriptive name and its associated palette array.
 */
const COLOR_PALETTE_GROUPS = [
  { name: "Semantic Color Palettes", palettes: SEMANTIC_COLOR_PALETTES },
  { name: "Brand Color Palettes", palettes: BRAND_COLOR_PALETTES },
  { name: "System Color Palettes", palettes: SYSTEM_COLOR_PALETTES },
] as const;

/**
 * Props for the DisplayColorPalettes component.
 */
type DisplayColorPalettesProps = {
  /**
   * Render function that receives a color palette string and returns a ReactNode.
   * This function is called for each palette in each palette group, allowing
   * components to be rendered with different colorPalette props.
   *
   * @example
   * <DisplayColorPalettes>
   *   {(palette) => <Badge colorPalette={palette}>{palette}</Badge>}
   * </DisplayColorPalettes>
   */
  children: (palette: NimbusColorPalette) => ReactNode;
};

/**
 * Component for displaying all color palettes in organized groups.
 *
 * This utility component iterates through semantic, brand, and system color
 * palettes, rendering a custom component for each palette using the provided
 * render function. Useful for showcasing component variations across all
 * available color palettes in Storybook stories.
 *
 * @example
 * ```tsx
 * <DisplayColorPalettes>
 *   {(palette) => (
 *     <Badge colorPalette={palette}>
 *       {palette}
 *     </Badge>
 *   )}
 * </DisplayColorPalettes>
 * ```
 */
export const DisplayColorPalettes = ({
  children,
}: DisplayColorPalettesProps) => (
  <Stack gap="600">
    {COLOR_PALETTE_GROUPS.map(({ name, palettes }) => (
      <Stack key={name}>
        <Text as="label">{name}</Text>
        <Flex gap="400" alignItems="center" flexWrap="wrap">
          {palettes.map((palette) => (
            <Fragment key={palette}>{children(palette)}</Fragment>
          ))}
        </Flex>
      </Stack>
    ))}
  </Stack>
);
