import type { Ref, FocusEventHandler } from "react";
import type { RecipeVariantProps } from "@chakra-ui/react";
import type { RichTextInputSlotProps } from "./rich-text-input.slots";
import type { richTextInputRecipe } from "./rich-text-input.recipe";

type DefaultExcludedProps = "css" | "asChild" | "as";

export interface RichTextInputProps
  extends Omit<
    RichTextInputSlotProps,
    DefaultExcludedProps | "children" | "size" | "variant"
  > {
  /**
   * The ref for the rich text input component
   */
  ref?: Ref<HTMLDivElement>;

  /**
   * The HTML value of the rich text input
   */
  value?: string;

  /**
   * The default HTML value of the rich text input (uncontrolled)
   */
  defaultValue?: string;

  /**
   * Called when the value changes
   */
  onChange?: (value: string) => void;

  /**
   * Called when the input is focused
   */
  onFocus?: FocusEventHandler<HTMLDivElement>;

  /**
   * Called when the input is blurred
   */
  onBlur?: FocusEventHandler<HTMLDivElement>;

  /**
   * Placeholder text to show when the editor is empty
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   */
  isDisabled?: boolean;

  /**
   * Whether the input is read-only
   */
  isReadOnly?: boolean;

  /**
   * Whether the input has an error
   */
  hasError?: boolean;

  /**
   * Whether the input has a warning
   */
  hasWarning?: boolean;

  /**
   * Whether to focus the input when it mounts
   */
  autoFocus?: boolean;

  /**
   * Size variant of the rich text input
   */
  size?: RecipeVariantProps<typeof richTextInputRecipe>["size"];

  /**
   * Visual variant of the rich text input
   */
  variant?: RecipeVariantProps<typeof richTextInputRecipe>["variant"];
}

// Event types for internal use
export interface RichTextChangeEvent {
  target: {
    value: string;
  };
}

// Formatting types
export type FormatType =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "code"
  | "superscript"
  | "subscript";

export type BlockType =
  | "paragraph"
  | "heading-one"
  | "heading-two"
  | "heading-three"
  | "heading-four"
  | "heading-five"
  | "block-quote"
  | "bulleted-list"
  | "numbered-list"
  | "list-item";

export type ElementType = FormatType | BlockType | "link";
