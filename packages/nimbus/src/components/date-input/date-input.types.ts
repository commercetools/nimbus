import type { DateInputRootProps } from "./date-input.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { dateInputRecipe } from "./date-input.recipe";
import type { DateFieldStateOptions } from "react-stately";
import type { DateValue } from "react-aria";

/**
 * Properties from DateFieldStateOptions that would conflict with similarly named
 * properties in DateInputRootProps. We use this to prevent TypeScript interface
 * merging conflicts by prioritizing the DateFieldStateOptions implementation.
 *
 * Examples include: value, defaultValue, onChange, onBlur, onFocus, etc.
 */
type ConflictingFieldStateProps = keyof DateFieldStateOptions<DateValue>;

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
 * We use Omit to remove:
 * 1. Conflicting props from DateInputRootProps to avoid TypeScript errors
 * 2. Explicitly excluded props that we don't want users to access
 */
export interface DateInputProps
  extends Omit<DateInputRootProps, ConflictingFieldStateProps | ExcludedProps>,
    Omit<DateFieldStateOptions<DateValue>, ExcludedProps>,
    RecipeVariantProps<typeof dateInputRecipe> {}
