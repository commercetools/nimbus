import { defineSlotRecipe } from "@chakra-ui/react/styled-system";
import type { DataTableSize } from "./data-table.types";
import {
  DATA_TABLE_CELL_PADDING_X,
  DATA_TABLE_DEFAULT_SIZE,
  DATA_TABLE_INTERNAL_COLUMN_WIDTHS,
} from "./utils/sizes.utils";

// Stacking order inside the table, lowest first. Frozen (sticky) cells must
// stay above the cells that scroll under them, the focus ring and the pinned
// row outline must stay above frozen cells, and the sticky header must stay
// above everything in the body.
const zIndex = {
  // Background extension of a frozen cell, behind the cell's own content.
  stickyBgOverlap: -1,
  // Column resize handle, above the header cell's content.
  columnResizer: 2,
  // Frozen pin cell at the right edge. Frozen cells of pinned rows use the
  // same level.
  pinCell: 3,
  pinnedRowFrozenCell: 3,
  // Expand cell next to the selection cell: below it, so the selection
  // cell's scroll shadow falls over the expand cell.
  expandCellAfterSelection: 10,
  // Frozen body cells at the left edge. The expand cell is above the drag
  // cell, so it covers the drag cell's scroll shadow.
  frozenCell: 11,
  expandCell: 12,
  // Focus ring and pinned row outline in the body, above every frozen body
  // cell.
  bodyLayer: 13,
  // Frozen header cells. The pin header is below the others.
  pinHeaderCell: 11,
  expandHeaderCell: 12,
  frozenHeaderCell: 13,
  // Sticky header, above the body layer so rows that scroll under the
  // header stay hidden. Also the header's focus ring layer, above every
  // frozen header cell.
  header: 14,
} as const;

// Pseudo-element that extends a sticky cell's background by 2px on each side.
// Fixes a Firefox/Safari rendering gap where the table's inset box-shadow
// bleeds through at the edges of sticky cells in border-collapse:collapse tables.
const stickyBgOverlap = {
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "-2px",
    right: "-2px",
    background: "inherit",
    pointerEvents: "none",
    zIndex: zIndex.stickyBgOverlap,
  },
} as const;

// A layer covering a row, cell or column header, drawn above the frozen
// (sticky) cells so their backgrounds cannot hide it. The focus ring and the
// pinned-row outline share it and use different properties (`outline` and
// `box-shadow`), so a focused pinned row shows both. It must be `::after`: in
// a table row, `::before` takes the place of the first cell and shifts every
// cell one column to the right. `zIndex` must be higher than every frozen
// cell next to the element. The element, or the cell that contains it, must
// be positioned.
const layerAboveFrozenCells = (layerZIndex: number) =>
  ({
    content: '""',
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: layerZIndex,
  }) as const;

const bodyLayer = layerAboveFrozenCells(zIndex.bodyLayer);
const headerLayer = layerAboveFrozenCells(zIndex.header);

// Keyboard focus ring for rows, cells and column headers. An outline on the
// element itself is drawn just outside its box, where neighbouring frozen
// cells, the next row and the table edge cover parts of it. This ring is
// drawn inside the element's box instead.
const focusRingOn = (layer: typeof bodyLayer) =>
  ({
    _focusVisible: {
      outline: "none",
      _after: {
        ...layer,
        layerStyle: "focusRing",
        outlineOffset: "calc(var(--focus-ring-width) * -1)",
      },
    },
  }) as const;

const bodyFocusRing = focusRingOn(bodyLayer);
const headerFocusRing = focusRingOn(headerLayer);

// Outline of a group of pinned rows. `edges` lists the inset shadows for the
// sides this row draws.
const pinnedOutline = (edges: string) =>
  ({
    _after: { ...bodyLayer, boxShadow: edges },
  }) as const;

/**
 * Internal column widths as CSS variables, read by the sticky offsets below.
 * The same numbers are passed to React Aria in `data-table.header.tsx`, so
 * the offsets and the column widths cannot drift apart.
 */
const internalColumnWidthVars = (size: DataTableSize) => ({
  "--data-table-drag-column-width": `${DATA_TABLE_INTERNAL_COLUMN_WIDTHS[size].bare}px`,
  "--data-table-selection-column-width": `${DATA_TABLE_INTERNAL_COLUMN_WIDTHS[size].padded}px`,
});

