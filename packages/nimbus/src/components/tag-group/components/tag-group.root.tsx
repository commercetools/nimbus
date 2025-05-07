import { TagGroupRootSlot } from "../tag-group.slots";
import type { TagGroupRootComponent } from "../tag-group.types";

export const TagGroupRoot: TagGroupRootComponent = ({
  children,
  ref,
  ...rest
}) => (
  <TagGroupRootSlot ref={ref} {...rest}>
    {children}
  </TagGroupRootSlot>
);

TagGroupRoot.displayName = "TagGroup.Root";
