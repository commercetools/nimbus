import { createRecipeContext } from "@chakra-ui/react";

import { separatorRecipe } from "./separator.recipe";
import type { SeparatorRootProps } from "./separator.types";

const { withContext } = createRecipeContext({ recipe: separatorRecipe });

export const SeparatorRoot = withContext<HTMLDivElement, SeparatorRootProps>(
  "div"
);
