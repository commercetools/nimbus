import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  RecipeProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { FC, Ref } from "react";
import type {
  BreadcrumbsProps as RaBreadcrumbsProps,
  BreadcrumbProps as RaBreadcrumbProps,
  LinkProps as RaLinkProps,
} from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type BreadcrumbsRecipeVariantProps = {
  /**
   * Size variant of the breadcrumbs.
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusBreadcrumbs">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

// The root slot renders the <nav> landmark and carries the recipe variants.
type BreadcrumbsRootSlotProps = HTMLChakraProps<
  "nav",
  BreadcrumbsRecipeVariantProps
>;

type BreadcrumbsItemSlotProps = HTMLChakraProps<"li", RecipeProps<"li">>;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for `Breadcrumbs.Root`.
 *
 * The Root renders a navigation landmark (`<nav>`) wrapping the React Aria
 * `Breadcrumbs` collection. It accepts the recipe `size` variant, Nimbus style
 * props on the `<nav>`, and the React Aria collection props (`items`,
 * `onAction`, `isDisabled`, `children`) which are forwarded to the inner list.
 */
type BreadcrumbsRootProps<T extends object> = BreadcrumbsRootSlotProps &
  RaBreadcrumbsProps<T>;

export type BreadcrumbsProps<T extends object = object> =
  BreadcrumbsRecipeVariantProps &
    OmitInternalProps<BreadcrumbsRootProps<T>, "size"> & {
      ref?: Ref<HTMLElement>;
    };

export type BreadcrumbsRootComponent = FC<BreadcrumbsProps>;

/**
 * Props for the inner list slot — the React Aria `Breadcrumbs` collection
 * (`<ol>`). Style props are omitted from the public Root API and applied
 * internally.
 */
export type BreadcrumbsListProps = RaBreadcrumbsProps<object> & {
  ref?: Ref<HTMLOListElement>;
};

/**
 * Props for `Breadcrumbs.Item`.
 *
 * Combines React Aria's `Breadcrumb` props (collection item semantics,
 * `id` for `onAction`) with the props of the link it renders (`href`,
 * `onPress`, routing props) so a single element can act as both the list item
 * and its interactive link.
 */
export type BreadcrumbsItemProps = RaBreadcrumbProps &
  Omit<RaLinkProps, "className" | "style" | "children"> &
  OmitInternalProps<
    BreadcrumbsItemSlotProps,
    keyof RaBreadcrumbProps | keyof RaLinkProps
  > & {
    ref?: Ref<HTMLLIElement>;
  };

export type BreadcrumbsItemComponent = FC<BreadcrumbsItemProps>;
