import type { HTMLChakraProps, RecipeProps } from "@chakra-ui/react";
import type {
  RadioGroupProps as RaRadioGroupProps,
  RadioProps as RaRadioProps,
} from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type RadioInputRecipeProps = {
  orientation?: RecipeProps<"radioInput">["orientation"];
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
  children?: React.ReactNode;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type RadioInputRootProps = Omit<
  RadioInputRootSlotProps,
  keyof RadioGroupPropsSubset
> &
  RadioGroupPropsSubset;

export type RadioInputOptionProps = RaRadioProps &
  Omit<RadioInputOptionSlotProps, keyof RaRadioProps>;
