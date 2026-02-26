import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react/styled-system";
import type { SearchFieldProps as RaSearchFieldProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type SearchInputRecipeProps = {
  /**
   * Size variant of the search input
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusSearchInput">["size"];
  /**
   * Visual style variant of the search input
   * @default "solid"
   */
  variant?: SlotRecipeProps<"nimbusSearchInput">["variant"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type SearchInputRootSlotProps = HTMLChakraProps<
  "div",
  SearchInputRecipeProps
>;

export type SearchInputLeadingElementSlotProps = HTMLChakraProps<"div">;

export type SearchInputInputSlotProps = HTMLChakraProps<"input">;

// ============================================================
// MAIN PROPS
// ============================================================

export type SearchInputProps = OmitInternalProps<
  SearchInputRootSlotProps,
  keyof RaSearchFieldProps
> &
  Omit<RaSearchFieldProps, "ref"> & {
    /**
     * Ref forwarding to the input element
     */
    ref?: React.Ref<HTMLInputElement>;
    /**
     * Placeholder text for the search input
     */
    placeholder?: string;
  };
