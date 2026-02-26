import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the MainPage component.
 * Defines a page skeleton layout using CSS grid with header, content, and
 * optional footer areas.
 */
export const mainPageRecipe = defineSlotRecipe({
  slots: [
    "root",
    "header",
    "title",
    "subtitle",
    "actions",
    "content",
    "footer",
  ],

  className: "nimbus-main-page",

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
      paddingX: "600",
      paddingY: "400",
      borderBottom: "solid-25",
      borderColor: "neutral.6",
    },
    title: {
      fontSize: "500",
      fontWeight: "600",
      lineHeight: "tight",
      color: "neutral.12",
    },
    subtitle: {
      fontSize: "250",
      color: "neutral.11",
    },
    actions: {
      display: "flex",
      alignItems: "center",
      gap: "200",
      gridColumn: "2",
      gridRow: "1 / -1",
    },
    content: {
      overflow: "auto",
      // Uses margin (not padding) to preserve sticky positioning
      // for child components like DataTable, matching appKit behavior.
      marginX: "600",
      marginY: "600",
    },
    footer: {
      borderTop: "solid-25",
      borderColor: "neutral.6",
      paddingX: "600",
      paddingY: "400",
    },
  },
});
