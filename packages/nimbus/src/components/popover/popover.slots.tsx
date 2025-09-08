import {
  createRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
} from "@chakra-ui/react/styled-system";
import { Popover as RaPopover } from "react-aria-components";
import type { PopoverProps } from "./popover.types";
import { popoverRecipe } from "./popover.recipe";

const { withContext } = createRecipeContext({
  recipe: popoverRecipe,
});

export interface PopoverRecipeProps
  extends RecipeVariantProps<typeof popoverRecipe>,
    UnstyledProp {}

export type PopoverSlotProps = HTMLChakraProps<"div", PopoverRecipeProps>;
export const PopoverRootSlot = withContext<HTMLDivElement, PopoverProps>(
  RaPopover
);
