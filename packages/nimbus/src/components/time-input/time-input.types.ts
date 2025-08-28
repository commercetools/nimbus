import type { TimeInputRootProps } from "./time-input.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { timeInputRecipe } from "./time-input.recipe";
import type { TimeFieldStateOptions } from "react-stately";
import type { TimeValue } from "react-aria";

/**
 * Properties from TimeFieldStateOptions that would conflict with similarly named
 * properties in TimeInputRootProps. We use this to prevent TypeScript interface
 * merging conflicts by prioritizing the TimeFieldStateOptions implementation.
 *
 * Examples include: value, defaultValue, onChange, onBlur, onFocus, etc.
 */
type ConflictingFieldStateProps = keyof TimeFieldStateOptions<TimeValue>;

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
 * Main props interface for the TimeInput component.
 *
 * We use Omit to remove:
 * 1. Conflicting props from TimeInputRootProps to avoid TypeScript errors
 * 2. Explicitly excluded props that we don't want users to access
 */
export interface TimeInputProps
  extends Omit<TimeInputRootProps, ConflictingFieldStateProps | ExcludedProps>,
    Omit<TimeFieldStateOptions<TimeValue>, ExcludedProps>,
    RecipeVariantProps<typeof timeInputRecipe> {
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
  }
