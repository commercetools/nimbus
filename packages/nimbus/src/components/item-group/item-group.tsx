import { ItemGroupRoot, ItemGroupSeparator } from "./components";

/**
 * ItemGroup
 * ============================================================
 * A standalone container that groups a set of `Item` rows into a vertical
 * stack, with optional dividers between them. It is a **peer** of `Item` (it
 * wraps `Item.Root` rows rather than nesting inside one), so it is its own
 * component rather than an `Item.*` part.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/item-group}
 *
 * @example
 * ```tsx
 * <ItemGroup.Root>
 *   <Item.Root>…</Item.Root>
 *   <ItemGroup.Separator />
 *   <Item.Root>…</Item.Root>
 * </ItemGroup.Root>
 * ```
 */
export const ItemGroup = {
  /**
   * # ItemGroup.Root
   *
   * The container that lays grouped `Item` rows out as a vertical stack.
   * Exposes the grouping to assistive technology with `role="group"`; give it
   * an accessible name with `aria-label`/`aria-labelledby` when the grouping
   * isn't obvious from surrounding context.
   *
   * @example
   * ```tsx
   * <ItemGroup.Root aria-label="Account settings">
   *   <Item.Root>…</Item.Root>
   *   <ItemGroup.Separator />
   *   <Item.Root>…</Item.Root>
   * </ItemGroup.Root>
   * ```
   */
  Root: ItemGroupRoot,
  /**
   * # ItemGroup.Separator
   *
   * A horizontal divider placed between rows in an `ItemGroup.Root`.
   *
   * @example
   * ```tsx
   * <ItemGroup.Root>
   *   <Item.Root>…</Item.Root>
   *   <ItemGroup.Separator />
   *   <Item.Root>…</Item.Root>
   * </ItemGroup.Root>
   * ```
   */
  Separator: ItemGroupSeparator,
};

export {
  ItemGroupRoot as _ItemGroupRoot,
  ItemGroupSeparator as _ItemGroupSeparator,
};
