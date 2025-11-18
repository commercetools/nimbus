import { TagGroupRoot, TagGroupTagList, TagGroupTag } from "./components";

/**
 * TagGroup
 * ============================================================
 * A tag group is a focusable list of labels, categories, keywords, filters, or other items, with support for keyboard navigation, selection, and removal.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/data-display/tag-group}
 *
 * @example
 * ```tsx
 * <TagGroup.Root>
 *   <TagGroup.TagList>
 *     <TagGroup.Tag>Tag 1</TagGroup.Tag>
 *     <TagGroup.Tag>Tag 2</TagGroup.Tag>
 *   </TagGroup.TagList>
 * </TagGroup.Root>
 * ```
 */
export const TagGroup = {
  /**
   * # TagGroup.Root
   *
   * The root component that provides context and state management for the tag group.
   * Must wrap all tag group parts (TagList, Tag) to coordinate their behavior.
   *
   * @example
   * ```tsx
   * <TagGroup.Root selectionMode="multiple" onSelectionChange={handleSelection}>
   *   <TagGroup.TagList>
   *     <TagGroup.Tag>Tag 1</TagGroup.Tag>
   *     <TagGroup.Tag>Tag 2</TagGroup.Tag>
   *   </TagGroup.TagList>
   * </TagGroup.Root>
   * ```
   */
  Root: TagGroupRoot,

  /**
   * # TagGroup.TagList
   *
   * The container component that holds individual tags within the tag group.
   * Provides the proper semantic structure and keyboard navigation for tags.
   *
   * @example
   * ```tsx
   * <TagGroup.Root>
   *   <TagGroup.TagList>
   *     <TagGroup.Tag>Tag 1</TagGroup.Tag>
   *     <TagGroup.Tag>Tag 2</TagGroup.Tag>
   *   </TagGroup.TagList>
   * </TagGroup.Root>
   * ```
   */
  TagList: TagGroupTagList,

  /**
   * # TagGroup.Tag
   *
   * Individual tag component that can be selected, removed, or used for display.
   * Supports keyboard interaction and automatic remove button when removable.
   *
   * @example
   * ```tsx
   * <TagGroup.Root onRemove={handleRemove}>
   *   <TagGroup.TagList>
   *     <TagGroup.Tag id="tag1">Removable Tag</TagGroup.Tag>
   *     <TagGroup.Tag id="tag2">Another Tag</TagGroup.Tag>
   *   </TagGroup.TagList>
   * </TagGroup.Root>
   * ```
   */
  Tag: TagGroupTag,
};
