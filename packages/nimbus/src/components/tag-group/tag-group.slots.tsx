import type { ReactElement } from "react";
import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import {
  TagGroup as RaTagGroup,
  TagList as RaTagList,
  Tag as RaTag,
} from "react-aria-components";
import type { SlotComponent } from "@/type-utils";
import type {
  TagGroupProps,
  TagGroupTagListComponent,
  TagGroupTagListProps,
  TagGroupTagComponent,
  TagGroupTagProps,
} from "./tag-group.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusTagGroup",
});

export const TagGroupRootSlot: SlotComponent<typeof RaTagGroup, TagGroupProps> =
  withProvider<typeof RaTagGroup, TagGroupProps>(RaTagGroup, "root");

// Defined at module scope — calling withContext inside the component would
// produce a new component identity on every render, forcing React to unmount
// and remount the entire TagList subtree (and React Aria to rebuild its
// collection from scratch) on every parent render. That was a hot-path
// regression for high tag counts.
const TagListSlotComponent = withContext<
  HTMLDivElement,
  TagGroupTagListProps<object>
>(RaTagList, "tagList");

export const TagGroupTagListSlot = <T extends object>(
  props: TagGroupTagListProps<T>
): ReactElement<TagGroupTagListProps<T>, TagGroupTagListComponent<T>> => {
  return <TagListSlotComponent {...(props as TagGroupTagListProps<object>)} />;
};

export const TagGroupTagSlot: TagGroupTagComponent = withContext<
  typeof RaTag,
  TagGroupTagProps
>(RaTag, "tag");
