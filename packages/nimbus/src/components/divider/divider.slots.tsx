import { createRecipeContext } from "@chakra-ui/react";

import { dividerRecipe } from "./divider.recipe";
import type { DividerRootProps } from "./divider.types";

const { withContext } = createRecipeContext({ recipe: dividerRecipe });

export const DividerRoot = withContext<HTMLDivElement, DividerRootProps>("div");
