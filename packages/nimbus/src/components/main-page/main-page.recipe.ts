import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the MainPage component.
 * Defines a page skeleton layout using CSS grid with header, content, and
 * optional footer areas.
 */
export const mainPageRecipe = defineSlotRecipe({
  slots: ["root", "header", "title", "actions", "content", "footer"],

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
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingX: "600",
      paddingY: "400",
      borderBottom: "solid-25",
      borderColor: "neutral.6",
    },
    title: {
      display: "flex",
      alignItems: "center",
    },
    actions: {
      display: "flex",
      alignItems: "center",
      gap: "200",
    },
    content: {
      overflowY: "auto",
      paddingY: "600",
    },
    footer: {
      borderTop: "solid-25",
      borderColor: "neutral.6",
      paddingX: "600",
      paddingY: "400",
    },
  },
});
