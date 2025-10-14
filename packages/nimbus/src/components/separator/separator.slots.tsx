import { createRecipeContext } from "@chakra-ui/react";
import type { SeparatorRootSlotProps } from "./separator.types";

const { withContext } = createRecipeContext({ key: "separator" });

export const SeparatorRoot = withContext<
  HTMLDivElement,
  SeparatorRootSlotProps
>("div");
