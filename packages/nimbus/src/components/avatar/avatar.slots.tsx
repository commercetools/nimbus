import { createRecipeContext } from "@chakra-ui/react";
import { avatarRecipe } from "./avatar.recipe";
import type { AvatarRootSlotProps } from "./avatar.types";

const { withContext } = createRecipeContext({ recipe: avatarRecipe });

export const AvatarRoot = withContext<HTMLElement, AvatarRootSlotProps>(
  "figure"
);
