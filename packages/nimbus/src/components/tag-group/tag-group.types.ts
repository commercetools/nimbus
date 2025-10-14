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

// ============================================================
// RECIPE PROPS
// ============================================================

type TagGroupRecipeVariantProps = {
  size?: SlotRecipeProps<"taggroup">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

type TagGroupRootSlotProps = HTMLChakraProps<"div", TagGroupRecipeVariantProps>;

type TagGroupTagListSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

type TagGroupTagSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

// ============================================================
// MAIN PROPS
// ============================================================

type TagGroupRootProps = TagGroupRootSlotProps & RaTagGroupProps;
export type TagGroupProps = TagGroupRecipeVariantProps &
  Omit<TagGroupRootProps, "size"> & {
    ref?: Ref<typeof RaTagGroup>;
  };

export type TagGroupRootComponent = FC<TagGroupProps>;

export type TagGroupTagListProps<T extends object> = RaTagListProps<T> &
  Omit<TagGroupTagListSlotProps, keyof RaTagListProps<T>> & {
    ref?: Ref<HTMLDivElement>;
  };

export type TagGroupTagListComponent<T extends object> = FC<
  TagGroupTagListProps<T>
>;

export type TagGroupTagProps = RaTagProps &
  Omit<TagGroupTagSlotProps, keyof RaTagProps> & {
    ref?: Ref<typeof RaTag>;
  };

export type TagGroupTagComponent = FC<TagGroupTagProps>;
