import type { HTMLChakraProps, RecipeProps } from "@chakra-ui/react";
import type {
  RadioGroupProps as RaRadioGroupProps,
  RadioProps as RaRadioProps,
} from "react-aria-components";

type RadioGroupProps = Omit<RaRadioGroupProps, "children"> & {
  children?: React.ReactNode;
};

type RadioInputRecipeVariantProps = {
  /**
   * Orientation variant
   * @default "vertical"
   */
  orientation?: "horizontal" | "vertical";
};

export type RadioInputRootSlotProps = HTMLChakraProps<"div">;

export type RadioInputRootProps = RadioInputRecipeVariantProps &
  RadioGroupProps &
  Omit<RadioInputRootSlotProps, keyof RadioGroupProps>;

export type RadioInputOptionSlotProps = HTMLChakraProps<
  "span",
  RecipeProps<"option">
>;

export type RadioInputOptionProps = RaRadioProps &
  Omit<RadioInputOptionSlotProps, keyof RaRadioProps>;
