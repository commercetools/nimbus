import type {
  HTMLChakraProps,
  RecipeProps,
  SlotRecipeProps,
} from "@chakra-ui/react";
import type { FC, Ref } from "react";
import {
  TagGroup as RaTagGroup,
  type TagGroupProps as RaTagGroupProps,
  type TagListProps as RaTagListProps,
  Tag as RaTag,
  type TagProps as RaTagProps,
} from "react-aria-components";

type TagGroupRecipeVariantProps = SlotRecipeProps<"taggroup">;

// ============================================================
// Root Component (`<TagGroup.Root>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type TagGroupRootSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined props for the root element (Chakra styles + Aria behavior). */
type TagGroupRootProps = TagGroupRootSlotProps & RaTagGroupProps;

/** Final external props for the `<TagGroup>` component, including `children`. */
export type TagGroupProps = TagGroupRecipeVariantProps &
  Omit<TagGroupRootProps, "size"> & {
    ref?: Ref<typeof RaTagGroup>;
  };

/** Type signature for the main `TagGroup` component. */
export type TagGroupRootComponent = FC<TagGroupProps>;

// ============================================================
// TagList Sub-Component (`<TagGroup.TagList>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type TagGroupTagListSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined props for the tagList element (Chakra styles + Aria behavior + Recipe variants). */
export type TagGroupTagListProps<T extends object> = RaTagListProps<T> &
  Omit<TagGroupTagListSlotProps, keyof RaTagListProps<T>> & {
    ref?: Ref<HTMLDivElement>;
  };

/** Type signature for the `TagGroup.TagList` sub-component. */
export type TagGroupTagListComponent<T extends object> = FC<
  TagGroupTagListProps<T>
>;

// ============================================================
// Tag Sub-Component (`<TagGroup.Tag>`)
// ============================================================

/** Base Chakra styling props for the root `div` slot. */
type TagGroupTagSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

/** Combined props for the tag element (Chakra styles + Aria behavior + Recipe variants). */
export type TagGroupTagProps = RaTagProps &
  Omit<TagGroupTagSlotProps, keyof RaTagProps> & {
    ref?: Ref<typeof RaTag>;
  };

/** Type signature for the `TagGroup.Tag` sub-component. */
export type TagGroupTagComponent = FC<TagGroupTagProps>;
