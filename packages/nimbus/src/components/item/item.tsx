import {
  ItemRoot,
  ItemHeader,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemFooter,
} from "./components";

/**
 * Item
 * ============================================================
 * A horizontal content-row primitive: leading media, a title/description
 * column, and trailing actions. Complements `Card` (a vertical container) and
 * `List`/`Menu` (interactive, selectable collections).
 *
 * Presentational by default; `Item.Root` upgrades to an accessible link when
 * given an `href`. Row actions live as nested controls in `Item.Actions`.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/item}
 *
 * @example
 * ```tsx
 * <ItemGroup>
 *   <Item.Root href="/settings/profile">
 *     <Item.Media variant="icon"><PersonIcon /></Item.Media>
 *     <Item.Content>
 *       <Item.Title>Profile</Item.Title>
 *       <Item.Description>Name, avatar, and contact details</Item.Description>
 *     </Item.Content>
 *     <Item.Actions>
 *       <IconButton aria-label="Open"><ChevronRightIcon /></IconButton>
 *     </Item.Actions>
 *   </Item.Root>
 *   <ItemGroup.Separator />
 *   <Item.Root>…</Item.Root>
 * </ItemGroup>
 * ```
 */
export const Item = {
  /**
   * # Item.Root
   *
   * The row container and styling-context provider for all Item parts.
   * Renders a `<div>` by default and upgrades to an `<a>` (via React Aria's
   * `useLink`) when an `href` is provided. Accepts `variant`
   * (`plain`/`outline`/`subtle`) and `size` (`xs`/`sm`/`md`) props.
   */
  Root: ItemRoot,
  /**
   * # Item.Header
   *
   * Optional full-width band rendered above the media·content·actions row.
   */
  Header: ItemHeader,
  /**
   * # Item.Media
   *
   * Fixed, non-shrinking leading slot for an icon, avatar, or image. Its own
   * `variant` (`default`/`icon`/`image`) sizes and shapes the media.
   */
  Media: ItemMedia,
  /**
   * # Item.Content
   *
   * The growing middle column that wraps `Item.Title` and `Item.Description`.
   */
  Content: ItemContent,
  /**
   * # Item.Title
   *
   * The primary label of the row.
   */
  Title: ItemTitle,
  /**
   * # Item.Description
   *
   * Secondary text below the title.
   */
  Description: ItemDescription,
  /**
   * # Item.Actions
   *
   * Trailing slot for interactive controls (`Button`, `IconButton`). Controls
   * here keep a focus order independent of a link-mode `Item.Root`.
   */
  Actions: ItemActions,
  /**
   * # Item.Footer
   *
   * Optional full-width band rendered below the row.
   */
  Footer: ItemFooter,
};

export {
  ItemRoot as _ItemRoot,
  ItemHeader as _ItemHeader,
  ItemMedia as _ItemMedia,
  ItemContent as _ItemContent,
  ItemTitle as _ItemTitle,
  ItemDescription as _ItemDescription,
  ItemActions as _ItemActions,
  ItemFooter as _ItemFooter,
};
