import { createRecipeContext } from "@chakra-ui/react";
import type { SeparatorRootSlotProps } from "./separator.types";
import type { SlotComponent } from "../utils/slot-types";

const { withContext } = createRecipeContext({ key: "separator" });

export const SeparatorRoot: SlotComponent<
  HTMLDivElement,
  SeparatorRootSlotProps
> = withContext<HTMLDivElement, SeparatorRootSlotProps>("div");
