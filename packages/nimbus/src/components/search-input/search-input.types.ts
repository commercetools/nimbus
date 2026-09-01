import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
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

export type SearchInputTrailingElementSlotProps = HTMLChakraProps<"div">;

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
    /**
     * Element to display at the start of the input.
     * Respects text direction (left in LTR, right in RTL).
     *
     * Defaults to the search icon. Pass an element to replace it, or `null`
     * to render no leading element at all.
     *
     * **Accessibility**: decorative elements should be marked
     * `aria-hidden="true"`. An interactive element needs its own `aria-label`.
     *
     * @default <Search />
     */
    leadingElement?: React.ReactNode;
    /**
     * Optional element to display at the end of the input, before the clear
     * button. Respects text direction (right in LTR, left in RTL).
     *
     * **Accessibility**: decorative elements should be marked
     * `aria-hidden="true"`. An interactive element needs its own `aria-label`.
     */
    trailingElement?: React.ReactNode;
  };
