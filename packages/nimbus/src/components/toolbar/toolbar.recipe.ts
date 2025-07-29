import { defineSlotRecipe } from "@chakra-ui/react";

export const toolbarRecipe = defineSlotRecipe({
  className: "nimbus-toolbar",
  slots: ["root", "group", "separator"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      position: "relative",
      isolation: "isolate",
      gap: "100",
      padding: "200",
      backgroundColor: "bg.default",
      borderRadius: "100",
      minHeight: "1000",
      borderWidth: "1px",
      borderColor: "border.default",
    },
    group: {
      display: "flex",
      alignItems: "center",
      gap: "100",
      position: "relative",
    },
    separator: {
      backgroundColor: "border.default",
      flexShrink: 0,
      width: "1px",
      height: "50%",
      alignSelf: "center",
    },
  },
  variants: {
    orientation: {
      horizontal: {
        root: {
          flexDirection: "row",
          alignItems: "center",
        },
        group: {
          flexDirection: "row",
          alignItems: "center",
        },
        separator: {
          width: "1px",
          height: "50%",
          alignSelf: "center",
        },
      },
      vertical: {
        root: {
          flexDirection: "column",
          alignItems: "stretch",
          minHeight: "auto",
          minWidth: "1000",
        },
        group: {
          flexDirection: "column",
          alignItems: "stretch",
        },
        separator: {
          width: "50%",
          height: "1px",
          alignSelf: "center",
        },
      },
    },
    size: {
      xs: {
        root: {
          gap: "100",
          padding: "150",
          minHeight: "800",
          _vertical: {
            minWidth: "800",
          },
        },
        group: {
          gap: "100",
        },
      },
      md: {
        root: {
          gap: "100",
          padding: "200",
          minHeight: "1000",
          _vertical: {
            minWidth: "1000",
          },
        },
        group: {
          gap: "100",
        },
      },
      lg: {
        root: {
          gap: "200",
          padding: "250",
          minHeight: "1200",
          _vertical: {
            minWidth: "1200",
          },
        },
        group: {
          gap: "200",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
