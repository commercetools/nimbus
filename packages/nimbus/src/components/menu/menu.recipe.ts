import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the Menu component.
 * Defines the styling variants and base styles using Chakra UI's slot recipe system.
 */
export const menuSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "trigger",
    "popover",
    "content",
    "item",
    "section",
    "sectionLabel",
    "submenu",
  ],
  // Unique class name prefix for the component
  className: "nimbus-menu",

  // Base styles applied to all instances of the component
  base: {
    root: {
      display: "inline-block",
      position: "relative",
    },
    trigger: {
      focusRing: "outside",
    },
    popover: {
      bg: "bg",
      borderRadius: "200",
      boxShadow: "5",
      overflow: "auto",

      // Entry animation
      "&[data-entering]": {
        animationName: "fade-in, scale-in",
        animationDuration: "fast",
      },

      // Exit animation
      "&[data-exiting]": {
        animationName: "fade-out, scale-out",
        animationDuration: "faster",
      },
    },
    content: {
      display: "flex",
      flexDirection: "column",
      minWidth: "200px",
      maxHeight: "400px",
      overflowY: "auto",
      p: "200",
      position: "relative",

      // Focus styles for keyboard navigation
      "&:focus": {
        outline: "none",
      },
      // Target direct descendant Separator components
      '& > [role="separator"]': {
        mx: "-200",
        my: "200",
        // compensate for left & right bleed
        width: "calc(100% + {sizes.400})",
      },
    },
    item: {
      display: "grid",
      /*
       * Define a 4-column grid:
       * 1. icon      – size to its content (usually 0 when no icon)
       * 2. label/description – takes up all remaining space
       * 3. keyboard  – size to its content (or 0 when missing)
       * 4. flyout    – size to its content (or 0 when missing)
       *
       * Using `1fr` for the second column ensures that, when columns 3 or 4
       * are absent for a particular row, the label/description column expands
       * to fill the available width instead of leaving empty reserved space.
       */
      gridTemplateColumns: "auto 1fr auto auto",
      gridTemplateAreas: `
        'icon label keyboard flyoutCaret'
        'icon description keyboard flyoutCaret'`,
      flexDirection: "column",
      alignItems: "start",
      px: "300",
      py: "200",
      borderRadius: "200",
      cursor: "pointer",
      userSelect: "none",
      color: "fg",
      fontSize: "400",
      lineHeight: "500",
      position: "relative",
      textStyle: "sm",
      outline: 0,
      boxShadow: "inset 0 0 0 {sizes.50} {colors.bg}",

      // Hover state
      "&[data-hovered='true'], &[data-focused='true']": {
        bg: "primary.2",
        outline: "none",
        zIndex: "1",
      },

      // keyboard focused
      "&[data-focus-visible]": {
        focusRing: "outside",
      },

      "&[data-selected]": {
        bg: "primary.3",
      },

      // Critical state
      "&[data-critical]": {
        color: "critical.11",

        "&[data-hovered='true'], &[data-focused='true']": {
          bg: "critical.2",
        },

        "& [slot='label']": {
          fontWeight: "600",
          color: "critical.11",
        },

        "& [slot='icon']": {
          color: "critical.11",
        },
        "& [slot='description']": {
          color: "critical.11",
          fontWeight: "300",
        },
      },

      "& [slot='caretIcon']": {
        gridArea: "flyoutCaret",
        textAlign: "right",
        my: "auto",
        marginInlineStart: "400",
        boxSize: "500",
        color: "neutral.11",
      },

      // Styles for Text[slot="label"]
      "& [slot='label']": {
        gridArea: "label",
        fontWeight: "500",
      },

      // Styles for Text[slot="description"]
      "& [slot='description']": {
        gridArea: "description",
        color: "neutral.11",
      },

      // Styles for Kbd[slot="keyboard"]
      "& [slot='keyboard']": {
        gridArea: "keyboard",
        color: "colorPalette.11",
        fontFamily: "mono",
        marginInlineStart: "400",
        my: "auto",
      },

      // Styles for Icon[slot="icon"]
      "& [slot='icon']": {
        gridArea: "icon",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginInlineEnd: "300",
        my: "auto",
        flexShrink: 0,
        color: "neutral.11",
        boxSize: "500",
      },

      // Disabled state
      "&[data-disabled]": {
        layerStyle: "disabled",
        pointerEvents: "none",
      },
    },
    section: {
      display: "flex",
      flexDirection: "column",
    },
    sectionLabel: {
      textStyle: "xs",
      fontWeight: "600",
      color: "neutral.11",
      px: "300",
      pt: "300",
      pb: "200",
      marginBottom: "100",
      textTransform: "uppercase",
      letterSpacing: "{spacing.25}",
    },
  },
});
