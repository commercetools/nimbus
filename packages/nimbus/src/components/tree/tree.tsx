import {
  TreeRoot,
  TreeItem,
  TreeItemContent,
  TreeIndicator,
} from "./components";

/**
 * # Tree
 *
 * A hierarchical list for navigating nested data such as file trees and
 * navigation structures. Wraps React Aria's `Tree` for keyboard navigation,
 * expand/collapse, selection, type-ahead and opt-in drag-and-drop, with
 * WCAG 2.1 AA semantics. React Aria renders the tree as an ARIA `treegrid`
 * (`role="treegrid"` → `row` → `gridcell`, with `aria-level`/`aria-expanded`/
 * `aria-selected`) — its screen-reader-tested pattern for interactive trees.
 *
 * @example
 * ```tsx
 * <Tree.Root aria-label="Files" selectionMode="multiple">
 *   <Tree.Item id="documents" textValue="Documents">
 *     <Tree.ItemContent>
 *       <Tree.Indicator />
 *       Documents
 *     </Tree.ItemContent>
 *     <Tree.Item id="report" textValue="Weekly Report">
 *       <Tree.ItemContent>
 *         <Tree.Indicator />
 *         Weekly Report
 *       </Tree.ItemContent>
 *     </Tree.Item>
 *   </Tree.Item>
 * </Tree.Root>
 * ```
 */
export const Tree = {
  /**
   * # Tree.Root
   *
   * The root container for the tree. Provides the recipe context, keyboard
   * navigation, selection and opt-in drag-and-drop. Always the first part.
   *
   * @example
   * ```tsx
   * <Tree.Root aria-label="Files" selectionMode="single">
   *   <Tree.Item id="a" textValue="Item A">
   *     <Tree.ItemContent>
   *       <Tree.Indicator />
   *       Item A
   *     </Tree.ItemContent>
   *   </Tree.Item>
   * </Tree.Root>
   * ```
   */
  Root: TreeRoot,

  /**
   * # Tree.Item
   *
   * A single node in the tree. Contains a `Tree.ItemContent` and, optionally,
   * nested `Tree.Item` elements (or a React Aria `Collection` for dynamic
   * children).
   *
   * @example
   * ```tsx
   * <Tree.Item id="folder" textValue="Folder">
   *   <Tree.ItemContent>
   *     <Tree.Indicator />
   *     Folder
   *   </Tree.ItemContent>
   *   <Tree.Item id="child" textValue="Child">
   *     <Tree.ItemContent>Child</Tree.ItemContent>
   *   </Tree.Item>
   * </Tree.Item>
   * ```
   */
  Item: TreeItem,

  /**
   * # Tree.ItemContent
   *
   * The content row of a tree item. Lays out the expand/collapse indicator, an
   * optional selection checkbox (in multiple-selection mode) and the label, and
   * applies level-based indentation.
   *
   * @example
   * ```tsx
   * <Tree.ItemContent>
   *   <Tree.Indicator />
   *   Documents
   * </Tree.ItemContent>
   * ```
   */
  ItemContent: TreeItemContent,

  /**
   * # Tree.Indicator
   *
   * The expand/collapse chevron. Visible only for items with children and
   * rotated when expanded. Renders a default chevron icon, override-able via
   * children.
   *
   * @example
   * ```tsx
   * <Tree.ItemContent>
   *   <Tree.Indicator />
   *   Folder
   * </Tree.ItemContent>
   * ```
   */
  Indicator: TreeIndicator,
};

export {
  TreeRoot as _TreeRoot,
  TreeItem as _TreeItem,
  TreeItemContent as _TreeItemContent,
  TreeIndicator as _TreeIndicator,
};
