import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { GridList as RaGridList } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { GridListRootSlot } from "../grid-list.slots";
import type { GridListRootProps } from "../grid-list.types";

/**
 * GridList.Root
 *
 * The root container for the grid list. Wraps React Aria's `GridList`,
 * providing the recipe context, keyboard navigation, single and multiple
 * selection, type-ahead, and opt-in drag-and-drop (via the `dragAndDropHooks`
 * prop). Supports both static composition (nested `GridList.Item` children)
 * and dynamic collections (`items` plus a render function).
 *
 * @supportsStyleProps
 */
export const GridListRoot = <T extends object>(props: GridListRootProps<T>) => {
  const { ref, ...restProps } = props;
  const recipe = useSlotRecipe({ key: "nimbusGridList" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  return (
    <GridListRootSlot ref={ref} {...recipeProps} {...styleProps} asChild>
      <RaGridList {...functionalProps} />
    </GridListRootSlot>
  );
};

GridListRoot.displayName = "GridList.Root";
