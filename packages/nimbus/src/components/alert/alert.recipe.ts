import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Alert component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */

// Tinted-card surface shared by `subtle` (canonical) and the deprecated
// `outlined` alias, so the two render identically.
const subtleSurface = {
  root: {
    border: "solid-25",
    borderColor: "colorPalette.5",
    backgroundColor: "colorPalette.2",
    padding: "200",
    borderRadius: "200",
  },
};

export const alertRecipe = defineSlotRecipe({
  slots: ["root", "title", "description", "icon", "actions", "dismissButton"],
  className: "nimbus-alert",

  base: {
    root: {
      width: "100%",
    },
    icon: {
      "& svg": {
        width: "500",
        height: "500",
        color: "colorPalette.11",
      },
    },
    title: {
      color: "colorPalette.11",
    },
    description: {
      color: "colorPalette.11",
    },
  },

  variants: {
    // Emphasis axis (kept as `variant` for backwards compatibility).
    variant: {
      flat: {},
      subtle: subtleSurface,
      // Deprecated alias for `subtle`; renders identically. Kept so existing
      // `variant="outlined"` usage does not break.
      outlined: subtleSurface,
      outline: {
        root: {
          border: "solid-25",
          borderColor: "colorPalette.7",
          backgroundColor: "transparent",
          padding: "200",
          borderRadius: "200",
        },
      },
      solid: {
        root: {
          backgroundColor: "colorPalette.9",
          padding: "200",
          borderRadius: "200",
        },
        title: { color: "colorPalette.contrast" },
        description: { color: "colorPalette.contrast" },
        icon: { "& svg": { color: "colorPalette.contrast" } },
      },
    },

    // Layout axis. Declared AFTER `variant` so layout-specific overrides
    // (e.g. banner's borderRadius: 0) win over emphasis defaults.
    layout: {
      stack: {
        root: {
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "200",
          alignItems: "start",
        },
        icon: { gridColumn: "1", gridRow: "1", marginTop: "50" },
        title: { gridColumn: "2", order: "1" },
        description: { gridColumn: "2", order: "2" },
        actions: { gridColumn: "2", order: "3" },
        dismissButton: { gridColumn: "3", gridRow: "1" },
      },
      inline: {
        root: {
          display: "grid",
          gridTemplateColumns: {
            base: "auto 1fr auto",
            sm: "auto minmax(0, 1fr) auto auto",
          },
          columnGap: "400",
          rowGap: "200",
          alignItems: "center",
        },
        icon: { gridColumn: "1", alignSelf: "center" },
        title: { gridColumn: "2" },
        description: { gridColumn: "2" },
        actions: {
          gridColumn: { base: "1 / -1", sm: "3" },
          gridRow: { sm: "1 / -1" },
          alignSelf: "center",
          justifySelf: { base: "start", sm: "end" },
        },
        dismissButton: {
          gridColumn: { base: "3", sm: "4" },
          gridRow: "1",
          alignSelf: "center",
        },
      },
      banner: {
        root: {
          display: "grid",
          gridTemplateColumns: "auto minmax(0, 1fr) auto auto",
          columnGap: "400",
          rowGap: "200",
          alignItems: "center",
          width: "100%",
          borderRadius: "0",
          borderInline: "none",
        },
        icon: { gridColumn: "1", alignSelf: "center" },
        title: { gridColumn: "2" },
        description: { gridColumn: "2" },
        actions: { gridColumn: "3", gridRow: "1 / -1", alignSelf: "center" },
        dismissButton: { gridColumn: "4", gridRow: "1", alignSelf: "center" },
      },
    },
  },

  defaultVariants: {
    variant: "subtle",
    layout: "stack",
  },
});
