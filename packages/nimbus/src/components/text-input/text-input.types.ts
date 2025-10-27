import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type {
  TextFieldProps as RaTextFieldProps,
  InputProps as RaInputProps,
} from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type TextInputRecipeProps = {
  /**
   * Size variant of the text input
   * @default "md"
   */
  size?: SlotRecipeProps<"textInput">["size"];
  /**
   * Visual style variant of the text input
   * @default "solid"
   */
  variant?: SlotRecipeProps<"textInput">["variant"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type TextInputRootSlotProps = HTMLChakraProps<
  "div",
  TextInputRecipeProps
>;

export type TextInputLeadingElementSlotProps = HTMLChakraProps<"div">;

export type TextInputInputSlotProps = HTMLChakraProps<"input">;

export type TextInputTrailingElementSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

export type TextInputProps = Omit<
  TextInputRootSlotProps,
  keyof RaTextFieldProps | "as" | "asChild"
> &
  Omit<RaTextFieldProps, "ref"> & {
    /**
     * Ref forwarding to the input element
     */
    ref?: React.Ref<HTMLInputElement>;
    /**
     * Optional element to display at the start of the input
     * Respects text direction (left in LTR, right in RTL)
     */
    leadingElement?: React.ReactNode;
    /**
     * Optional element to display at the end of the input
     * Respects text direction (right in LTR, left in RTL)
     */
    trailingElement?: React.ReactNode;
    /**
     * Placeholder text for the input
     */
    placeholder?: string;
  };

// ============================================================
// CONTEXT VALUE
// ============================================================

/**
 * Extended InputContext value type that accepts both React Aria props
 * and DOM attributes for maximum flexibility when using TextInput.Context.
 *
 * @example
 * ```tsx
 * <TextInput.Context value={{ isDisabled: true, isRequired: true }}>
 *   <TextInput placeholder="Email" />
 * </TextInput.Context>
 * ```
 */
export type TextInputContextValue = RaInputProps &
  RaTextFieldProps & {
    /**
     * DOM disabled attribute
     */
    disabled?: boolean;
    /**
     * DOM required attribute
     */
    required?: boolean;
    /**
     * DOM readOnly attribute
     */
    readOnly?: boolean;
    /**
     * ARIA invalid attribute
     */
    "aria-invalid"?: boolean | "true" | "false";
  };
