import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { ListBox as RaListBox } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { ListBoxRootSlot } from "../list-box.slots";
import type { ListBoxRootProps } from "../list-box.types";

/**
 * ListBox.Root
 *
 * The root container for the list box. Wraps React Aria's `ListBox`, providing
 * the recipe context, keyboard navigation, single and multiple selection,
 * type-ahead, and opt-in drag-and-drop (via the `dragAndDropHooks` prop).
 * Supports both static composition (nested `ListBox.Item` children) and
 * dynamic collections (`items` plus a render function).
 *
 * @supportsStyleProps
 */
export const ListBoxRoot = <T extends object>(props: ListBoxRootProps<T>) => {
  const { ref, ...restProps } = props;
  const recipe = useSlotRecipe({ key: "nimbusListBox" });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);

  return (
    <ListBoxRootSlot ref={ref} {...recipeProps} {...styleProps} asChild>
      <RaListBox {...functionalProps} />
    </ListBoxRootSlot>
  );
};

ListBoxRoot.displayName = "ListBox.Root";
