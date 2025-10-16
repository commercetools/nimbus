import { createRecipeContext } from "@chakra-ui/react";
import { Popover as RaPopover } from "react-aria-components";
import type { PopoverProps } from "./popover.types";
import type { SlotComponent } from "@/utils/slot-types";

const { withContext } = createRecipeContext({
  key: "popover",
});

export const PopoverRootSlot: SlotComponent<typeof RaPopover, PopoverProps> =
  withContext<typeof RaPopover, PopoverProps>(RaPopover);
