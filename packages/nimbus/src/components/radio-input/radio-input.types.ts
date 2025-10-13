import type { HTMLChakraProps, RecipeProps } from "@chakra-ui/react";
import type {
  RadioGroupProps as RaRadioGroupProps,
  RadioProps as RaRadioProps,
} from "react-aria-components";

type RadioGroupProps = Omit<RaRadioGroupProps, "children" | "orientation"> & {
  children?: React.ReactNode;
};

type RadioInputRecipeProps = {
  orientation?: RecipeProps<"radioInput">["orientation"];
};

export type RadioInputRootSlotProps = HTMLChakraProps<
  "div",
  RadioInputRecipeProps
>;

export type RadioInputRootProps = Omit<
  RadioInputRootSlotProps,
  keyof RadioGroupProps
> &
  RadioGroupProps;

export type RadioInputOptionSlotProps = HTMLChakraProps<
  "span",
  RecipeProps<"option">
>;

export type RadioInputOptionProps = RaRadioProps &
  Omit<RadioInputOptionSlotProps, keyof RaRadioProps>;
