import type {
  GridListProps as RaGridListProps,
  GridListItemProps as RaGridListItemProps,
} from "react-aria-components";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "../../type-utils/omit-props";
import type { SimpleGridProps } from "../simple-grid/simple-grid";

// ============================================================
// RECIPE PROPS
// ============================================================

type GridListRecipeProps = {
  /**
   * Size of the items: sets the item padding, the default gap between items
   * and the size of the built-in drag handle. The built-in selection checkbox
   * keeps its one size at every GridList size. Content you render inside an
   * item keeps its own size.
   * Accepts the plain values only (not a responsive object), because the drag
   * handle size is chosen from it.
   * @default "md"
   */
  size?: Extract<SlotRecipeProps<"nimbusGridList">["size"], string>;
};

// ============================================================
// SLOT PROPS
// ============================================================

export type GridListRootSlotProps = HTMLChakraProps<
  "div",
  GridListRecipeProps & RaGridListProps<object>
>;
export type GridListItemSlotProps = HTMLChakraProps<"div">;
export type GridListItemContentSlotProps = HTMLChakraProps<"div">;
export type GridListEmptyStateSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * Column control for the grid. Set `columns` or `minChildWidth`, not both:
 * `minChildWidth` overrides `columns` when both are set, so the types forbid
 * the combination. Both accept a plain value or a responsive object such as
 * `{ base: 1, md: 3 }`. They are ignored with `layout="stack"` (one column).
 */
type GridListColumnsProps =
  | {
      /**
       * Number of columns. Accepts a responsive object, for example
       * `{ base: 1, md: 3 }`.
       */
      columns?: SimpleGridProps["columns"];
      minChildWidth?: never;
    }
  | {
      columns?: never;
      /**
       * Minimum width of an item. The number of columns follows the container
       * width. Accepts a responsive object.
       */
      minChildWidth?: SimpleGridProps["minChildWidth"];
    };

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for `GridList.Root`. Extends React Aria's `GridListProps` (selection,
 * `layout`, `orientation`, `onAction`, `keyboardNavigationBehavior`,
 * `dragAndDropHooks`, `renderEmptyState`) with Nimbus recipe variants,
 * responsive grid props and style props.
 */
export type GridListRootProps<T extends object = object> = RaGridListProps<T> &
  OmitInternalProps<
    GridListRootSlotProps,
    keyof RaGridListProps<T> | "gap" | "columns" | "minChildWidth"
  > &
  GridListColumnsProps & {
    /**
     * Space between items. Accepts a responsive object. Overrides the gap
     * that comes from `size`.
     */
    gap?: SimpleGridProps["gap"];
    /**
     * Show a selection checkbox in every item. It only appears when
     * `selectionMode="multiple"`. An item can override this with its own
     * `showSelectionCheckbox`.
     * @default false
     */
    showSelectionCheckbox?: boolean;
    /**
     * Show a drag handle in every item. It only appears when dragging is
     * enabled through `dragAndDropHooks`. An item can override this with its
     * own `showDragHandle`.
     * @default false
     */
    showDragHandle?: boolean;
    /**
     * Ref forwarding to the grid element.
     */
    ref?: React.Ref<HTMLDivElement>;
  };

/**
 * Props for `GridList.Item`. Extends React Aria's `GridListItemProps`. Give
 * items a `textValue` when the children are not plain text.
 */
export type GridListItemProps<T extends object = object> = Omit<
  RaGridListItemProps<T>,
  | "onClick"
  | "translate"
  | "onBlur"
  | "onFocus"
  | "onKeyDown"
  | "onKeyUp"
  | "onMouseDown"
  | "onMouseUp"
> &
  OmitInternalProps<GridListItemSlotProps, keyof RaGridListItemProps<T>> & {
    /**
     * Show a selection checkbox in this item. Overrides the Root setting.
     * It only appears when `selectionMode="multiple"`.
     * @default inherits from GridList.Root
     */
    showSelectionCheckbox?: boolean;
    /**
     * Show a drag handle in this item. Overrides the Root setting. It only
     * appears when dragging is enabled through `dragAndDropHooks`.
     * @default inherits from GridList.Root
     */
    showDragHandle?: boolean;
    /**
     * Ref forwarding to the item element.
     */
    ref?: React.Ref<HTMLDivElement>;
  };
