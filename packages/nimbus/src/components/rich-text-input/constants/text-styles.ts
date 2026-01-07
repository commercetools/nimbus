/**
 * Text style definitions for rich text editor block formatting
 *
 * Used by:
 * - components/rich-text-toolbar.tsx: Renders text style dropdown menu with these options
 * - hooks/useToolbarState.ts: Manages current text style state and selection logic
 * - utils/text-style-utils.ts: Helper functions for text style operations
 * - utils/validation-utils.ts: Validates if block types are supported
 *
 * Purpose:
 * - Centralizes all available text styles and their visual properties
 * - Maps block type IDs to user-friendly labels and Chakra UI styling props
 * - Ensures consistent styling across the editor and UI controls
 */
export type TextStyleDefinition = {
  id: string;
  label: string;
  props: {
    textStyle: string;
    fontWeight: string;
  };
};

/**
 * Returns text style definitions with localized labels
 * @param format - Format function from useLocalizedStringFormatter
 */
export const getTextStyles = (
  format: (key: string) => string
): TextStyleDefinition[] => [
  {
    id: "paragraph",
    label: format("paragraph"),
    props: {
      textStyle: "md",
      fontWeight: "500",
    },
  },
  {
    id: "heading-one",
    label: format("headingOne"),
    props: {
      textStyle: "2xl",
      fontWeight: "500",
    },
  },
  {
    id: "heading-two",
    label: format("headingTwo"),
    props: {
      textStyle: "xl",
      fontWeight: "500",
    },
  },
  {
    id: "heading-three",
    label: format("headingThree"),
    props: {
      textStyle: "lg",
      fontWeight: "500",
    },
  },
  {
    id: "heading-four",
    label: format("headingFour"),
    props: {
      textStyle: "md",
      fontWeight: "500",
    },
  },
  {
    id: "heading-five",
    label: format("headingFive"),
    props: {
      textStyle: "xs",
      fontWeight: "500",
    },
  },
  {
    id: "block-quote",
    label: format("quote"),
    props: {
      textStyle: "md",
      fontWeight: "400",
    },
  },
];

/**
 * Available block types for text style detection
 *
 * Used by:
 * - hooks/useToolbarState.ts: Detects currently active block type in editor
 * - Excludes "paragraph" as it's the default/fallback type
 */
export const blockTypes = [
  "heading-one",
  "heading-two",
  "heading-three",
  "heading-four",
  "heading-five",
  "block-quote",
] as const;

export type BlockType = (typeof blockTypes)[number] | "paragraph";
