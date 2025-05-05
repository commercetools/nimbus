import { forwardRef } from "react";
import { TagGroupRootSlot } from "../tag-group.slots";
import type { TagGroupRootComponent } from "../tag-group.types";

export const TagGroupRoot: TagGroupRootComponent = forwardRef(
  ({ children, ...rest }, ref) => (
    <TagGroupRootSlot ref={ref} {...rest}>
      {children}
    </TagGroupRootSlot>
  )
);

TagGroupRoot.displayName = "TagGroup.Root";
