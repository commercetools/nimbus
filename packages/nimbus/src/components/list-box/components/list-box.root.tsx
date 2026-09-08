import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { ListBox as RaListBox } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { ListBoxRootSlot, ListBoxEmptyStateSlot } from "../list-box.slots";
import { listBoxSlotRecipe } from "../list-box.recipe";
import { listBoxMessagesStrings } from "../list-box.messages";
import type { ListBoxRootProps } from "../list-box.types";

/**
 * ListBox.Root - The collection container.
 *
 * Wraps React Aria's `ListBox`, installs the slot-recipe context for the item
 * and section parts, and provides a styled default empty state.
 *
 * @supportsStyleProps
 */
export const ListBoxRoot = <T extends object>(props: ListBoxRootProps<T>) => {
  const { ref, renderEmptyState, ...restProps } = props;
  const recipe = useSlotRecipe({ recipe: listBoxSlotRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);
  const msg = useLocalizedStringFormatter(listBoxMessagesStrings);

  // Fall back to a styled, localized empty state when the consumer doesn't
  // provide one — the existing lists (ComboBox) ship only a raw TODO string.
  const renderEmpty =
    renderEmptyState ??
    (() => (
      <ListBoxEmptyStateSlot>{msg.format("emptyState")}</ListBoxEmptyStateSlot>
    ));

  return (
    <ListBoxRootSlot asChild ref={ref} {...recipeProps} {...styleProps}>
      <RaListBox {...functionalProps} renderEmptyState={renderEmpty} />
    </ListBoxRootSlot>
  );
};

ListBoxRoot.displayName = "ListBox.Root";
