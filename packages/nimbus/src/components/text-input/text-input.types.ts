import type { TextInputRootProps } from "./text-input.slots";
import type { TextFieldProps } from "react-aria-components";

export interface TextInputProps
  extends Omit<TextFieldProps, "ref">,
    Omit<TextInputRootProps, keyof TextFieldProps | "as" | "asChild"> {
  /**
   * React ref to be forwarded to the input element
   */
  ref?: React.Ref<HTMLInputElement>;
  /**
   * Optional element to display at the start of the input
   * Will respect text direction (left in LTR, right in RTL)
   */
  leadingElement?: React.ReactNode;

  /**
   * Optional element to display at the end of the input
   * Will respect text direction (right in LTR, left in RTL)
   */
  trailingElement?: React.ReactNode;
  placeholder?: string;
}
