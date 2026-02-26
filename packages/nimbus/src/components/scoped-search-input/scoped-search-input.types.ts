import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type ScopedSearchInputRecipeProps = {
  /**
   * Size variant of the scoped search input
   */
  size?: SlotRecipeProps<"nimbusScopedSearchInput">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type ScopedSearchInputRootSlotProps = HTMLChakraProps<
  "div",
  ScopedSearchInputRecipeProps
>;

export type ScopedSearchInputContainerSlotProps = HTMLChakraProps<"div">;

export type ScopedSearchInputSelectWrapperSlotProps = HTMLChakraProps<"div">;

export type ScopedSearchInputSearchWrapperSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

export type ScopedSearchInputValue = {
  /** Search text entered by user */
  text: string;
  /** Selected scope/category option */
  option: string;
};

export type ScopedSearchInputOption = {
  /** Display label for the option */
  label: string;
  /** Unique value for the option */
  value: string;
  /** Whether the option is disabled */
  isDisabled?: boolean;
};

export type ScopedSearchInputOptionGroup = {
  /** Group label */
  label: string;
  /** Options within the group */
  options: ScopedSearchInputOption[];
};

// ============================================================
// MAIN PROPS
// ============================================================

export type ScopedSearchInputProps = OmitInternalProps<
  ScopedSearchInputRootSlotProps,
  "value" | "onSubmit"
> & {
  /** Current value (text + selected option) */
  value: ScopedSearchInputValue;
  /** Callback when complete value changes */
  onValueChange?: (value: ScopedSearchInputValue) => void;
  /** Callback when only search text changes */
  onTextChange?: (text: string) => void;
  /** Callback when only option changes */
  onOptionChange?: (option: string) => void;
  /** Callback when search is submitted */
  onSubmit: (value: ScopedSearchInputValue) => void;
  /** Callback when search is reset/cleared */
  onReset?: () => void;
  /** Available scope options or option groups */
  options: ScopedSearchInputOption[] | ScopedSearchInputOptionGroup[];
  /** Placeholder for scope selector */
  selectPlaceholder?: string;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Aria label for scope selector */
  selectAriaLabel?: string;
  /** Aria label for search input */
  searchAriaLabel?: string;
  /** Whether to show clear button */
  isClearable?: boolean;
  /** Whether the input is disabled */
  isDisabled?: boolean;
  /** Whether the input is read-only */
  isReadOnly?: boolean;
  /** Whether the input has validation errors */
  isInvalid?: boolean;
  /** Whether the input is required */
  isRequired?: boolean;
  /** Unique identifier */
  id?: string;
  /** ID of element describing the input */
  "aria-describedby"?: string;
  /** ID of element labeling the input */
  "aria-labelledby"?: string;
};
