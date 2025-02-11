import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";
import { avatarRecipe } from "./avatar.recipe";

interface AvatarRecipeProps extends RecipeProps<"div">, UnstyledProp {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AvatarRootProps
  extends HTMLChakraProps<"div", AvatarRecipeProps> {}
const { withContext } = createRecipeContext({ recipe: avatarRecipe });

export const AvatarRoot = withContext<HTMLDivElement, AvatarRootProps>("div", {
  defaultProps: {
    role: "img",
    "aria-label": "avatar",
  },
});
