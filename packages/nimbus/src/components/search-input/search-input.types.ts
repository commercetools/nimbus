import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { SearchFieldProps } from "react-aria-components";

type SearchInputRecipeProps = {
  size?: SlotRecipeProps<"searchInput">["size"];
  variant?: SlotRecipeProps<"searchInput">["variant"];
};

export type SearchInputRootProps = HTMLChakraProps<
  "div",
  SearchInputRecipeProps
>;

export type SearchInputLeadingElementProps = HTMLChakraProps<"div">;

export type SearchInputInputProps = HTMLChakraProps<"input">;

/**
 * Props for the SearchInput component.
 * Built on React Aria's SearchField for accessibility.
 */
export type SearchInputProps = Omit<
  SearchInputRootProps,
  keyof SearchFieldProps | "as" | "asChild"
> &
  Omit<SearchFieldProps, "ref"> & {
    /**
     * React ref to be forwarded to the input element
     */
    ref?: React.Ref<HTMLInputElement>;

    /**
     * Placeholder text for the input
     */
    placeholder?: string;
  };
