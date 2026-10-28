import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { ListBox as RaListBox } from "react-aria-components";
import { extractStyleProps } from "@/utils";
import { useLocalizedStringFormatter } from "@/hooks";
import { Virtualizer } from "../../virtualizer/virtualizer";
import { useVirtualizerOptionsWarning } from "../../virtualizer/hooks/use-virtualizer-options-warning";
import { mergeVirtualizerOptions } from "../../virtualizer/utils/merge-virtualizer-options";
import type { VirtualizerListLayoutOptions } from "../../virtualizer/virtualizer.types";
import { ListBoxRootSlot, ListBoxEmptyStateSlot } from "../list-box.slots";
import { listBoxSlotRecipe } from "../list-box.recipe";
import { listBoxMessagesStrings } from "../list-box.messages";
import {
  LIST_BOX_VIRTUALIZER_GAP,
  LIST_BOX_VIRTUALIZER_HEIGHTS,
  LIST_BOX_VIRTUALIZER_PADDING,
} from "../constants";
import type { ListBoxRootProps } from "../list-box.types";

/**
 * Default layout options for a virtualized ListBox. A responsive `size` or
 * `variant` falls back to the default; rows are measured, so only the
 * estimate is affected.
 */
const getVirtualizerDefaults = (
  size: unknown,
  variant: unknown,
  selectionMode: unknown
): VirtualizerListLayoutOptions => {
  const rowSize = size === "sm" ? "sm" : "md";
  const rowMode = selectionMode === "multiple" ? "multiple" : "single";
  return {
    estimatedRowHeight: LIST_BOX_VIRTUALIZER_HEIGHTS.row[rowSize][rowMode],
    estimatedHeadingHeight: LIST_BOX_VIRTUALIZER_HEIGHTS.heading,
    loaderHeight: LIST_BOX_VIRTUALIZER_HEIGHTS.loader,
    gap: LIST_BOX_VIRTUALIZER_GAP,
    padding:
      LIST_BOX_VIRTUALIZER_PADDING[variant === "plain" ? "plain" : "card"],
  };
};

/**
 * ListBox.Root - The collection container.
 *
 * Wraps React Aria's `ListBox`, installs the slot-recipe context for the item
 * and section parts, and provides a styled default empty state. With
 * `isVirtualized`, renders only the visible options.
 *
 * @supportsStyleProps
 */
export const ListBoxRoot = <T extends object>(props: ListBoxRootProps<T>) => {
  const {
    ref,
    renderEmptyState,
    isVirtualized = false,
    virtualizerOptions,
    ...restProps
  } = props;
  const recipe = useSlotRecipe({ recipe: listBoxSlotRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(restProps);
  const [styleProps, functionalProps] = extractStyleProps(restRecipeProps);
  const msg = useLocalizedStringFormatter(listBoxMessagesStrings);

  useVirtualizerOptionsWarning({
    componentName: "ListBox.Root",
    isVirtualized,
    hasVirtualizerOptions: virtualizerOptions !== undefined,
  });

  // Fall back to a styled, localized empty state when the consumer doesn't
  // provide one — the existing lists (ComboBox) ship only a raw TODO string.
  const renderEmpty =
    renderEmptyState ??
    (() => (
      <ListBoxEmptyStateSlot>{msg.format("emptyState")}</ListBoxEmptyStateSlot>
    ));

  const list = (
    <ListBoxRootSlot
      asChild
      ref={ref}
      {...recipeProps}
      {...styleProps}
      data-virtualized={isVirtualized || undefined}
    >
      <RaListBox {...functionalProps} renderEmptyState={renderEmpty} />
    </ListBoxRootSlot>
  );

  if (!isVirtualized) return list;

  // The Virtualizer renders no DOM element, so it wraps the root slot instead
  // of being an `asChild` child of it.
  return (
    <Virtualizer
      layoutOptions={mergeVirtualizerOptions(
        getVirtualizerDefaults(
          recipeProps.size,
          recipeProps.variant,
          props.selectionMode
        ),
        virtualizerOptions
      )}
    >
      {list}
    </Virtualizer>
  );
};

ListBoxRoot.displayName = "ListBox.Root";
