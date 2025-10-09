import type { TextInputProps } from "../text-input/text-input.types";

/**
 * Type for PasswordInput component props
 * Extends TextInputProps but omits the type prop since it's controlled internally
 * We want to keep this as an explicit type to allow for future additions
 */
export type PasswordInputProps = Omit<
  TextInputProps,
  "type" | "trailingElement"
>;
