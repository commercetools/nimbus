import { createRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type { SeparatorRootSlotProps } from "./separator.types";

const { withContext } = createRecipeContext({ key: "nimbusSeparator" });

export const SeparatorRoot: SlotComponent<
  HTMLDivElement,
  SeparatorRootSlotProps
> = withContext<HTMLDivElement, SeparatorRootSlotProps>("div");
