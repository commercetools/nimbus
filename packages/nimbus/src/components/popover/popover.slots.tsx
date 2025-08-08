import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react";
import { popoverSlotRecipe } from "./popover.recipe";
import {
  DialogTrigger as RADialogTrigger,
  Popover as RAPopover,
  Dialog as RADialog,
  Button as RAButton,
  type ButtonProps,
} from "react-aria-components";
import { forwardRef } from "react";
import {
  type PopoverContentSlotProps,
  type PopoverRootSlotProps,
} from "./popover.types";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: popoverSlotRecipe,
});

export const PopoverRootSlot = (props: PopoverRootSlotProps) => (
  <RADialogTrigger {...props} />
);

export const PopoverTriggerSlot = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ children, ...props }, ref) => (
  <RAButton {...props} ref={ref}>
    {children}
  </RAButton>
));

export const PopoverContentSlot = withProvider<
  HTMLDivElement,
  PopoverContentSlotProps
>(RAPopover, "content");

export const PopoverDialogSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>(RADialog, "dialog");

export const PopoverCloseSlot = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ children, ...props }, ref) => (
  <RAButton {...props} ref={ref}>
    {children}
  </RAButton>
));
