import { createRecipeContext } from "@chakra-ui/react";
import type { SlotComponent } from "@/type-utils";
import type { SeparatorRootSlotProps } from "./separator.types";

const { withContext } = createRecipeContext({ key: "separator" });

export const SeparatorRoot: SlotComponent<
  HTMLDivElement,
  SeparatorRootSlotProps
> = withContext<HTMLDivElement, SeparatorRootSlotProps>("div");
