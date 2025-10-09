import type { SearchInputRootProps } from "./search-input.slots";
import type { SearchFieldProps } from "react-aria-components";

type SearchInputRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "sm" | "md";
  /**
   * Variant variant
   * @default "solid"
   */
  variant?: "solid" | "ghost";
};

/**
 * Props for the SearchInput component.
 * Built on React Aria's SearchField for accessibility.
 */
export type SearchInputProps = SearchInputRecipeVariantProps &
  Omit<SearchFieldProps, "ref"> &
  Omit<SearchInputRootProps, keyof SearchFieldProps | "as" | "asChild"> & {
    /**
     * React ref to be forwarded to the input element
     */
    ref?: React.Ref<HTMLInputElement>;

    /**
     * Placeholder text for the input
     */
    placeholder?: string;
  };
