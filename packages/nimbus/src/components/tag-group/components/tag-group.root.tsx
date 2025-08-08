import { TagGroupRootSlot } from "../tag-group.slots";
import type { TagGroupRootComponent } from "../tag-group.types";

/**
 * # TagGroup
 *
 * A tag group is a focusable list of labels, categories, keywords, filters, or other items, with support for keyboard navigation, selection, and removal.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/tag-group}
 */
export const TagGroupRoot: TagGroupRootComponent = ({
  children,
  onRemove,
  selectionMode,
  ref,
  ...rest
}) => {
  if (
    onRemove &&
    (selectionMode === "multiple" || selectionMode === "single")
  ) {
    console.warn(
      'Nimbus TagGroup: when "selectionMode" is "single" or "mutiple", Tags cannot be removed'
    );
  }
  return (
    <TagGroupRootSlot
      ref={ref}
      onRemove={onRemove}
      selectionMode={selectionMode}
      {...rest}
    >
      {children}
    </TagGroupRootSlot>
  );
};

TagGroupRoot.displayName = "TagGroup.Root";
