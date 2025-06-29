import { defineSlotRecipe } from "@chakra-ui/react";

/**
 * Recipe configuration for the FancyTable component.
 * Built on React Aria Components for advanced table functionality.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const fancyTableSlotRecipe = defineSlotRecipe({
  className: "nimbus-fancy-table",
  slots: [
    "root",
    "container", // For ResizableTableContainer
    "header",
    "body",
    "column",
    "columnHeader",
    "columnResizer",
    "row",
    "cell",
    "checkbox",
    "dragButton",
    "emptyState",
    "sortIndicator",
  ],
  base: {
    root: {
      fontVariantNumeric: "lining-nums tabular-nums",
      borderCollapse: "collapse",
      width: "full",
      textAlign: "start",
      verticalAlign: "top",
      outline: "none",
      borderSpacing: 0,
      minHeight: "100px",
      alignSelf: "start",
      maxWidth: "100%",
      wordBreak: "break-word",
      forcedColorAdjust: "none",

      "&[data-focus-visible]": {
        outline: "2px solid var(--focus-ring-color)",
        outlineOffset: "-1px",
      },
    },
    container: {
      maxWidth: "100%",
      overflow: "auto",
      position: "relative",
      border: "solid-25",
      borderColor: "border",

      bg: "bg",
    },
    header: {
      color: "fg",
      "&:after": {
        content: '""',
        display: "table-row",
        height: "2px",
      },
      "& tr:last-child .react-aria-Column": {
        borderBottomWidth: "solid-25",
        borderBottomColor: "border",
        cursor: "default",
      },
    },
    column: {
      px: "300",
      py: "200",
      textAlign: "left",
      outline: "none",
      fontWeight: "500",
      color: "fg",

      "&[data-focus-visible]": {
        outline: "2px solid var(--focus-ring-color)",
        outlineOffset: "-2px",
      },

      "&[data-sort-direction]": {
        cursor: "pointer",
        userSelect: "none",

        "&:hover": {
          bg: "neutral.4",
        },
      },
    },
    columnHeader: {
      display: "flex",
      alignItems: "center",
      gap: "200",
      flex: 1,
      fontWeight: "medium",
      textAlign: "start",
      color: "fg",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    columnResizer: {
      width: "15px",
      bg: "border",
      height: "25px",
      flex: "0 0 auto",
      touchAction: "none",
      boxSizing: "border-box",
      border: "5px",
      borderStyle: "none solid",
      borderColor: "transparent",
      backgroundClip: "content-box",

      "&[data-resizable-direction=both]": {
        cursor: "ew-resize",
      },
      "&[data-resizable-direction=left]": {
        cursor: "e-resize",
      },
      "&[data-resizable-direction=right]": {
        cursor: "w-resize",
      },
      "&[data-focus-visible]": {
        bg: "accent.solid",
      },
      "&[data-resizing]": {
        borderColor: "accent.solid",
        bg: "transparent",
      },
    },
    row: {
      outline: "none",
      cursor: "default",
      color: "fg",
      fontSize: "sm",
      position: "relative",
      transform: "scale(1)",

      "&[data-focus-visible]": {
        outline: "2px solid var(--focus-ring-color)",
        outlineOffset: "-2px",
      },

      "&[data-selected]": {
        bg: "primary.9",
        color: "primary.contrast",

        "&[data-focus-visible], & [data-focus-visible]": {
          outlineOffset: "-4px",
        },
      },

      "&[data-disabled]": {
        layerStyle: "disabled",
      },

      "&[data-drop-target]": {
        outline: "2px solid var(--colors-accent-solid)",
        bg: "primary.3",
      },
    },
    cell: {
      px: "300",
      py: "200",
      textAlign: "left",
      outline: "none",
      transform: "translateZ(0)",
      alignItems: "center",

      "&[data-focus-visible]": {
        outline: "2px solid var(--focus-ring-color)",
        outlineOffset: "-2px",
      },
    },
    checkbox: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    dragButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "32px",
      height: "32px",
      cursor: "grab",

      "&:active": {
        cursor: "grabbing",
      },
    },
    emptyState: {
      textAlign: "center",
      fontStyle: "italic",
      color: "neutral.3",
      padding: "400",
    },
    sortIndicator: {
      display: "inline-flex",
      alignItems: "center",
      ml: "200",
      fontSize: "xs",
      color: "neutral.3",
    },
  },
  variants: {
    variant: {
      line: {
        column: {
          borderBottomWidth: "1px",
          borderBottomColor: "border",
        },
        cell: {
          borderBottomWidth: "1px",
          borderBottomColor: "border",
        },
        row: {
          bg: "bg",
        },
      },
      outline: {
        root: {
          border: "1px solid",
          borderColor: "border",
          overflow: "hidden",
        },
        column: {
          borderBottomWidth: "1px",
          borderBottomColor: "border",
        },
        header: {
          bg: "bg.muted",
        },
        row: {
          "&:not(:last-child)": {
            borderBottomWidth: "1px",
            borderBottomColor: "border",
          },
        },
      },
    },
    size: {
      sm: {
        root: {
          textStyle: "sm",
        },
        column: {
          px: "200",
          py: "200",
        },
        cell: {
          px: "200",
          py: "200",
        },
      },
      md: {
        root: {
          textStyle: "md",
        },
        column: {
          px: "300",
          py: "300",
        },
        cell: {
          px: "300",
          py: "300",
        },
      },
    },
    interactive: {
      true: {
        body: {
          "& tr": {},
        },
        row: {
          "&[data-hovered='true']": {
            bg: "neutral.4/75",
          },
          "&[data-pressed]": {
            bg: "primary.5!",
          },
        },
      },
    },
    striped: {
      true: {
        row: {
          "&:nth-of-type(even)": {
            bg: "neutral.3/75",
          },
        },
      },
    },
    showColumnBorder: {
      true: {
        column: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px",
            borderInlineEndColor: "border",
          },
        },
        cell: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px",
            borderInlineEndColor: "border",
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: "line",
    size: "md",
  },
});
