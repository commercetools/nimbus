import type { ReactElement } from "react";
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
import type { SlotComponent } from "../utils/slot-types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "taggroup",
});

export const TagGroupRootSlot: SlotComponent<typeof RaTagGroup, TagGroupProps> =
  withProvider<typeof RaTagGroup, TagGroupProps>(RaTagGroup, "root");

export const TagGroupTagListSlot = <T extends object>(
  props: TagGroupTagListProps<T>
): ReactElement<TagGroupTagListProps<T>, TagGroupTagListComponent<T>> => {
  const { ref, ...restProps } = props;
  const SlotComponent = withContext<HTMLDivElement, TagGroupTagListProps<T>>(
    RaTagList,
    "tagList"
  );
  return <SlotComponent {...restProps} ref={ref} />;
};

export const TagGroupTagSlot: TagGroupTagComponent = withContext<
  typeof RaTag,
  TagGroupTagProps
>(RaTag, "tag");
