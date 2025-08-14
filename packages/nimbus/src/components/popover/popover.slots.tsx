import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import { popoverSlotRecipe } from "./popover.recipe";
import {
  DialogTrigger as RaDialogTrigger,
  Popover as RaPopover,
} from "react-aria-components";
import {
  type PopoverContentSlotProps,
  type PopoverTriggerSlotProps,
} from "./popover.types";

const { withProvider } = createSlotRecipeContext({
  recipe: popoverSlotRecipe,
});

export const PopoverTriggerSlot = (props: PopoverTriggerSlotProps) => (
  <RaDialogTrigger {...props} />
);

export const PopoverContentSlot = withProvider<
  HTMLDivElement,
  PopoverContentSlotProps
>(RaPopover, "content");
