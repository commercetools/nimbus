import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { DateValue } from "react-aria";
import type { DateFieldProps } from "react-aria-components";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
type DateInputRecipeProps = SlotRecipeProps<"dateInput"> & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 *
 * We exclude props that conflict with React Aria's DateFieldProps:
 * - onChange: HTML's FormEventHandler vs React Aria's (value: DateValue | null) => void
 * - value/defaultValue: HTML's string[] vs React Aria's DateValue | null
 */
export type DateInputRootProps = Omit<
  HTMLChakraProps<"div", DateInputRecipeProps>,
  "onChange" | "value" | "defaultValue"
>;

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

/**
 * Main props interface for the DateInput component.
 *
 * We use the same pattern as TextInput to avoid type conflicts:
 * 1. Start with DateFieldProps as the base
 * 2. Merge with DateInputRootProps, excluding conflicting keys
 * 3. Add recipe variant props
 */
export type DateInputProps = DateInputRootProps &
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
