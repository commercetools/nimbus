import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the DefaultPage component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const defaultPageSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "header",
    "backLink",
    "title",
    "subtitle",
    "actions",
    "tabNav",
    "content",
    "footer",
  ],

  className: "nimbus-default-page",

  base: {
    root: {
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
      gridTemplateColumns: "1fr",
      height: "100%",
      width: "100%",
    },
    header: {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      paddingTop: "800",
      paddingX: "900",
      paddingBottom: "600",
      borderBottom: "solid-25",
      borderColor: "neutral.6",
      "&:has(.nimbus-default-page__tabNav)": {
        paddingBottom: "0",
      },
      "&:has(.nimbus-default-page__backLink)": {
        "& .nimbus-default-page__actions": {
          gridRow: "2 / span 2",
        },
      },
    },
    backLink: {
      focusRing: "outside",
      colorPalette: "primary",
      gridColumn: "1 / -1",
      display: "inline-flex",
      alignItems: "center",
      gap: "100",
      mb: "400",
      color: "colorPalette.11",
      textStyle: "sm",
      fontWeight: "500",
      cursor: "pointer",
      justifySelf: "start",
      _hover: {
        color: "colorPalette.12",
        textDecoration: "underline",
      },
    },
    title: {
      gridColumn: "1",
      alignSelf: "center",
      alignItems: "center",
      fontSize: "500",
      fontWeight: "600",
      lineHeight: "800",
      color: "neutral.12",
    },
    subtitle: {
      gridColumn: "1",
      alignSelf: "center",
      mt: "200",
      textStyle: "sm",
      color: "neutral.11",
    },
    actions: {
      gridColumn: "2",
      gridRow: "1 / span 2",
      display: "flex",
      alignItems: "center",
      justifyItems: "end",
      gap: "200",
    },
    tabNav: {
      gridColumn: "1 / -1",
      mt: "200",
    },
    content: {
      overflow: "auto",
      paddingX: "900",
      paddingY: "800",
    },
    footer: {
      borderTop: "solid-25",
      borderColor: "neutral.6",
      paddingX: "900",
      paddingY: "400",
    },
  },

  variants: {
    stickyHeader: {
      true: {
        header: {
          position: "sticky",
          top: 0,
          zIndex: 1,
          bg: "bg",
        },
      },
    },
    stickyFooter: {
      true: {
        footer: {
          position: "sticky",
          bottom: 0,
          zIndex: 1,
          bg: "bg",
        },
      },
    },
  },
});
