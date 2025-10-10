import type { DateInputRootProps } from "./date-input.slots";
import type { DateValue } from "react-aria";
import type { DateFieldProps } from "react-aria-components";

/**
 * Additional properties we want to exclude from the DateInput component.
 * These are either deprecated or not intended for use in this component.
 */
type ExcludedProps =
  // deprecated
  | "validationState"
  // handled by <FormField> component
  | "label"
  | "description"
  | "errorMessage"
  // chakra-ui props we don't want exposed
  | "css"
  | "colorScheme"
  | "unstyled"
  | "recipe"
  | "as"
  | "asChild";

type DateInputRecipeVariantProps = {
  /** Size variant */
  size?: "sm" | "md";
  /** Variant variant */
  variant?: "solid" | "ghost" | "plain";
};

/**
 * Main props interface for the DateInput component.
 *
 * We use the same pattern as TextInput to avoid type conflicts:
 * 1. Start with DateFieldProps as the base
 * 2. Merge with DateInputRootProps, excluding conflicting keys
 * 3. Add recipe variant props
 */
export type DateInputProps = DateInputRecipeVariantProps &
  DateFieldProps<DateValue> &
  Omit<DateInputRootProps, keyof DateFieldProps<DateValue> | ExcludedProps> & {
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
  };
