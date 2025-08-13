import type { DateInputRootProps } from "./date-input.slots";
import type { RecipeVariantProps } from "@chakra-ui/react/styled-system";
import { dateInputSlotRecipe } from "./date-input.recipe";
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

/**
 * Main props interface for the DateInput component.
 *
 * We use the same pattern as TextInput to avoid type conflicts:
 * 1. Start with DateFieldProps as the base
 * 2. Merge with DateInputRootProps, excluding conflicting keys
 * 3. Add recipe variant props
 */
export interface DateInputProps
  extends DateFieldProps<DateValue>,
    Omit<DateInputRootProps, keyof DateFieldProps<DateValue> | ExcludedProps>,
    RecipeVariantProps<typeof dateInputSlotRecipe> {}
