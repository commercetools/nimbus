import { createRecipeContext } from "@chakra-ui/react";
import { avatarRecipe } from "./avatar.recipe";
import type { AvatarRootProps } from "./avatar.types";

const { withContext } = createRecipeContext({ recipe: avatarRecipe });

export const AvatarRoot = withContext<HTMLElement, AvatarRootProps>("figure");
