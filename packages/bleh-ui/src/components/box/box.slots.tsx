import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { boxRecipe } from "./box.recipe";

interface BoxRecipeProps extends RecipeProps<"div">, UnstyledProp {}

export type BoxRootProps = HTMLChakraProps<"div", BoxRecipeProps>;

const { withContext } = createRecipeContext({ recipe: boxRecipe });
export const BoxRoot = withContext<HTMLDivElement, BoxRootProps>("div");
