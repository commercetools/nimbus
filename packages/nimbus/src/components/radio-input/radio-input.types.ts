import type { HTMLChakraProps, RecipeVariantProps } from "@chakra-ui/react";
import { radioInputSlotRecipe } from "./radio-input.recipe";
import type { AriaRadioProps } from "react-aria";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type RadioInputVariantProps = RadioInputRootProps &
  RecipeVariantProps<typeof radioInputSlotRecipe> &
  AriaRadioProps;

/**
 * Main props interface for the RadioInput component.
 * Extends RadioInputVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface RadioInputProps extends RadioInputVariantProps {
  children?: React.ReactNode;
  value: string;
  ref?: React.Ref<HTMLInputElement>;
  isInvalid?: boolean;
  isDisabled?: boolean;
}

/**
 * Props for the radio group container component.
 * Manages a set of radio inputs and their shared state.
 */
export interface RadioGroupProps {
  label?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
}

/**
 * SLOT Types.
 * All accept Chakra system props & recipe variants for styling.
 */

/**
 * Typically a <label> that wraps the entire radio input, including the indicator and label/content.
 */
export interface RadioInputRootProps
  extends HTMLChakraProps<
    "label",
    RecipeVariantProps<typeof radioInputSlotRecipe>
  > {}

/**
 * Renders as a <span> and displays the main label text next to the radio indicator.
 */
export interface RadioInputLabelProps extends HTMLChakraProps<"span"> {}

/**
 * Renders as a <span> and displays the visual indicator (checked/unchecked icon) for the radio input.
 */
export interface RadioInputIndicatorProps extends HTMLChakraProps<"span"> {}
