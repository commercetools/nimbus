import { richTextInputMessages } from "../rich-text-input.messages";

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
 * @param locale - Locale string for formatting messages
 */
export const getTextStyles = (locale: string): TextStyleDefinition[] => [
  {
    id: "paragraph",
    label: richTextInputMessages.getStringForLocale("paragraph", locale),
    props: {
      textStyle: "md",
      fontWeight: "500",
    },
  },
  {
    id: "heading-one",
    label: richTextInputMessages.getStringForLocale("headingOne", locale),
    props: {
      textStyle: "2xl",
      fontWeight: "500",
    },
  },
  {
    id: "heading-two",
    label: richTextInputMessages.getStringForLocale("headingTwo", locale),
    props: {
      textStyle: "xl",
      fontWeight: "500",
    },
  },
  {
    id: "heading-three",
    label: richTextInputMessages.getStringForLocale("headingThree", locale),
    props: {
      textStyle: "lg",
      fontWeight: "500",
    },
  },
  {
    id: "heading-four",
    label: richTextInputMessages.getStringForLocale("headingFour", locale),
    props: {
      textStyle: "md",
      fontWeight: "500",
    },
  },
  {
    id: "heading-five",
    label: richTextInputMessages.getStringForLocale("headingFive", locale),
    props: {
      textStyle: "xs",
      fontWeight: "500",
    },
  },
  {
    id: "block-quote",
    label: richTextInputMessages.getStringForLocale("quote", locale),
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
