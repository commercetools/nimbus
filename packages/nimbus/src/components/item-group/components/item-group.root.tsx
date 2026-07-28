import { ItemGroupRootSlot } from "../item-group.slots";
import type { ItemGroupRootProps } from "../item-group.types";

/**
 * ItemGroup.Root - A container that visually groups a set of `Item` rows into a
 * vertical stack. It is a parent of `Item.Root` (not a child), so it lives in
 * its own component rather than as an `Item.*` part and does not share the
 * row's styling context.
 *
 * Exposes the grouping to assistive technology with `role="group"` rather than
 * `role="list"`: a list role would require every child to be a `listitem` and
 * forbid separator children, which free composition can't guarantee, whereas
 * `group` signals that the rows belong together without constraining what they
 * are. Give the group an accessible name with `aria-label`/`aria-labelledby`
 * when the grouping isn't obvious from surrounding context — both pass
 * straight through. The role is an overridable default; pass your own `role`
 * to replace it.
 *
 * @supportsStyleProps
 */
export const ItemGroupRoot = (props: ItemGroupRootProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <ItemGroupRootSlot ref={forwardedRef} role="group" {...restProps}>
      {children}
    </ItemGroupRootSlot>
  );
};

ItemGroupRoot.displayName = "ItemGroup.Root";
