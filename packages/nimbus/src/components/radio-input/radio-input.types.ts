import type {
  HTMLChakraProps,
  RecipeVariantProps,
  RecipeProps,
} from "@chakra-ui/react";
import { radioInputSlotRecipe } from "./radio-input.recipe";
import type {
  RadioGroupProps as RaRadioGroupProps,
  RadioProps as RaRadioProps,
} from "react-aria-components";
type RadioGroupProps = Omit<RaRadioGroupProps, "children"> & {
  children?: React.ReactNode;
};
export interface RadioInputRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof radioInputSlotRecipe>
  > {}

export interface RadioInputRootProps
  extends RadioGroupProps,
    Omit<RadioInputRootSlotProps, keyof RadioGroupProps> {}

export interface RadioInputOptionSlotProps
  extends HTMLChakraProps<"span", RecipeProps<"option">> {}

export interface RadioInputOptionProps
  extends RaRadioProps,
    Omit<RadioInputOptionSlotProps, keyof RaRadioProps> {}
