import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { ReactNode, Ref } from "react";
import type {
  TreeProps as RaTreeProps,
  TreeItemProps as RaTreeItemProps,
  ButtonProps as RaButtonProps,
} from "react-aria-components";
import type { OmitInternalProps } from "@/type-utils";

// ============================================================
// RECIPE PROPS
// ============================================================

type TreeRecipeProps = {
  /**
   * Size of the tree, affecting row height, font size, chevron size and
   * indentation step.
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusTree">["size"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type TreeRootSlotProps = HTMLChakraProps<"div", TreeRecipeProps>;

export type TreeItemSlotProps = HTMLChakraProps<"div">;

export type TreeItemContentSlotProps = HTMLChakraProps<"div">;

export type TreeIndicatorSlotProps = HTMLChakraProps<"button">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the `Tree.Root` component.
 *
 * Wraps React Aria's `Tree`, providing keyboard navigation, expand/collapse,
 * selection, type-ahead and opt-in drag-and-drop. Supports both static
 * composition (nested `Tree.Item` children) and dynamic collections (`items`
 * plus a recursive render function).
 *
 * @template T - The item object type when using dynamic collections.
 */
export type TreeRootProps<T extends object = object> = Omit<
  RaTreeProps<T>,
  "className" | "style"
> &
  OmitInternalProps<TreeRootSlotProps, "children" | "slot"> & {
    /**
     * The tree's contents — either nested `Tree.Item` elements (static) or a
     * render function when using the `items` prop (dynamic).
     */
    children?: RaTreeProps<T>["children"];
    /**
     * Ref to the root tree element.
     */
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for the `Tree.Item` component.
 *
 * Represents a single node in the tree. May contain a `Tree.ItemContent` and,
 * optionally, nested `Tree.Item` elements (or a React Aria `Collection` for
 * dynamic children).
 *
 * @template T - The item object type when using dynamic collections.
 */
export type TreeItemProps<T extends object = object> = Omit<
  RaTreeItemProps<T>,
  "className" | "style" | "textValue"
> &
  OmitInternalProps<TreeItemSlotProps, "children" | "slot" | "id"> & {
    /**
     * A string representation of the item's contents, used for type-ahead.
     * Falls back to string children when omitted.
     */
    textValue?: string;
    /**
     * The item's content (`Tree.ItemContent`) and any nested `Tree.Item`s.
     */
    children?: ReactNode;
    /**
     * Ref to the tree item (row) element.
     */
    ref?: Ref<HTMLDivElement>;
  };

/**
 * Props for the `Tree.ItemContent` component.
 *
 * The content row of a tree item. Lays out the expand/collapse indicator,
 * an optional selection checkbox (rendered automatically in multiple-selection
 * mode), and the item's label. Applies level-based indentation.
 */
export type TreeItemContentProps = OmitInternalProps<
  TreeItemContentSlotProps,
  "slot"
> & {
  /**
   * The content of the row, typically a `Tree.Indicator` followed by a label.
   */
  children?: ReactNode;
  /**
   * Ref to the content container element.
   */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Props for the `Tree.Indicator` component.
 *
 * The expand/collapse chevron button. Visible only for items that have child
 * items, and rotated when the item is expanded. Renders a default chevron icon
 * that can be overridden via `children`.
 */
export type TreeIndicatorProps = Omit<
  RaButtonProps,
  "className" | "style" | "slot"
> &
  OmitInternalProps<TreeIndicatorSlotProps, "children"> & {
    /**
     * Custom indicator content. Defaults to a chevron icon.
     */
    children?: ReactNode;
    /**
     * Ref to the indicator button element.
     */
    ref?: Ref<HTMLButtonElement>;
  };
