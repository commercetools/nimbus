import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ModalPage component.
 * Provides a fullscreen modal page layout with a fixed grid structure:
 * top bar, header, scrollable content, and optional footer.
 */
export const modalPageRecipe = defineSlotRecipe({
  slots: ["root", "topBar", "header", "title", "actions", "content", "footer"],
  className: "nimbus-modal-page",
  base: {
    root: {
      display: "grid",
      gridTemplateRows: "auto auto 1fr auto",
      height: "100%",
      width: "100%",
    },
    topBar: {
      display: "flex",
      alignItems: "center",
      gap: "200",
      px: "600",
      py: "300",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: "border",
    },
    header: {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      mx: "900",
      mt: "800",
      pb: "600",
      borderBottomWidth: "1px",
      borderBottomStyle: "solid",
      borderBottomColor: "border",
    },
    title: {
      gridColumn: "1",
    },
    actions: {
      gridColumn: "2",
      display: "flex",
      alignItems: "center",
      gap: "200",
    },
    content: {
      overflow: "auto",
      m: "800",
      mx: "900",
    },
    footer: {
      borderTopWidth: "1px",
      borderTopStyle: "solid",
      borderTopColor: "border",
      px: "600",
      py: "400",
    },
  },
  defaultVariants: {},
});
