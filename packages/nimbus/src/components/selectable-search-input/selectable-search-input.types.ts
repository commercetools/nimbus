import type { SelectableSearchInputRootSlotProps } from "./selectable-search-input.slots";

/**
 * Value structure for SelectableSearchInput
 */
export interface SelectableSearchInputValue {
  /**
   * The text in the search input
   */
  text: string;
  /**
   * The selected option key from the select dropdown
   */
  option: string;
}

/**
 * Option definition for the select dropdown
 */
export interface SelectableSearchInputOption {
  /**
   * Display label for the option
   */
  label: string;
  /**
   * Unique value/key for the option
   */
  value: string;
  /**
   * Whether the option is disabled
   */
  isDisabled?: boolean;
}

/**
 * Option group definition for grouped options
 */
export interface SelectableSearchInputOptionGroup {
  /**
   * Group label
   */
  label: string;
  /**
   * Options in this group
   */
  options: SelectableSearchInputOption[];
}

export interface SelectableSearchInputProps
  extends Omit<
    SelectableSearchInputRootSlotProps,
    "value" | "onSubmit" | "as" | "asChild"
  > {
  /**
   * The current value (controlled)
   */
  value: SelectableSearchInputValue;

  /**
   * Callback when the unified value changes
   */
  onValueChange?: (value: SelectableSearchInputValue) => void;

  /**
   * Callback when the text input changes
   */
  onTextChange?: (text: string) => void;

  /**
   * Callback when the select option changes
   */
  onOptionChange?: (option: string) => void;

  /**
   * Callback when search is submitted (Enter key or submit button)
   */
  onSubmit: (value: SelectableSearchInputValue) => void;

  /**
   * Callback when reset/clear is triggered
   */
  onReset?: () => void;

  /**
   * Options for the select dropdown
   */
  options: SelectableSearchInputOption[] | SelectableSearchInputOptionGroup[];

  /**
   * Placeholder text for the select dropdown
   */
  selectPlaceholder?: string;

  /**
   * Placeholder text for the search input
   */
  searchPlaceholder?: string;

  /**
   * Accessible label for the select dropdown
   */
  selectAriaLabel?: string;

  /**
   * Accessible label for the search input
   */
  searchAriaLabel?: string;

  /**
   * Whether to show the clear button in the search input
   * @default true
   */
  isClearable?: boolean;

  /**
   * Whether to show the submit button
   * @default true
   */
  showSubmitButton?: boolean;

  /**
   * Whether the component is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the component is read-only
   * @default false
   */
  isReadOnly?: boolean;

  /**
   * Whether the component is in an invalid state
   * @default false
   */
  isInvalid?: boolean;

  /**
   * Whether the component is required
   * @default false
   */
  isRequired?: boolean;

  /**
   * ID for the component (used for ARIA relationships)
   */
  id?: string;

  /**
   * ID of element describing the component
   */
  "aria-describedby"?: string;

  /**
   * ID of element labeling the component
   */
  "aria-labelledby"?: string;
}
