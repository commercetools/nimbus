import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const paginationRecipe = defineSlotRecipe({
  className: "nimbus-pagination",
  slots: ["root", "list", "item", "ellipsis", "trigger"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    list: {
      display: "flex",
      listStyleType: "none",
      alignItems: "center",
      gap: "100",
      margin: "0",
      padding: "0",
    },
    item: {
      listStyleType: "none",
    },
    ellipsis: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "800",
      height: "800",
      color: "neutral.8",
      fontSize: "350",
      userSelect: "none",
    },
    trigger: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "800",
      height: "800",
      borderRadius: "200",
      cursor: "pointer",
      userSelect: "none",
      fontSize: "350",
      fontWeight: "500",
      lineHeight: "400",
      color: "neutral.11",
      backgroundColor: "transparent",
      border: "none",
      _hover: {
        backgroundColor: "neutral.4",
      },
      _focus: {
        outline: "2px solid",
        outlineColor: "primary.8",
        outlineOffset: "2px",
        "@media (forced-colors: active)": {
          outline: "2px solid ButtonText",
          backgroundColor: "Highlight",
          color: "HighlightText",
        },
      },
      _disabled: {
        cursor: "not-allowed",
        opacity: "0.4",
        _hover: {
          backgroundColor: "transparent",
        },
      },
      "&[aria-current='page']": {
        backgroundColor: "primary.9",
        color: "primary.contrast",
        _hover: {
          backgroundColor: "primary.10",
        },
      },
    },
  },
  variants: {
    size: {
      sm: {
        ellipsis: {
          minWidth: "800",
          height: "800",
          fontSize: "350",
        },
        trigger: {
          minWidth: "800",
          height: "800",
          fontSize: "350",
        },
        list: {
          gap: "75",
        },
      },
      md: {
        ellipsis: {
          minWidth: "1000",
          height: "1000",
          fontSize: "400",
        },
        trigger: {
          minWidth: "1000",
          height: "1000",
          fontSize: "400",
        },
        list: {
          gap: "100",
        },
      },
      lg: {
        ellipsis: {
          minWidth: "1200",
          height: "1200",
          fontSize: "500",
        },
        trigger: {
          minWidth: "1200",
          height: "1200",
          fontSize: "500",
        },
        list: {
          gap: "150",
        },
      },
    },
    variant: {
      solid: {
        // No additional styling needed - base trigger styles handle this
      },
      outline: {
        trigger: {
          border: "1px solid",
          borderColor: "neutral.7",
          _hover: {
            borderColor: "neutral.8",
            backgroundColor: "neutral.3",
          },
          "&[aria-current='page']": {
            borderColor: "primary.9",
            backgroundColor: "primary.9",
            color: "primary.contrast",
            _hover: {
              borderColor: "primary.10",
              backgroundColor: "primary.10",
            },
          },
        },
      },
      ghost: {
        trigger: {
          backgroundColor: "transparent",
          _hover: {
            backgroundColor: "neutral.4",
          },
          "&[aria-current='page']": {
            backgroundColor: "primary.4",
            color: "primary.11",
            _hover: {
              backgroundColor: "primary.5",
            },
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
});
