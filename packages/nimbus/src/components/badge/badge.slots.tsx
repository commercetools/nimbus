import { createRecipeContext } from "@chakra-ui/react";
import { badgeRecipe } from "./badge.recipe";
import type { BadgeRootSlotProps } from "./badge.types";

const { withContext } = createRecipeContext({ recipe: badgeRecipe });

export const BadgeRoot = withContext<HTMLSpanElement, BadgeRootSlotProps>(
  "span"
);
