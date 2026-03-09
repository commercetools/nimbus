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
      alignItems: "400",
      // margin to ensure border does not reach the edge of the page
      margin: "{spacing.800} {spacing.900} 0",
      paddingBottom: "600",
      borderBottom: "solid-25",
      borderColor: "neutral.6",
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
    content: {
      overflow: "auto",
      // Uses margin (not padding) to preserve sticky positioning
      // for child components like DataTable, matching appKit behavior.
      margin: "{spacing.800} {spacing.900}",
    },
    footer: {
      borderTop: "solid-25",
      borderColor: "neutral.6",
      paddingX: "600",
      paddingY: "400",
    },
  },
});
