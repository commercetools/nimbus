import { defineRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the DropZone component.
 * Defines the base styles using Chakra UI's standard (single-container) recipe system.
 */
export const dropZoneRecipe = defineRecipe({
  className: "nimbus-drop-zone",

  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
    minHeight: "2400",
    padding: "600",
    gap: "300",
    // Nimbus's theme does not register a `borderWidths` token category, so a
    // bare scale key (e.g. "25") is emitted as an invalid unitless CSS value.
    // Reference the `sizes` scale instead — `{sizes.50}` resolves to `2px`.
    borderWidth: "{sizes.50}",
    borderStyle: "dashed",
    borderColor: "colorPalette.7",
    borderRadius: "300",
    backgroundColor: "colorPalette.2",
    color: "colorPalette.11",
    // The zone itself is not a click-to-upload target (that role belongs to a
    // composed `FileTrigger`), so it uses the default cursor rather than a
    // pointer. Disable text selection so dragging content over the zone does
    // not accidentally select its text.
    userSelect: "none",
    transitionProperty: "background-color, border-color",
    transitionDuration: "0.15s",
    transitionTimingFunction: "ease-in-smooth",
    focusRing: "outside",

    // Sizes the default icon; consumer-supplied children are unaffected.
    "--drop-zone-icon-size": "{sizes.800}",

    "&[data-drop-target='true']": {
      colorPalette: "primary",
      borderStyle: "solid",
      borderColor: "colorPalette.8",
      backgroundColor: "colorPalette.3",
    },

    "&[data-disabled='true']": {
      layerStyle: "disabled",
      pointerEvents: "none",
    },

    "@media (prefers-reduced-motion: reduce)": {
      transitionDuration: "0s",
    },

    "@media (forced-colors: active)": {
      borderColor: "ButtonBorder",
      "&[data-drop-target='true']": {
        borderColor: "Highlight",
        outline: "2px solid Highlight",
        outlineOffset: "2px",
      },
      "&[data-focus-visible='true']": {
        outline: "2px solid Highlight",
        outlineOffset: "2px",
      },
    },
  },
});
