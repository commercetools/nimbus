import type { TimeFieldProps } from "react-aria-components";
import type { TimeValue } from "react-aria";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

/**
 * Base recipe props type that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
type TimeInputRecipeProps = {
  size?: SlotRecipeProps<"timeInput">["size"];
  variant?: SlotRecipeProps<"timeInput">["variant"];
} & UnstyledProp;

/**
 * Root props type that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */

export type TimeInputRootProps = HTMLChakraProps<"div", TimeInputRecipeProps>;

export type TimeInputLeadingElementProps = HTMLChakraProps<
  "div",
  TimeInputRecipeProps
>;

export type TimeInputTrailingElementProps = HTMLChakraProps<
  "div",
  TimeInputRecipeProps
>;

/**
 * Properties from TimeFieldProps that would conflict with similarly named
 * properties in TimeInputRootProps.
 *
 * Examples include: value, defaultValue, onChange, onBlur, onFocus, etc.
 */
type ConflictingFieldStateProps = keyof TimeFieldProps<TimeValue>;

/**
 * Additional properties we want to exclude from the TimeInput component.
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

/**
 * Main props type for the TimeInput component.
 *
 * We use Omit to remove:
 * 1. Conflicting props from TimeInputRootProps to avoid TypeScript errors
 * 2. Explicitly excluded props that we don't want users to access
 */
export type TimeInputProps = Omit<
  TimeInputRootProps,
  ConflictingFieldStateProps | ExcludedProps
> &
  Omit<TimeFieldProps<TimeValue>, ExcludedProps> & {
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
