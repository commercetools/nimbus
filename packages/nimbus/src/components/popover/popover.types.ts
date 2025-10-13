import type { PopoverProps as RaPopoverProps } from "react-aria-components";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

export type PopoverRecipeProps = RecipeProps<"popover"> & UnstyledProp;

export type PopoverSlotProps = HTMLChakraProps<"div", PopoverRecipeProps>;

export type PopoverProps = RaPopoverProps & PopoverSlotProps;
