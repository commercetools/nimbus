import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  RecipeProps,
} from "@chakra-ui/react/styled-system";
import type {
  RadioGroupProps as RaRadioGroupProps,
  RadioProps as RaRadioProps,
} from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type RadioInputRecipeProps = {
  /**
   * Layout orientation for radio options
   * @default "vertical"
   */
  orientation?: RecipeProps<"nimbusRadioInput">["orientation"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type RadioInputRootSlotProps = HTMLChakraProps<
  "div",
  RadioInputRecipeProps
>;

export type RadioInputOptionSlotProps = HTMLChakraProps<
  "span",
  RecipeProps<"option">
>;

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
