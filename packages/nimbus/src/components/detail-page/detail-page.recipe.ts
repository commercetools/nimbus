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
    "headerActions",
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
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gridTemplateAreas: `
        "backLink    backLink"
        "title       headerActions"
        "subtitle    subtitle"
      `,
      columnGap: "400",
      rowGap: "400",
      alignItems: "center",
      paddingX: "600",
      paddingY: "400",
      borderBottom: "solid-25",
      borderColor: "neutral.6",
    },
    backLink: {
      focusRing: "outside",
      colorPalette: "primary",
      gridArea: "backLink",
      display: "inline-flex",
      alignItems: "center",
      gap: "100",
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
      gridArea: "title",
      fontSize: "500",
      fontWeight: "600",
      lineHeight: "tight",
      color: "neutral.12",
    },
    subtitle: {
      gridArea: "subtitle",
      textStyle: "sm",
      color: "neutral.11",
    },
    headerActions: {
      gridArea: "headerActions",
      display: "flex",
      alignItems: "center",
      gap: "200",
    },
    content: {
      flex: "1",
      flexBasis: "0",
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
});
