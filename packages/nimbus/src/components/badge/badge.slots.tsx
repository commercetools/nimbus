import { createRecipeContext } from "@chakra-ui/react";

import { badgeRecipe } from "./badge.recipe";
import type { BadgeRootProps } from "./badge.types";

const { withContext } = createRecipeContext({ recipe: badgeRecipe });

export const BadgeRoot = withContext<HTMLSpanElement, BadgeRootProps>("span");
