import type { ReactNode } from "react";
import { Flex, Stack, Text } from "@commercetools/nimbus";
import type { NimbusColorPalette } from "@/type-utils";
import { COLOR_PALETTE_GROUPS } from "./constants";

/**
 * Props for the DisplayColors component.
 */
type DisplayColorPalettesProps = {
  /**
   * Render function that receives a color palette string and returns a ReactNode.
   * This function is called for each palette in each palette group, allowing
   * components to be rendered with different colorPalette props.
   *
   * @example
   * <DisplayColors>
   *   {(palette) => <Badge colorPalette={palette}>{palette}</Badge>}
   * </DisplayColors>
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
 * <DisplayColors>
 *   {(palette) => (
 *     <Badge colorPalette={palette}>
 *       {palette}
 *     </Badge>
 *   )}
 * </DisplayColors>
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
          {palettes.map((palette) => children(palette))}
        </Flex>
      </Stack>
    ))}
  </Stack>
);
