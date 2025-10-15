import type { TextInputProps } from "../text-input/text-input.types";

// ============================================================
// MAIN PROPS
// ============================================================

export type PasswordInputProps = Omit<
  TextInputProps,
  "type" | "trailingElement"
>;
