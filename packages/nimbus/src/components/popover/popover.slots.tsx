import { createRecipeContext } from "@chakra-ui/react/styled-system";
import { Popover as RaPopover } from "react-aria-components";
import type { PopoverBaseProps, PopoverBaseComponent } from "./popover.types";

const { withContext } = createRecipeContext({
  key: "nimbusPopover",
});

export const PopoverRootSlot: PopoverBaseComponent = withContext<
  typeof RaPopover,
  PopoverBaseProps
>(RaPopover);
