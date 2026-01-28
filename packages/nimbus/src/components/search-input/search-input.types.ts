import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { HTMLChakraProps, ConditionalValue } from "@chakra-ui/react";
import type { SearchFieldProps as RaSearchFieldProps } from "react-aria-components";
import type {
  SearchInputSize,
  SearchInputVariant,
} from "./search-input.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type SearchInputRecipeProps = {
  /**
   * Size variant of the search input
   * @default "md"
   */
  size?: ConditionalValue<SearchInputSize | undefined>;
  /**
   * Visual style variant of the search input
   * @default "solid"
   */
  variant?: ConditionalValue<SearchInputVariant | undefined>;
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
