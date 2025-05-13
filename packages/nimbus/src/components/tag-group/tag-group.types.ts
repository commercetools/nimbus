import type {
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
  FC,
} from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
  RecipeVariantProps,
} from "@chakra-ui/react";
import {
  TagGroup as RaTagGroup,
  type TagGroupProps as RaTagGroupProps,
  TagList as RaTagList,
  type TagListProps as RaTagListProps,
  Tag as RaTag,
  type TagProps as RaTagProps,
} from "react-aria-components";
import { tagGroupSlotRecipe } from "./tag-group.recipe";

// ============================================================
// Root Component (`<TagGroup.Root>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type TagGroupRootSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined props for the root element (Chakra styles + Aria behavior + Recipe variants). */
type TagGroupRootProps = TagGroupRootSlotProps &
  RaTagGroupProps &
  RecipeVariantProps<typeof tagGroupSlotRecipe>;

/** Final external props for the `<TagGroup>` component, including `children`. */
export type TagGroupProps = PropsWithChildren<TagGroupRootProps>;

/** Type signature for the main `TagGroup` component (using `forwardRef`). */
export type TagGroupRootComponent = FC<
  TagGroupRootProps & RefAttributes<typeof RaTagGroup>
>;

// ============================================================
// TagList Sub-Component (`<TagGroup.TagList>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type TagGroupTagListSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined props for the tagList element (Chakra styles + Aria behavior + Recipe variants). */
export type TagGroupTagListProps<T extends object> = RaTagListProps<T> &
  Omit<TagGroupTagListSlotProps, keyof RaTagListProps<T>>;

/** Type signature for the `TagGroup.TagList` sub-component (using `forwardRef`). */
export type TagGroupTagListComponent<T extends object> = FC<
  TagGroupTagListProps<T> & RefAttributes<HTMLDivElement>
>;

// ============================================================
// Tag Sub-Component (`<TagGroup.Tag>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type TagGroupTagSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined props for the tag element (Chakra styles + Aria behavior + Recipe variants). */
export type TagGroupTagProps = RaTagProps &
  Omit<TagGroupTagSlotProps, keyof RaTagProps>;

/** Type signature for the `TagGroup.Tag` sub-component (using `forwardRef`). */
export type TagGroupTagComponent = FC<
  TagGroupTagProps & RefAttributes<typeof RaTag>
>;
