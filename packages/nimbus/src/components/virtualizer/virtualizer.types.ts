import type { ReactNode } from "react";
import type { themeTokens } from "@commercetools/nimbus-tokens";

// ============================================================
// LAYOUT OPTIONS
// ============================================================

/**
 * A spacing value: a Nimbus spacing token key (for example `"100"`) or a
 * number of pixels.
 */
export type VirtualizerSpacing = keyof typeof themeTokens.spacing | number;

/**
 * A width and height in pixels.
 */
export type VirtualizerSize = { width: number; height: number };

/**
 * Options for the list layout of a virtualized collection, passed as
 * `virtualizerOptions` to Nimbus list collections such as `ListBox.Root`.
 *
 * Rows are measured after they render unless `rowHeight` is set, so rows never
 * overlap or clip when the user zooms, overrides text spacing, or when labels
 * wrap. Set `rowHeight` only for uniform, single-line content.
 */
export type VirtualizerListLayoutOptions = {
  /**
   * Fixed height of every row in pixels. When set, rows are not measured.
   * Breaks when labels wrap or when the user overrides text spacing, so prefer
   * `estimatedRowHeight` unless every row is guaranteed to be a single line.
   */
  rowHeight?: number;
  /**
   * Estimated height in pixels of rows that are not rendered yet. Rendered
   * rows are measured and use their real height.
   * @default 48, or the collection's default
   */
  estimatedRowHeight?: number;
  /**
   * Fixed height of every section header in pixels. When set, headers are not
   * measured.
   */
  headingHeight?: number;
  /**
   * Estimated height in pixels of section headers that are not rendered yet.
   * Rendered headers are measured and use their real height.
   * @default 48, or the collection's default
   */
  estimatedHeadingHeight?: number;
  /**
   * Height in pixels of the loader row shown while more items load.
   * @default 48, or the collection's default
   */
  loaderHeight?: number;
  /**
   * Space between rows: a Nimbus spacing token (for example `"100"`) or a
   * number of pixels.
   * @default 0, or the collection's default
   */
  gap?: VirtualizerSpacing;
  /**
   * Space before the first and after the last row: a Nimbus spacing token
   * (for example `"200"`) or a number of pixels.
   * @default 0, or the collection's default
   */
  padding?: VirtualizerSpacing;
};

/**
 * Options for the grid layout, for GridList (FEC-1140). Not exported until a
 * collection with this layout gets `virtualizerOptions`.
 */
export type VirtualizerGridLayoutOptions = {
  /**
   * The minimum size of an item.
   * @default { width: 200, height: 200 }
   */
  minItemSize?: VirtualizerSize;
  /**
   * The maximum size of an item.
   * @default { width: Infinity, height: Infinity }
   */
  maxItemSize?: VirtualizerSize;
  /**
   * The minimum space between items.
   * @default { width: 18, height: 18 }
   */
  minSpace?: VirtualizerSize;
  /**
   * The maximum horizontal space between items.
   * @default Infinity
   */
  maxHorizontalSpace?: number;
  /**
   * The maximum number of columns.
   * @default Infinity
   */
  maxColumns?: number;
  /**
   * Whether every row keeps the aspect ratio of `minItemSize`.
   * @default false
   */
  preserveAspectRatio?: boolean;
  /**
   * Height in pixels of the loader row.
   * @default 48
   */
  loaderHeight?: number;
};

/**
 * Options for the table layout, for DataTable (FEC-1145). Not exported until a
 * collection with this layout gets `virtualizerOptions`.
 */
export type VirtualizerTableLayoutOptions = VirtualizerListLayoutOptions;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the internal {@link Virtualizer}. Nimbus collections render it
 * when a consumer sets `isVirtualized`; consumers never render it directly.
 */
export type VirtualizerProps =
  | {
      /**
       * How items are arranged.
       * @default "list"
       */
      layout?: "list";
      /** Options for the list layout. */
      layoutOptions?: VirtualizerListLayoutOptions;
      /** The React Aria collection to virtualize. */
      children: ReactNode;
    }
  | {
      layout: "grid";
      layoutOptions?: VirtualizerGridLayoutOptions;
      children: ReactNode;
    }
  | {
      layout: "table";
      layoutOptions?: VirtualizerTableLayoutOptions;
      children: ReactNode;
    };
