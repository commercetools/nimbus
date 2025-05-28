import type { TimeInputRootProps } from "./time-input.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { timeInputRecipe } from "./time-input.recipe";
import type { TimeFieldStateOptions } from "react-stately";
import type { TimeValue } from "react-aria";

type OmittedProps =
  | keyof TimeFieldStateOptions<TimeValue>
  | "validationState"
  | "colorScheme"
  | "asChild";

/**
 * Main props interface for the TimeInput component.
 */
export interface TimeInputProps
  extends Omit<TimeInputRootProps, OmittedProps>,
    TimeFieldStateOptions<TimeValue>,
    RecipeVariantProps<typeof timeInputRecipe> {}
