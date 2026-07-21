import { ItemGroupSeparatorSlot } from "../item-group.slots";
import type { ItemGroupSeparatorProps } from "../item-group.types";

/**
 * ItemGroup.Separator - A horizontal divider between rows in an
 * `ItemGroup.Root`. Exposes `role="separator"` and is not a focus stop.
 *
 * @supportsStyleProps
 */
export const ItemGroupSeparator = (props: ItemGroupSeparatorProps) => {
  const { ref: forwardedRef, ...restProps } = props;

  return (
    <ItemGroupSeparatorSlot
      ref={forwardedRef}
      role="separator"
      aria-orientation="horizontal"
      {...restProps}
    />
  );
};

ItemGroupSeparator.displayName = "ItemGroup.Separator";
