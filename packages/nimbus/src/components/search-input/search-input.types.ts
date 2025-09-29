import type { SearchInputRootProps } from "./search-input.slots";
import type { SearchFieldProps } from "react-aria-components";

export interface SearchInputProps
  extends Omit<SearchFieldProps, "ref">,
    Omit<SearchInputRootProps, keyof SearchFieldProps | "as" | "asChild"> {
  /**
   * React ref to be forwarded to the input element
   */
  ref?: React.Ref<HTMLInputElement>;

  /**
   * Placeholder text for the input
   */
  placeholder?: string;
}
