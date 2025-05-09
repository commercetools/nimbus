import { type RefAttributes } from "react";
import type { TagGroupTagListProps } from "../tag-group.types";
import { TagGroupTagListSlot } from "../tag-group.slots";

export const TagGroupTagList = <T extends object>({
  children,
  ref,
  ...rest
}: TagGroupTagListProps<T> & RefAttributes<HTMLDivElement>) => (
  <TagGroupTagListSlot ref={ref} {...rest}>
    {children}
  </TagGroupTagListSlot>
);

TagGroupTagList.displayName = "TagGroup.TagList";
