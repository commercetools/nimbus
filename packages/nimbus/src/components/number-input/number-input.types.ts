import type {
  HTMLChakraProps,
  UnstyledProp,
  ConditionalValue,
} from "@chakra-ui/react";
import { type InputProps as RaInputProps } from "react-aria-components";
import type {
  AriaButtonProps as RaButtonProps,
  AriaNumberFieldProps as RaNumberFieldProps,
} from "react-aria";
import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  NumberInputSize,
  NumberInputVariant,
} from "./number-input.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

export type NumberInputRecipeProps = {
  /**
   * Size variant of the number input
   * @default "md"
   */
  size?: ConditionalValue<NumberInputSize | undefined>;
  /**
   * Visual style variant of the number input
   * @default "solid"
   */
  variant?: ConditionalValue<NumberInputVariant | undefined>;
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type NumberInputRootSlotProps = HTMLChakraProps<
  "div",
  NumberInputRecipeProps
> & {
  name?: string;
};

export type NumberInputLeadingElementSlotProps = HTMLChakraProps<
  "div",
  NumberInputRecipeProps
>;

export type NumberInputTrailingElementSlotProps = HTMLChakraProps<
  "div",
  NumberInputRecipeProps
>;

export type NumberInputInputSlotProps = HTMLChakraProps<
  "input",
  NumberInputRecipeProps
> &
  RaInputProps;

export type NumberInputIncrementButtonSlotProps = HTMLChakraProps<
  "button",
  NumberInputRecipeProps
> &
  RaButtonProps;

export type NumberInputDecrementButtonSlotProps = HTMLChakraProps<
  "button",
  NumberInputRecipeProps
> &
  RaButtonProps;

// ============================================================
// HELPER TYPES
// ============================================================

export type ExcludedNumberInputProps = "onChange";

// ============================================================
// MAIN PROPS
// ============================================================

export type NumberInputProps = OmitInternalProps<
  NumberInputRootSlotProps,
  keyof RaNumberFieldProps | ExcludedNumberInputProps
> &
  RaNumberFieldProps & {
    /**
     * Ref forwarding to the input element
     */
    ref?: React.Ref<HTMLInputElement>;
    /**
     * Optional element to display at the start of the input
     * Respects text direction (left in LTR, right in RTL)
     */
    leadingElement?: React.ReactNode;
    /**
     * Optional element to display at the end of the input
     * Respects text direction (right in LTR, left in RTL)
     */
    trailingElement?: React.ReactNode;
  };
