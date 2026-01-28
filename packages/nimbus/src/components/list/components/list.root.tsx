import { ListRootSlot } from "../list.slots";
import type { ListRootProps } from "../list.types";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";

/**
 * List.Root
 *
 * Provides context and configuration for all list items.
 *
 * @supportsStyleProps
 */
export const ListRoot = (props: ListRootProps) => {
  const { ref, ...restProps } = props;
  const recipe = useSlotRecipe({ key: "nimbusList" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps, htmlProps] = extractStyleProps(restRecipeProps);

  return (
    <ListRootSlot ref={ref} {...recipeProps} {...styleProps} {...htmlProps} />
  );
};

ListRoot.displayName = "List.Root";
