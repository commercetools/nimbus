import { TagGroupRoot } from "./components/tag-group.root";
import { TagGroupTagList } from "./components/tag-group.tag-list";
import { TagGroupTag } from "./components/tag-group.tag";

/**
 * TagGroup
 * ============================================================
 * A tag group is a focusable list of labels, categories, keywords, filters, or other items, with support for keyboard navigation, selection, and removal.
 *
 */
export const TagGroup = {
  Root: TagGroupRoot,
  TagList: TagGroupTagList,
  Tag: TagGroupTag,
};
