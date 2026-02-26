import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the DetailPage component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const detailPageSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "header",
    "backLink",
    "title",
    "subtitle",
    "content",
    "footer",
  ],

  className: "nimbus-detail-page",

  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      minHeight: "0",
      width: "100%",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      gap: "200",
      paddingX: "600",
      paddingY: "400",
    },
    backLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "100",
      color: "neutral.11",
      textDecoration: "none",
      fontSize: "200",
      lineHeight: "1",
      cursor: "pointer",
      _hover: {
        color: "neutral.12",
        textDecoration: "underline",
      },
    },
    title: {
      fontSize: "500",
      fontWeight: "600",
      lineHeight: "tight",
      color: "neutral.12",
    },
    subtitle: {
      fontSize: "200",
      color: "neutral.11",
    },
    content: {
      flex: "1",
      paddingX: "600",
      paddingY: "400",
    },
    footer: {
      paddingX: "600",
      paddingY: "400",
      borderTop: "solid-25",
      borderColor: "neutral.6",
    },
  },

  variants: {
    contentVariant: {
      wide: {
        content: {
          maxWidth: "breakpoint-xl",
          marginX: "auto",
          width: "100%",
        },
      },
      narrow: {
        content: {
          maxWidth: "breakpoint-md",
          marginX: "auto",
          width: "100%",
        },
      },
      full: {
        content: {
          maxWidth: "100%",
        },
      },
    },
  },

  defaultVariants: {
    contentVariant: "full",
  },
});
