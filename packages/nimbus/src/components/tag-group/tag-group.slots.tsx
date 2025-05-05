import { createSlotRecipeContext } from "@chakra-ui/react";
import {
  TagGroup as RaTagGroup,
  TagList as RaTagList,
  Tag as RaTag,
} from "react-aria-components";

import type {
  TagGroupProps,
  TagGroupTagListComponent,
  TagGroupTagListProps,
  TagGroupTagComponent,
  TagGroupTagProps,
} from "./tag-group.types";

const { withContext, withProvider } = createSlotRecipeContext({
  key: "taggroup",
});

export const TagGroupRootSlot = withProvider<typeof RaTagGroup, TagGroupProps>(
  RaTagGroup,
  "root"
);

export const TagGroupTagListSlot: TagGroupTagListComponent<object> =
  withContext<typeof RaTagList, TagGroupTagListProps<object>>(
    RaTagList,
    "tagList"
  );

export const TagGroupTagSlot: TagGroupTagComponent = withContext<
  typeof RaTag,
  TagGroupTagProps
>(RaTag, "tag");
