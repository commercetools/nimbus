import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * DraggableList recipe - styling for DraggableList component
 * Supports various sizes, styling for drag and drop elements
 */
export const draggableListSlotRecipe = defineSlotRecipe({
  slots: ["root", "empty", "item", "itemContent"],
  className: "nimbus-draggable-list",
  base: {
    root: {
      colorPalette: "primary",
      width: "2xs",
      display: "flex",
      flexDirection: "column",
      padding: "200",
      border: "{sizes.25} solid",
      borderColor: "colorPalette.3",
      borderRadius: "200",
      gap: "200",

      "& >.react-aria-DropIndicator": {
        "&[data-drop-target]": {
          outline: "{sizes.25} solid {colors.primary.7}",
        },

        "&@supports not selector(:has(.react-aria-DropIndicator))": {
          /* Undo gap in browsers that don't support :has */
          marginBottom: "-2px",
        },
      },
      "&[data-empty]": {
        alignItems: "center",
        justifyContent: "center",
        fontStyle: "italic",
        color: "colorPalette.11",
      },
    },
    empty: {
      marginBlock: "auto",
      alignSelf: "center",
    },
    item: {
      borderRadius: "200",
      background: "colorPalette.3",
      display: "flex",
      _focus: {
        layerStyle: "focusRing",
      },
      "&[data-allows-dragging='true']": {
        cursor: "grab",
        "&[data-dragging='true']": {
          cursor: "grabbing",
        },
      },
      "&[data-disabled]": {
        layerStyle: "disabled",
      },
      "& > [role='gridcell']": {
        display: "flex!",
        flex: "1 1 auto",
        alignItems: "center",
        justifyContent: "center",
        gap: "100",
        paddingInline: "200",
        fontSize: "350",
        lineHeight: "400",
        focusVisibleRing: "outside",
      },
    },
    itemContent: {
      flex: "1 1 auto",
    },
  },
  variants: {
    size: {
      sm: {},
      md: {
        item: { minH: "800" },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// ============================================================
// EXPORTED VARIANT TYPES
// ============================================================

const draggableListVariants = draggableListSlotRecipe.variants!;

export type DraggableListSize = keyof typeof draggableListVariants.size;
