import type { TextInputRootProps } from "./text-input.slots";
import type { TextFieldProps } from "react-aria-components";

// Helper type to merge props and resolve conflicts
export type TextInputProps = Omit<TextInputRootProps, "autoComplete"> &
  TextFieldProps;
