import type {
  HTMLChakraProps,
  RecipeProps,
  RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import { paginationRecipe } from "./pagination.recipe";
import type { PropsWithChildren } from "react";

// ============================================================
// Root Component (`<Pagination>`)
// ============================================================

/** Base Chakra styling props for the root `nav` slot. */
type PaginationRootSlotProps = HTMLChakraProps<"nav", RecipeProps<"nav">>;

/** Combined props for the root element (Chakra styles + Recipe variants). */
type PaginationRootProps = PaginationRootSlotProps &
  RecipeVariantProps<typeof paginationRecipe> & {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    showFirstLast?: boolean;
    "aria-label"?: string;
  };

/** Final external props for the `<Pagination>` component, including `children`. */
export type PaginationProps = PropsWithChildren<PaginationRootProps> & {
  ref?: React.Ref<HTMLElement>;
};

/** Type signature for the main `Pagination` component. */
export type PaginationRootComponent = React.FC<PaginationProps>;

// ============================================================
// List Sub-Component (`<Pagination.List>`)
// ============================================================

/** Base Chakra styling props for the `ol` slot. */
type PaginationListSlotProps = HTMLChakraProps<"ol", RecipeProps<"ol">>;

/** Combined props for the list element. */
export type PaginationListProps = PropsWithChildren<PaginationListSlotProps> & {
  ref?: React.Ref<HTMLOListElement>;
};

/** Type signature for the `Pagination.List` sub-component. */
export type PaginationListComponent = React.FC<PaginationListProps>;

// ============================================================
// Item Sub-Component (`<Pagination.Item>`)
// ============================================================

/** Base Chakra styling props for the `li` slot. */
type PaginationItemSlotProps = HTMLChakraProps<"li", RecipeProps<"li">>;

/** Combined props for the item element. */
export type PaginationItemProps = PaginationItemSlotProps & {
  page: number;
  isActive?: boolean;
  isDisabled?: boolean;
  "aria-current"?: "page" | undefined;
  onPageChange?: (page: number) => void;
  ref?: React.Ref<HTMLLIElement>;
};

/** Type signature for the `Pagination.Item` sub-component. */
export type PaginationItemComponent = React.FC<PaginationItemProps>;

// ============================================================
// Ellipsis Sub-Component (`<Pagination.Ellipsis>`)
// ============================================================

/** Base Chakra styling props for the `span` slot. */
type PaginationEllipsisSlotProps = HTMLChakraProps<"span", RecipeProps<"span">>;

/** Combined props for the ellipsis element. */
export type PaginationEllipsisProps = PaginationEllipsisSlotProps & {
  direction?: "start" | "end";
  ref?: React.Ref<HTMLSpanElement>;
};

/** Type signature for the `Pagination.Ellipsis` sub-component. */
export type PaginationEllipsisComponent = React.FC<PaginationEllipsisProps>;

// ============================================================
// Previous Trigger Sub-Component (`<Pagination.PrevTrigger>`)
// ============================================================

/** Base Chakra styling props for the `button` slot. */
type PaginationPrevTriggerSlotProps = HTMLChakraProps<
  "button",
  RecipeProps<"button">
>;

/** Combined props for the previous button element. */
export type PaginationPrevTriggerProps = PaginationPrevTriggerSlotProps & {
  isDisabled?: boolean;
  "aria-label"?: string;
  onPageChange?: (page: number) => void;
  ref?: React.Ref<HTMLButtonElement>;
};

/** Type signature for the `Pagination.PrevTrigger` sub-component. */
export type PaginationPrevTriggerComponent =
  React.FC<PaginationPrevTriggerProps>;

// ============================================================
// Next Trigger Sub-Component (`<Pagination.NextTrigger>`)
// ============================================================

/** Base Chakra styling props for the `button` slot. */
type PaginationNextTriggerSlotProps = HTMLChakraProps<
  "button",
  RecipeProps<"button">
>;

/** Combined props for the next button element. */
export type PaginationNextTriggerProps = PaginationNextTriggerSlotProps & {
  isDisabled?: boolean;
  "aria-label"?: string;
  onPageChange?: (page: number) => void;
  ref?: React.Ref<HTMLButtonElement>;
};

/** Type signature for the `Pagination.NextTrigger` sub-component. */
export type PaginationNextTriggerComponent =
  React.FC<PaginationNextTriggerProps>;
