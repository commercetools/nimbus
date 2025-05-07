import { forwardRef } from "react";
import { TagGroupTagListSlot } from "../tag-group.slots";
import type { TagGroupTagListComponent } from "../tag-group.types";

export const TagGroupTagList: TagGroupTagListComponent<object> = forwardRef(
  ({ children, ...rest }, ref) => {
    return (
      <TagGroupTagListSlot ref={ref} {...rest}>
        {children}
      </TagGroupTagListSlot>
    );
  }
);

TagGroupTagList.displayName = "TagGroup.TagList";
