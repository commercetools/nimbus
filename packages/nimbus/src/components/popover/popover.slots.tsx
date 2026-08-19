import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";

import type { SlotComponent } from "@/type-utils";
import type {
  PopoverRootSlotProps,
  PopoverTriggerSlotProps,
  PopoverContentSlotProps,
  PopoverDialogSlotProps,
} from "./popover.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusPopover",
});

/**
 * Popover Root
 *
 * Installs the slot-recipe context for every part. Rendered with `asChild`
 * around React Aria's `DialogTrigger`, which mounts no DOM element, so this
 * slot contributes context but no element of its own.
 */
export const PopoverRootSlot: SlotComponent<
  HTMLDivElement,
  PopoverRootSlotProps
> = withProvider<HTMLDivElement, PopoverRootSlotProps>("div", "root");

/** Popover Trigger - the element that opens the popover */
export const PopoverTriggerSlot: SlotComponent<
  HTMLButtonElement,
  PopoverTriggerSlotProps
> = withContext<HTMLButtonElement, PopoverTriggerSlotProps>(
  "button",
  "trigger"
);

/** Popover Content - the positioned overlay surface */
export const PopoverContentSlot: SlotComponent<
  HTMLDivElement,
  PopoverContentSlotProps
> = withContext<HTMLDivElement, PopoverContentSlotProps>("div", "content");

/** Popover Dialog - the dialog element rendered inside the surface */
export const PopoverDialogSlot: SlotComponent<
  HTMLDivElement,
  PopoverDialogSlotProps
> = withContext<HTMLDivElement, PopoverDialogSlotProps>("div", "dialog");
