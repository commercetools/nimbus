import { createRecipeContext } from "@chakra-ui/react";
import { Popover as RaPopover } from "react-aria-components";
import type { PopoverProps } from "./popover.types";

const { withContext } = createRecipeContext({
  key: "popover",
});

export const PopoverRootSlot = withContext<HTMLDivElement, PopoverProps>(
  RaPopover
);
