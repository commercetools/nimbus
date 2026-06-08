import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { Tree as RaTree } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { TreeRootSlot } from "../tree.slots";
import type { TreeRootProps } from "../tree.types";

/**
 * Tree.Root
 *
 * The root container for the tree. Wraps React Aria's `Tree`, providing the
 * recipe context, keyboard navigation, expand/collapse, type-ahead, selection
 * and opt-in drag-and-drop (via the `dragAndDropHooks` prop).
 *
 * @supportsStyleProps
 */
export const TreeRoot = <T extends object>(props: TreeRootProps<T>) => {
  const { ref, ...restProps } = props;
  const recipe = useSlotRecipe({ key: "nimbusTree" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  return (
    <TreeRootSlot ref={ref} {...recipeProps} {...styleProps} asChild>
      <RaTree {...functionalProps} />
    </TreeRootSlot>
  );
};

TreeRoot.displayName = "Tree.Root";
