import type { BoxRootProps } from "./box.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { boxRecipe } from "./box.recipe";

type BoxVariantProps = BoxRootProps & RecipeVariantProps<typeof boxRecipe>;

export interface BoxProps extends BoxVariantProps {
  children?: React.ReactNode;
}
