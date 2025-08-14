import type { Ref, FocusEventHandler } from "react";
import type { RichTextInputRootSlotProps } from "./rich-text-input.slots";

type DefaultExcludedProps = "css" | "asChild" | "as" | "onChange";

export interface RichTextInputProps
  extends Omit<RichTextInputRootSlotProps, DefaultExcludedProps | "children"> {
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
   * Whether the input is in an invalid state
   */
  isInvalid?: boolean;

  /**
   * Whether to focus the input when it mounts
   */
  autoFocus?: boolean;
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
