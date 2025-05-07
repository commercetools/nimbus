import { type RefAttributes } from "react";
import type {
  TagGroupTagListComponent,
  TagGroupTagListProps,
} from "../tag-group.types";
import { TagList as RaTagList } from "react-aria-components";
import { withContext } from "../tag-group.slots";

export const TagGroupTagList = <T extends object>({
  children,
  ref,
  ...rest
}: TagGroupTagListProps<T> & RefAttributes<typeof RaTagList>) => {
  // We define the TagGroupTagListSlot here because it's a generic component
  // that we can use to render the TagGroupTagList component.
  const TagGroupTagListSlot: TagGroupTagListComponent<T> = withContext<
    typeof RaTagList,
    TagGroupTagListProps<T>
  >(RaTagList, "tagList");

  return (
    <TagGroupTagListSlot ref={ref} {...rest}>
      {children}
    </TagGroupTagListSlot>
  );
};

TagGroupTagList.displayName = "TagGroup.TagList";