/**
 * Size variant shared with `Table` (`table.recipe.ts`, `size` variant): same
 * cell and column header padding, same text style. Keep the two in sync.
 *
 * The base styles hold the `xl` values (the pre-`size` appearance); these
 * variants override them. Only the header height changes shape: `xl` has a
 * fixed 40px header, the shared sizes size the header by its padding, as
 * `Table` does.
 */
const sharedSizeVariant = (
  size: Exclude<DataTableSize, "xl">,
  {
    paddingY,
    fontSize,
    textStyle,
  }: { paddingY: string; fontSize: string; textStyle: string }
) => {
  const paddingX = DATA_TABLE_CELL_PADDING_X[size].token;
  // The header sets fontSize/lineHeight explicitly in the base styles, so
  // override them here rather than relying on textStyle alone.
  const headerText = { textStyle, fontSize, lineHeight: "550" };
  return {
    root: {
      ...internalColumnWidthVars(size),
      "& .data-table-header": { ...headerText, height: "auto" },
    },
    header: { ...headerText, height: "auto" },
    column: {
      lineHeight: "550",
      "& > .nimbus-data-table__column-container": {
        py: paddingY,
        px: paddingX,
      },
      "&.selection-column-header": {
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
      },
      "&.pin-rows-column-header": {
        py: paddingY,
        px: paddingX,
      },
    },
    cell: {
      textStyle,
      paddingTop: paddingY,
      paddingBottom: paddingY,
      paddingLeft: paddingX,
      paddingRight: paddingX,
    },
  };
};

/**
 * Slot recipe configuration for the DataTable component.
 * Defines the styling variants, base styles, and slots using Chakra UI's slot recipe system.
 */
