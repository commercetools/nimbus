import { createRecipeContext } from "@chakra-ui/react/styled-system";
import { Popover as RaPopover } from "react-aria-components";
import type { PopoverProps, PopoverComponent } from "./popover.types";

const { withContext } = createRecipeContext({
  key: "nimbusPopover",
});

export const PopoverRootSlot: PopoverComponent = withContext<
  typeof RaPopover,
  PopoverProps
>(RaPopover);
