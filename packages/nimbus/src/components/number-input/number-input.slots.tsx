import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import { Button as RaButton, Input as RaInput } from "react-aria-components";
import type {
  NumberInputRootSlotProps,
  NumberInputLeadingElementSlotProps,
  NumberInputTrailingElementSlotProps,
  NumberInputInputSlotProps,
  NumberInputIncrementButtonSlotProps,
  NumberInputDecrementButtonSlotProps,
} from "./number-input.types";

const { withContext, withProvider } = createSlotRecipeContext({
  key: "nimbusNumberInput",
});

/**
 * Root component that provides the styling context for the NumberInput component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const NumberInputRootSlot = withProvider<
  HTMLDivElement,
  NumberInputRootSlotProps
>("div", "root");

export const NumberInputLeadingElementSlot = withContext<
  HTMLDivElement,
  NumberInputLeadingElementSlotProps
>("div", "leadingElement");

export const NumberInputTrailingElementSlot = withContext<
  HTMLDivElement,
  NumberInputTrailingElementSlotProps
>("div", "trailingElement");

/**
 * Input slot for NumberInput component.
 * Receives the styled classes for the actual input element.
 */
export const NumberInputInputSlot = withContext<
  HTMLInputElement,
  NumberInputInputSlotProps
>(RaInput, "input");

/**
 * Increment button slot for NumberInput component.
 * Uses react-aria Button for accessibility and interaction handling.
 */
export const NumberInputIncrementButtonSlot = withContext<
  typeof RaButton,
  NumberInputIncrementButtonSlotProps
>(RaButton, "incrementButton");

/**
 * Decrement button slot for NumberInput component.
 * Uses react-aria Button for accessibility and interaction handling.
 */
export const NumberInputDecrementButtonSlot = withContext<
  typeof RaButton,
  NumberInputDecrementButtonSlotProps
>(RaButton, "decrementButton");