export const dataTableSlotRecipe = defineSlotRecipe({
  // Available slots for the DataTable component
  slots: [
    "root",
    "table",
    "header",
    "column",
    "body",
    "row",
    "cell",
    "footer",
    "headerSortIcon",
    "columnResizer",
  ],
  className: "nimbus-data-table",
  base: {
    root: {
      // CSS custom properties for pinned row shadows
      "--data-table-pinned-shadow-left": "inset 2px 0 0 {colors.neutral.7}",
      "--data-table-pinned-shadow-right": "inset -2px 0 0 {colors.neutral.7}",
      "--data-table-pinned-shadow-top": "inset 0 2px 0 {colors.neutral.7}",
      "--data-table-pinned-shadow-bottom": "inset 0 -2px 0 {colors.neutral.7}",

      width: "100%",
      display: "block",
      overflow: "auto",
      contain: "layout style",
      border: "1px solid {colors.neutral.3}",
      borderRadius: "{sizes.200}",

      // Scroll shadows activated by JS scroll detection via data attributes.
      // Body selectors include .data-table-row to beat the base specificity.
      // Left-side sticky cells get a right shadow (facing the scrolled content).
      // Pin-row-cell is excluded (it's sticky-right, shadowed separately).
      // The expand column is excluded when it follows selection, because
      // selection already casts the shadow at that edge.
      "&[data-scroll-left='true']": {
        "& .data-table-row .data-table-sticky-cell:not([data-slot='pin-row-cell']):not([data-slot='selection'] ~ [data-slot='expand'])":
          { boxShadow: "{shadows.right}" },
        "& .data-table-header .selection-column-header, & .data-table-header .drag-column-header, & .data-table-header .expand-column-header:not(.selection-column-header ~ .expand-column-header)":
          { boxShadow: "{shadows.right}" },
      },
      "&[data-scroll-right='true']": {
        "& .data-table-row [data-slot='pin-row-cell']": {
          boxShadow: "{shadows.left}",
        },
        "& .data-table-header .pin-rows-column-header": {
          boxShadow: "{shadows.left}",
        },
      },

      // Pinned rows carry `.data-table-row` too, so everything here applies
      // to them as well.
      "& .data-table-row": {
        "& [data-slot='pin-row-cell']": {
          position: "sticky",
          right: 0,
          zIndex: zIndex.pinCell,
          backgroundColor: "var(--data-table-row-bg, inherit)",
          ...stickyBgOverlap,
          "&::before": { right: 0 },
          "& [data-slot='nimbus-table-cell-pin-button']": {
            opacity: 0,
          },
          "& [data-slot='nimbus-table-cell-pin-button-pinned']": {
            opacity: 1,
          },
        },
        "& .data-table-sticky-cell:not([data-slot='pin-row-cell'])": {
          position: "sticky",
          left: 0,
          backgroundColor: "var(--data-table-row-bg, inherit)",
          ...stickyBgOverlap,
        },
        "& [data-slot='drag']": {
          zIndex: zIndex.frozenCell,
        },
        "& [data-slot='selection']": {
          zIndex: zIndex.frozenCell,
        },
        "& [data-slot='expand']": {
          zIndex: zIndex.expandCell,
        },
        // When drag column is present, offset selection and expand columns
        "& [data-slot='drag'] ~ [data-slot='selection']": {
          left: "var(--data-table-drag-column-width)",
        },
        "& [data-slot='drag'] ~ [data-slot='expand']": {
          left: "var(--data-table-drag-column-width)",
        },
        // When selection column is present, move expand column to the right
        // and lower its z-index so it doesn't overlap selection during scroll
        "& [data-slot='selection'] ~ [data-slot='expand']": {
          left: "var(--data-table-selection-column-width)",
          zIndex: zIndex.expandCellAfterSelection,
        },
        // When both drag and selection columns are present, offset expand column
        "& [data-slot='drag'] ~ [data-slot='selection'] ~ [data-slot='expand']":
          {
            left: "calc(var(--data-table-drag-column-width) + var(--data-table-selection-column-width))",
          },
        // Frozen cells of pinned rows sit at a lower level than those of other
        // rows. The level dates from when the pinned outline was drawn on the
        // row itself; the outline is now on its own layer above all frozen
        // cells. What remains visible: in a pinned row, the expand cell covers
        // the selection cell's scroll shadow. The expand cell next to the
        // selection cell keeps its own level.
        "&.data-table-row-pinned .data-table-sticky-cell:not([data-slot='selection'] ~ [data-slot='expand'])":
          {
            zIndex: zIndex.pinnedRowFrozenCell,
          },
        // Reveal the pin button on row hover. The row-highlight background is
        // driven by the row's `--data-table-row-bg` variable (frozen cells read it), so
        // there is no sticky-cell background rule here — and therefore no
        // specificity race with the resting background.
        //
        // Keyboard focus reveals it too: a keyboard user moving through the
        // row must be able to see the pin button they land on (WCAG 2.4.7).
        "&:hover, &[data-focus-visible], &[data-focus-visible-within]": {
          "& [data-slot='pin-row-cell']": {
            "& [data-slot='nimbus-table-cell-pin-button']": {
              opacity: 1,
            },
          },
        },
      },
      "& .data-table-row-pinned": {
        ...pinnedOutline(
          "var(--data-table-pinned-shadow-left), var(--data-table-pinned-shadow-right)"
        ),
        "&.data-table-row-pinned-first": pinnedOutline(
          "var(--data-table-pinned-shadow-left), var(--data-table-pinned-shadow-right), var(--data-table-pinned-shadow-top)"
        ),
        "&.data-table-row-pinned-last": pinnedOutline(
          "var(--data-table-pinned-shadow-left), var(--data-table-pinned-shadow-right), var(--data-table-pinned-shadow-bottom)"
        ),
        "&.data-table-row-pinned-single": pinnedOutline(
          "var(--data-table-pinned-shadow-left), var(--data-table-pinned-shadow-right), var(--data-table-pinned-shadow-top), var(--data-table-pinned-shadow-bottom)"
        ),
      },
    },
    table: {
      tableLayout: "fixed",
      borderCollapse: "collapse",
      borderSpacing: 0,
      boxSizing: "border-box",
      colorPalette: "slate",
      width: "100%",
    },
    header: {
      background: "colorPalette.2",
      color: "colorPalette.11",
      borderBottom: "1px solid {colors.neutral.3}",
      lineHeight: "400",
      fontWeight: "500",
      textStyle: "sm",
      fontSize: "300",
      height: "1000",
      "&[data-sticky]": {
        position: "sticky",
        top: 0,
        // Above every frozen body cell and the body focus ring, so rows
        // scrolled under the header stay hidden behind it.
        zIndex: zIndex.header,
      },
      // Multiline header truncation using webkit line clamp
      "& span[data-multiline-header]": {
        overflow: "hidden",
        lineHeight: "450",
        wordBreak: "break-word",
        whiteSpace: "normal",
        textOverflow: "ellipsis",
        textAlign: "left",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
      } as object,
      "& .data-table-column-divider": {
        display: "none",
        position: "absolute",
        right: 0,
        top: "10%",
        bottom: "10%",
        height: "80%",
        width: "1px",
        pointerEvents: "none",
      },
      _hover: {
        "& .data-table-column-divider": {
          display: "inherit",
        },
        "& tr th:last-of-type .data-table-column-divider": {
          display: "none",
        },
      },
      // Show divider when the column resizer is keyboard-focused
      "& th:has([data-focused='true']) .data-table-column-divider": {
        display: "inherit",
      },
    },
    column: {
      textAlign: "right",
      position: "relative",
      lineHeight: "450",
      // td height:auto is not "definite" per CSS spec, so child height:100%
      // collapses to content height. Setting an explicit height makes it
      // definite; table layout still stretches the cell to match the row,
      // allowing children (height:100%) to fill the full cell.
      h: "1px",
      p: 0,
      ...headerFocusRing,

      "& > .nimbus-data-table__column-container": {
        py: "100",
        px: "600",
        display: "flex",
        alignItems: "center",
        h: "100%",
        // https://react-spectrum.adobe.com/react-aria/Table.html#width-values
        // Not positioned itself, so the ring covers the whole header cell.
        ...headerFocusRing,
        "& > span:not(:first-of-type)": {
          flexShrink: 0,
        },
      },
      "&.selection-column-header": {
        cursor: "default",
        paddingTop: "100",
        paddingBottom: "100",
        paddingLeft: "600",
        paddingRight: "600",
        position: "sticky",
        left: 0,
        zIndex: zIndex.frozenHeaderCell,
        background: "colorPalette.2",
        ...stickyBgOverlap,
      },
      "&.drag-column-header": {
        cursor: "default",
        padding: "0",
        position: "sticky",
        left: 0,
        zIndex: zIndex.frozenHeaderCell,
        background: "colorPalette.2",
        ...stickyBgOverlap,
      },
      "&.expand-column-header": {
        cursor: "default",
        padding: "0",
        position: "sticky",
        left: 0, // Default position when no selection column
        zIndex: zIndex.expandHeaderCell,
        background: "colorPalette.2",
        ...stickyBgOverlap,
      },
      // Same offsets as the frozen body cells. `~` rather than `+`, as in the
      // body, so an offset does not depend on the columns being adjacent.
      // When drag column is present, offset selection and expand columns
      "&.drag-column-header ~ &.selection-column-header": {
        left: "var(--data-table-drag-column-width)",
      },
      "&.drag-column-header ~ &.expand-column-header": {
        left: "var(--data-table-drag-column-width)",
      },
      // When selection column is present, adjust expand column header position
      "&.selection-column-header ~ &.expand-column-header": {
        left: "var(--data-table-selection-column-width)",
      },
      // When both drag and selection columns are present, offset expand column
      "&.drag-column-header ~ &.selection-column-header ~ &.expand-column-header":
        {
          left: "calc(var(--data-table-drag-column-width) + var(--data-table-selection-column-width))",
        },
      "&.pin-rows-column-header": {
        cursor: "default",
        py: "100",
        px: "600",
        position: "sticky",
        right: 0,
        zIndex: zIndex.pinHeaderCell,
        background: "colorPalette.2",
        ...stickyBgOverlap,
        "&::before": { right: 0 },
      },
      "&[aria-sort]": {
        fontWeight: "600",
        cursor: "pointer",
        "&[aria-sort='none']:hover": {
          "& .nimbus-data-table__headerSortIcon > svg": {
            display: "inherit",
          },
        },
      },
    },
    body: {
      "& .react-aria-DropIndicator[data-drop-target]": {
        outline: "{sizes.50} solid {colors.primary.7}",
      },
    },
    row: {
      position: "relative",
      // Single source of truth for the row background. Frozen (sticky) cells read
      // this variable (`background-color: var(--data-table-row-bg, inherit)`) so they
      // mirror the row without a specificity race. Custom-bg rows deliberately
      // leave it unset (the `:not([data-custom-bg])` guards below), so the frozen
      // cell falls back to `inherit` and picks up the consumer-provided color.
      "&:not([data-custom-bg])": {
        "--data-table-row-bg": "{colors.bg}",
      },
      borderBottom: "1px solid {colors.neutral.3}",
      ...bodyFocusRing,
      "&[data-dragging='true']": {
        cursor: "grabbing",
      },
      "&[draggable='true']": {
        cursor: "grab",
      },

      // Disabled rows give no hover feedback: they cannot be interacted with.
      "&:hover:not([data-nested-row-expanded]):not([data-disabled])": {
        backgroundColor: "{colors.primary.3}",
      },
      // Frozen cells mirror the hover highlight through the variable. Skipped for
      // custom-bg rows so their frozen cells keep inheriting the consumer color.
      "&:hover:not([data-nested-row-expanded]):not([data-disabled]):not([data-custom-bg])":
        {
          "--data-table-row-bg": "{colors.primary.3}",
        },
      _last: {
        borderBottom: "none",
      },
      "&[data-clickable='true']": {
        cursor: "pointer",
      },
      // Step 5 is the scale's "Active / Selected UI element background".
      "&[data-selected='true']": {
        background: "{colors.primary.5}",
      },
      "&[data-selected='true']:not([data-custom-bg])": {
        "--data-table-row-bg": "{colors.primary.5}",
      },
      "&[data-disabled='true']": {
        layerStyle: "disabled",
      },
    },
    cell: {
      paddingTop: "400",
      paddingBottom: "400",
      paddingLeft: "600",
      paddingRight: "600",
      color: "neutral.12",
      // Containing block for the focus ring. Frozen cells override it with
      // `position: sticky`, which is a containing block too.
      position: "relative",
      ...bodyFocusRing,
      hyphens: "auto",
      // td height:auto is not "definite" per CSS spec, so child height:100%
      // collapses to content height. Setting an explicit height makes it
      // definite; table layout still stretches the cell to match the row,
      // allowing the expand button (height:100%) to fill the full cell.
      height: "1px",

      // Expand button consuming 100% of available space in the cell
      "&[data-slot='expand']": {
        padding: 0,
      },
      "&[data-nested-cell]": {
        boxShadow: "inset 2px 0 0 {colors.primary.10}",
      },
    },
    footer: {
      width: "100%",
    },
    headerSortIcon: {
      // No easing token matches this curve.
      transition: "transform {durations.slow} cubic-bezier(0.4, 0.0, 0.2, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "150",
      width: "400",
      height: "400",
      willChange: "opacity, color, transform",
      color: "neutral.10",
      // Only hide the svg so that the sort icon appearing does not cause layout shift
      "& > svg": { display: "none" },
      "&[data-sort-active='true']": {
        color: "neutral.11",
        "& > svg": { display: "inherit" },
      },
      "&[data-sort-direction='ascending']": {
        transform: "rotate(180deg)",
      },
    },
    columnResizer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      // We have no odd tokens apart from 1px, so we use calc to
      // create the odd width of 7px, the 1px separator is centered
      // in the middle, the right shift of 3px visually centers the
      // separator within the interactive area
      width: "calc({sizes.150} + {sizes.25})",
      right: "calc(-1 * ({sizes.50} + {sizes.25}))",

      cursor: "col-resize",
      transition: "background {durations.faster}",
      background: "transparent",

      zIndex: zIndex.columnResizer,
      "&:hover": {
        background: "var(--focus-ring-color)",
      },
      "&[data-resizing='true']": {
        background: "{colors.primary}",
      },
      "&[data-focused='true']": {
        outlineWidth: "var(--focus-ring-width)",
        outlineColor: "var(--focus-ring-color)",
        outlineStyle: "var(--focus-ring-style)",
      },
    },
  },
  // Variants for different states
  variants: {
    truncated: {
      true: {
        root: {
          "& .truncated-cell": {
            // No size token is 200px (the nearest are 192px and 208px).
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        },
      },
    },
    size: {
      sm: sharedSizeVariant("sm", {
        paddingY: "200",
        fontSize: "350",
        textStyle: "sm",
      }),
      md: sharedSizeVariant("md", {
        paddingY: "300",
        fontSize: "350",
        textStyle: "sm",
      }),
      lg: sharedSizeVariant("lg", {
        paddingY: "300",
        fontSize: "400",
        textStyle: "md",
      }),
      // Deprecated default: the base styles already hold these values.
      xl: {
        root: internalColumnWidthVars("xl"),
      },
    },
    /** @deprecated Use `size`. Only applies together with `size: "xl"`. */
    density: {
      default: {},
      condensed: {},
    },
  },
  compoundVariants: [
    {
      size: "xl",
      density: "condensed",
      css: {
        cell: {
          paddingTop: "300",
          paddingBottom: "300",
        },
      },
    },
  ],
  defaultVariants: {
    size: DATA_TABLE_DEFAULT_SIZE,
  },
  defaultVariants: {
    truncated: false,
    density: "default",
  },
});
