import { createRecipeContext } from "@chakra-ui/react/styled-system";

import { dividerRecipe } from "./divider.recipe";
import type { DividerRootProps } from "./divider.types";

const { withContext } = createRecipeContext({ recipe: dividerRecipe });

export const DividerRoot = withContext<HTMLDivElement, DividerRootProps>("div");
