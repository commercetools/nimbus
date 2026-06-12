import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { ReactNode, Ref } from "react";
import type {
  GridListProps as RaGridListProps,
  GridListItemProps as RaGridListItemProps,
} from "react-aria-components";
import type { OmitInternalProps } from "@/type-utils";

// ============================================================
// RECIPE PROPS
// ============================================================

type GridListRecipeProps = {
  /**
   * Size of the grid list, affecting row height, font size and spacing.
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusGridList">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type GridListRootSlotProps = HTMLChakraProps<"div", GridListRecipeProps>;

export type GridListItemSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the `GridList.Root` component.
 *
 * Wraps React Aria's `GridList`, providing keyboard navigation, single and
 * multiple selection, type-ahead, and opt-in drag-and-drop. Supports both
 * static composition (nested `GridList.Item` children) and dynamic collections
 * (`items` plus a render function).
 *
 * @template T - The item object type when using dynamic collections.
 */
export type GridListRootProps<T extends object = object> = Omit<
  RaGridListProps<T>,
  "className" | "style"
> &
  OmitInternalProps<GridListRootSlotProps, "children" | "slot"> & {
    /**
     * The grid list's contents — either nested `GridList.Item` elements
     * (static) or a render function when using the `items` prop (dynamic).
     */
    children?: RaGridListProps<T>["children"];
    /**
     * Ref to the root grid list element.
     */
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for the `GridList.Item` component.
 *
 * Represents a single interactive row in the grid list. Participates in
 * keyboard navigation, selection, and type-ahead. May render arbitrary content
 * via `children`.
 */
export type GridListItemProps = Omit<
  RaGridListItemProps,
  "className" | "style"
> &
  OmitInternalProps<GridListItemSlotProps, "children" | "slot" | "id"> & {
    /**
     * The content of the item — typically a plain text label, but can include
     * icons, actions, or other inline elements.
     */
    children?: ReactNode;
    /**
     * Ref to the grid list item element.
     */
    ref?: Ref<HTMLDivElement>;
  };
