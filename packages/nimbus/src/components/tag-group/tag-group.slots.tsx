import { createSlotRecipeContext } from "@chakra-ui/react";
import { TagGroup as RaTagGroup, Tag as RaTag } from "react-aria-components";

import type {
  TagGroupProps,
  TagGroupTagComponent,
  TagGroupTagProps,
} from "./tag-group.types";

export const { withContext, withProvider } = createSlotRecipeContext({
  key: "taggroup",
});

export const TagGroupRootSlot = withProvider<typeof RaTagGroup, TagGroupProps>(
  RaTagGroup,
  "root"
);

export const TagGroupTagSlot: TagGroupTagComponent = withContext<
  typeof RaTag,
  TagGroupTagProps
>(RaTag, "tag");
