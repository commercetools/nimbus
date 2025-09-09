import type {
  HTMLChakraProps,
  RecipeVariantProps,
  RecipeProps,
} from "@chakra-ui/react/styled-system";
import { radioInputSlotRecipe } from "./radio-input.recipe";
import type {
  RadioGroupProps as RaRadioGroupProps,
  RadioProps as RaRadioProps,
} from "react-aria-components";
type RadioGroupProps = Omit<RaRadioGroupProps, "children"> & {
  children?: React.ReactNode;
};
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RadioInputRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof radioInputSlotRecipe>
  > {}

export interface RadioInputRootProps
  extends RadioGroupProps,
    Omit<RadioInputRootSlotProps, keyof RadioGroupProps> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RadioInputOptionSlotProps
  extends HTMLChakraProps<"span", RecipeProps<"option">> {}

export interface RadioInputOptionProps
  extends RaRadioProps,
    Omit<RadioInputOptionSlotProps, keyof RaRadioProps> {}
