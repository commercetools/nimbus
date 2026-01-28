import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { HTMLChakraProps, ConditionalValue } from "@chakra-ui/react";
import type {
  RadioGroupProps as RaRadioGroupProps,
  RadioProps as RaRadioProps,
} from "react-aria-components";
import type { RadioInputOrientation } from "./radio-input.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type RadioInputRecipeProps = {
  /**
   * Layout orientation for radio options
   * @default "vertical"
   */
  orientation?: ConditionalValue<RadioInputOrientation | undefined>;
};

// ============================================================
// SLOT PROPS
// ============================================================

export type RadioInputRootSlotProps = HTMLChakraProps<
  "div",
  RadioInputRecipeProps
>;

export type RadioInputOptionSlotProps = HTMLChakraProps<"span">;

// ============================================================
// HELPER TYPES
// ============================================================

type RadioGroupPropsSubset = Omit<
  RaRadioGroupProps,
  "children" | "orientation"
> & {
  /** Radio options to display */
  children?: React.ReactNode;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type RadioInputRootProps = OmitInternalProps<
  RadioInputRootSlotProps,
  keyof RadioGroupPropsSubset
> &
  RadioGroupPropsSubset;

export type RadioInputOptionProps = RaRadioProps &
  OmitInternalProps<RadioInputOptionSlotProps, keyof RaRadioProps>;
