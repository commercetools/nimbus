import type { TextInputProps } from "../text-input/text-input.types";

/**
 * Interface for PasswordInput component props
 * Extends TextInputProps but omits the type prop since it's controlled internally
 * We want to keep this as an explicit interface to allow for future additions
 */
export interface PasswordInputProps extends Omit<TextInputProps, "type"> {
  /**
   * Optional element to display at the start of the input
   * Will respect text direction (left in LTR, right in RTL)
   */
  leadingElement?: React.ReactNode;
}
