import { createRecipeContext } from "@chakra-ui/react/styled-system";
import { popoverSlotRecipe } from "./popover.recipe";
import { Popover as RaPopover } from "react-aria-components";
import { type PopoverRootSlotProps } from "./popover.types";

const { withContext } = createRecipeContext({
  recipe: popoverSlotRecipe,
});

export const PopoverRootSlot = withContext<
  HTMLDivElement,
  PopoverRootSlotProps
>(RaPopover);
