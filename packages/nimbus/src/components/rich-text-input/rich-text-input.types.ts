import type { Ref, FocusEventHandler } from "react";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type RichTextInputRecipeProps = SlotRecipeProps<"nimbusRichTextInput">;

// ============================================================
// SLOT PROPS
// ============================================================

export type RichTextInputRootSlotProps = HTMLChakraProps<
  "div",
  RichTextInputRecipeProps & UnstyledProp
>;

export type RichTextInputToolbarSlotProps = HTMLChakraProps<"div">;

export type RichTextInputEditableSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

type DefaultExcludedProps = "css" | "asChild" | "as" | "onChange";

// ============================================================
// MAIN PROPS
// ============================================================

export type RichTextInputProps = Omit<
  RichTextInputRootSlotProps,
  DefaultExcludedProps | "children"
> & {
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
};
