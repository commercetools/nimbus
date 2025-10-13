import { createRecipeContext } from "@chakra-ui/react";
import type { SeparatorRootProps } from "./separator.types";

const { withContext } = createRecipeContext({ key: "separator" });

export const SeparatorRoot = withContext<HTMLDivElement, SeparatorRootProps>(
  "div"
);
