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
export interface TextStyleDefinition {
  id: string;
  label: string;
  props: {
    textStyle: string;
    fontWeight: string;
  };
}

export const textStyles: TextStyleDefinition[] = [
  {
    id: "paragraph",
    label: "Paragraph",
    props: {
      textStyle: "md",
      fontWeight: "500",
    },
  },
  {
    id: "heading-one",
    label: "Heading 1",
    props: {
      textStyle: "2xl",
      fontWeight: "500",
    },
  },
  {
    id: "heading-two",
    label: "Heading 2",
    props: {
      textStyle: "xl",
      fontWeight: "500",
    },
  },
  {
    id: "heading-three",
    label: "Heading 3",
    props: {
      textStyle: "lg",
      fontWeight: "500",
    },
  },
  {
    id: "heading-four",
    label: "Heading 4",
    props: {
      textStyle: "md",
      fontWeight: "500",
    },
  },
  {
    id: "heading-five",
    label: "Heading 5",
    props: {
      textStyle: "xs",
      fontWeight: "500",
    },
  },
  {
    id: "block-quote",
    label: "Quote",
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
