import { forwardRef } from "react";
import { TagGroupTagSlot } from "../tag-group.slots";
import type { TagGroupTagComponent } from "../tag-group.types";

export const TagGroupTag: TagGroupTagComponent = forwardRef(
  ({ children, ...rest }, ref) => {
    const textValue = typeof children === "string" ? children : undefined;
    return (
      <TagGroupTagSlot ref={ref} textValue={textValue} {...rest}>
        {children}
      </TagGroupTagSlot>
    );
  }
);

TagGroupTag.displayName = "TagGroup.Tag";
