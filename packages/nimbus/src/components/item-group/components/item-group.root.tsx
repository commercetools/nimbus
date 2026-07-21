import { ItemGroupRootSlot } from "../item-group.slots";
import type { ItemGroupRootProps } from "../item-group.types";

/**
 * ItemGroup.Root - A container that visually groups a set of `Item` rows into a
 * vertical stack. It is a parent of `Item.Root` (not a child), so it lives in
 * its own component rather than as an `Item.*` part and does not share the
 * row's styling context.
 *
 * No `role="list"` is applied: a list role would require every child to be a
 * `listitem` and forbid separator children, which free composition can't
 * guarantee.
 *
 * @supportsStyleProps
 */
export const ItemGroupRoot = (props: ItemGroupRootProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <ItemGroupRootSlot ref={forwardedRef} {...restProps}>
      {children}
    </ItemGroupRootSlot>
  );
};

ItemGroupRoot.displayName = "ItemGroup.Root";
