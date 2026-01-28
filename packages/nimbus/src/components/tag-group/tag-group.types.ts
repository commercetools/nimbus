import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  RecipeProps,
  ConditionalValue,
} from "@chakra-ui/react";
import type { FC, Ref } from "react";
import {
  TagGroup as RaTagGroup,
  type TagGroupProps as RaTagGroupProps,
  type TagListProps as RaTagListProps,
  Tag as RaTag,
  type TagProps as RaTagProps,
} from "react-aria-components";
import type { TagGroupSize } from "./tag-group.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type TagGroupRecipeProps = {
  /**
   * Size variant of the tag group
   * @default "lg"
   */
  size?: ConditionalValue<TagGroupSize | undefined>;
};

// ============================================================
// SLOT PROPS
// ============================================================

type TagGroupRootSlotProps = HTMLChakraProps<"div", TagGroupRecipeProps>;

type TagGroupTagListSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

type TagGroupTagSlotProps = HTMLChakraProps<"div", RecipeProps<"div">>;

// ============================================================
// MAIN PROPS
// ============================================================

type TagGroupRootProps = TagGroupRootSlotProps & RaTagGroupProps;
export type TagGroupProps = TagGroupRecipeProps &
  OmitInternalProps<TagGroupRootProps, "size"> & {
    ref?: Ref<typeof RaTagGroup>;
  };

export type TagGroupRootComponent = FC<TagGroupProps>;

export type TagGroupTagListProps<T extends object> = RaTagListProps<T> &
  OmitInternalProps<TagGroupTagListSlotProps, keyof RaTagListProps<T>> & {
    ref?: Ref<HTMLDivElement>;
  };

export type TagGroupTagListComponent<T extends object> = FC<
  TagGroupTagListProps<T>
>;

export type TagGroupTagProps = RaTagProps &
  OmitInternalProps<TagGroupTagSlotProps, keyof RaTagProps> & {
    ref?: Ref<typeof RaTag>;
  };

export type TagGroupTagComponent = FC<TagGroupTagProps>;
