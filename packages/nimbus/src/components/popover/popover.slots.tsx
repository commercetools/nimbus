import {
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";
import { popoverSlotRecipe } from "./popover.recipe";
import {
  DialogTrigger as RaDialogTrigger,
  Popover as RaPopover,
  Button as RaButton,
  type ButtonProps,
} from "react-aria-components";
import { forwardRef } from "react";
import {
  type PopoverContentSlotProps,
  type PopoverRootSlotProps,
} from "./popover.types";

const { withProvider } = createSlotRecipeContext({
  recipe: popoverSlotRecipe,
});

export const PopoverRootSlot = (props: PopoverRootSlotProps) => (
  <RaDialogTrigger {...props} />
);

export const PopoverContentSlot = withProvider<
  HTMLDivElement,
  PopoverContentSlotProps
>(RaPopover, "content");

export const PopoverCloseSlot = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ children, ...props }, ref) => (
  <RaButton {...props} ref={ref}>
    {children}
  </RaButton>
));
