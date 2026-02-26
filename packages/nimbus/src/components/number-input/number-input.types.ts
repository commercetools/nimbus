import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import { type InputProps as RaInputProps } from "react-aria-components";
import type {
  AriaButtonProps as RaButtonProps,
  AriaNumberFieldProps as RaNumberFieldProps,
} from "react-aria";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

export type NumberInputRecipeProps = {
  /**
   * Size variant of the number input
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusNumberInput">["size"];
  /**
   * Visual style variant of the number input
   * @default "solid"
   */
  variant?: SlotRecipeProps<"nimbusNumberInput">["variant"];
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
