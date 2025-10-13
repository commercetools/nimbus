import type { ReactElement } from "react";
import {
  createSlotRecipeContext,
  type WithProviderOptions,
  type WithContextOptions,
} from "@chakra-ui/react";

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

type TagListSlotNames = "root" | "tagList" | "tag";

export const {
  withProvider,
  withContext,
}: {
  withProvider: <T, P>(
    Component: React.ElementType<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    slot: TagListSlotNames,
    options?: WithProviderOptions<P>
  ) => React.ForwardRefExoticComponent<
    React.PropsWithoutRef<P> & React.RefAttributes<T>
  >;
  withContext: <T, P>(
    Component: React.ElementType<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    slot?: TagListSlotNames,
    options?: WithContextOptions<P>
  ) => React.ForwardRefExoticComponent<
    React.PropsWithoutRef<P> & React.RefAttributes<T>
  >;
} = createSlotRecipeContext({
  key: "taggroup",
});

export const TagGroupRootSlot = withProvider<typeof RaTagGroup, TagGroupProps>(
  RaTagGroup,
  "root"
);

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
