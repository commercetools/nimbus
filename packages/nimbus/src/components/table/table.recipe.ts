import { defineSlotRecipe } from "@chakra-ui/react";

export const tableSlotRecipe = defineSlotRecipe({
  className: "chakra-table",
  slots: [
    "root",
    "header",
    "body",
    "row",
    "columnHeader",
    "cell",
    "footer",
    "caption",
    "resizeHandle",
    "clipboardCell",
  ],
  base: {
    root: {
      fontVariantNumeric: "lining-nums tabular-nums",
      borderCollapse: "collapse",
      width: "full",
      textAlign: "start",
      verticalAlign: "top",
    },
    row: {
      _selected: {
        bg: "colorPalette.subtle",
      },
    },
    cell: {
      textAlign: "start",
      alignItems: "center",
    },
    columnHeader: {
      fontWeight: "medium",
      textAlign: "start",
      color: "fg",
      px: "300",
      py: "300",
      bg: "bg",
      position: "relative",
      cursor: "pointer",
      userSelect: "none",
      borderBottomWidth: "1px",
      zIndex: 10,
    },
    caption: {
      fontWeight: "medium",
      textStyle: "xs",
    },
    footer: {
      fontWeight: "medium",
    },
    resizeHandle: {
      position: "absolute",
      right: 0,
      top: 0,
      height: "100%",
      width: 12,
      cursor: "col-resize",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 20,
      userSelect: "none",
      color: "gray.400",
      fontWeight: 600,
      fontSize: 18,
      _hover: {
        color: "primary.9",
      },
    },
    clipboardCell: {
      width: 40,
      minWidth: 40,
      maxWidth: 40,
      textAlign: "center",
      background: "transparent",
      border: "none",
      px: 0,
    },
  },
  variants: {
    interactive: {
      true: {
        body: {
          "& tr": {
            _hover: {
              bg: "colorPalette.subtle",
            },
          },
        },
      },
    },
    stickyHeader: {
      true: {
        header: {
          "& :where(tr)": {
            top: "var(--table-sticky-offset, 0)",
            position: "sticky",
            zIndex: 10,
          },
        },
      },
    },
    striped: {
      true: {
        row: {
          "&:nth-of-type(odd) td": {
            bg: "bg.muted",
          },
        },
      },
    },
    showColumnBorder: {
      true: {
        columnHeader: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px",
          },
        },
        cell: {
          "&:not(:last-of-type)": {
            borderInlineEndWidth: "1px",
          },
        },
      },
    },
    variant: {
      line: {
        columnHeader: {
          borderBottomWidth: "1px",
        },
        cell: {
          borderBottomWidth: "1px",
        },
        row: {
          bg: "bg",
        },
      },
      outline: {
        root: {
          boxShadow: "0 0 0 1px {colors.border}",
          overflow: "hidden",
        },
        columnHeader: {
          borderBottomWidth: "1px",
        },
        header: {
          bg: "bg.muted",
        },
        row: {
          "&:not(:last-of-type)": {
            borderBottomWidth: "1px",
          },
        },
        footer: {
          borderTopWidth: "1px",
        },
      },
    },
    size: {
      sm: {
        root: {
          textStyle: "sm",
        },
        columnHeader: {
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
          textStyle: "sm",
        },
        columnHeader: {
          px: "300",
          py: "300",
        },
        cell: {
          px: "300",
          py: "300",
        },
      },
      lg: {
        root: {
          textStyle: "md",
        },
        columnHeader: {
          px: "400",
          py: "300",
        },
        cell: {
          px: "400",
          py: "300",
        },
      },
    },
    child: {
      true: {
        row: {
          "& td:first-of-type": {
            pl: "600",
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
