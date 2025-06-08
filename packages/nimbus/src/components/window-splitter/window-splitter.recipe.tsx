import { defineSlotRecipe } from "@chakra-ui/react";

export const windowSplitterSlotRecipe = defineSlotRecipe({
  className: "nimbus-window-splitter",
  slots: ["root", "pane", "separator"],
  base: {
    root: {
      display: "flex",
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
    pane: {
      overflow: "auto",
      minWidth: 0,
      minHeight: 0,
    },
    separator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      position: "relative",
      cursor: "col-resize",
      backgroundColor: "border.default",
      transition: "background-color 0.2s",
      _hover: {
        backgroundColor: "border.emphasized",
      },
      _focus: {
        outline: "2px solid",
        outlineColor: "border.accent",
        outlineOffset: "-2px",
      },
      _disabled: {
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
  },
  variants: {
    orientation: {
      horizontal: {
        root: {
          flexDirection: "row",
        },
        separator: {
          width: "8px",
          height: "100%",
          cursor: "col-resize",
        },
      },
      vertical: {
        root: {
          flexDirection: "column",
        },
        separator: {
          width: "100%",
          height: "8px",
          cursor: "row-resize",
        },
      },
    },
    size: {
      sm: {
        separator: {
          _horizontal: {
            width: "4px",
          },
          _vertical: {
            height: "4px",
          },
        },
      },
      md: {
        separator: {
          _horizontal: {
            width: "8px",
          },
          _vertical: {
            height: "8px",
          },
        },
      },
      lg: {
        separator: {
          _horizontal: {
            width: "12px",
          },
          _vertical: {
            height: "12px",
          },
        },
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "md",
  },
});
