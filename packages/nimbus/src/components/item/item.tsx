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
   *
   * @example
   * ```tsx
   * <Item.Root variant="outline" size="md" href="/settings/profile">
   *   <Item.Content>
   *     <Item.Title>Profile</Item.Title>
   *   </Item.Content>
   * </Item.Root>
   * ```
   */
  Root: ItemRoot,
  /**
   * # Item.Header
   *
   * Optional full-width band rendered above the media·content·actions row.
   *
   * @example
   * ```tsx
   * <Item.Root>
   *   <Item.Header>Shared with your team</Item.Header>
   *   <Item.Content>
   *     <Item.Title>Design spec</Item.Title>
   *   </Item.Content>
   * </Item.Root>
   * ```
   */
  Header: ItemHeader,
  /**
   * # Item.Media
   *
   * Fixed, non-shrinking leading slot for an icon, avatar, or image. Its own
   * `variant` (`default`/`icon`/`image`) sizes and shapes the media.
   *
   * @example
   * ```tsx
   * <Item.Media variant="icon">
   *   <PersonIcon />
   * </Item.Media>
   * ```
   */
  Media: ItemMedia,
  /**
   * # Item.Content
   *
   * The growing middle column that wraps `Item.Title` and `Item.Description`.
   *
   * @example
   * ```tsx
   * <Item.Content>
   *   <Item.Title>Profile</Item.Title>
   *   <Item.Description>Name, avatar, and contact details</Item.Description>
   * </Item.Content>
   * ```
   */
  Content: ItemContent,
  /**
   * # Item.Title
   *
   * The primary label of the row.
   *
   * @example
   * ```tsx
   * <Item.Content>
   *   <Item.Title>Notifications</Item.Title>
   * </Item.Content>
   * ```
   */
  Title: ItemTitle,
  /**
   * # Item.Description
   *
   * Secondary text below the title.
   *
   * @example
   * ```tsx
   * <Item.Content>
   *   <Item.Title>Notifications</Item.Title>
   *   <Item.Description>Email and push preferences</Item.Description>
   * </Item.Content>
   * ```
   */
  Description: ItemDescription,
  /**
   * # Item.Actions
   *
   * Trailing slot for interactive controls (`Button`, `IconButton`). Controls
   * here keep a focus order independent of a link-mode `Item.Root`.
   *
   * @example
   * ```tsx
   * <Item.Actions>
   *   <IconButton aria-label="Open"><ChevronRightIcon /></IconButton>
   * </Item.Actions>
   * ```
   */
  Actions: ItemActions,
  /**
   * # Item.Footer
   *
   * Optional full-width band rendered below the row.
   *
   * @example
   * ```tsx
   * <Item.Root>
   *   <Item.Content>
   *     <Item.Title>Design spec</Item.Title>
   *   </Item.Content>
   *   <Item.Footer>Updated 3 days ago</Item.Footer>
   * </Item.Root>
   * ```
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
