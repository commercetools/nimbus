import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ScrollArea component.
 * Overrides Chakra UI's default scrollArea recipe with Nimbus design tokens.
 */
export const scrollAreaSlotRecipe = defineSlotRecipe({
  className: "nimbus-scroll-area",
  slots: ["root", "viewport", "content", "scrollbar", "thumb", "corner"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      "--scrollbar-margin": "2px",
      "--scrollbar-click-area":
        "calc(var(--scrollbar-size) + calc(var(--scrollbar-margin) * 2))",
      _focusWithin: {
        "&:has(:focus-visible)": {
          outlineWidth: "var(--focus-ring-width, 1px)",
          outlineColor: "var(--focus-ring-color)",
          outlineStyle: "var(--focus-ring-style, solid)",
          outlineOffset: "2px",
        },
      },
    },
    viewport: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
      borderRadius: "inherit",
      outline: "none",
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    content: {
      minWidth: "100%",
    },
    scrollbar: {
      display: "flex",
      userSelect: "none",
      touchAction: "none",
      borderRadius: "full",
      transition: "opacity 150ms 300ms",
      position: "relative",
      margin: "var(--scrollbar-margin)",
      "&:not([data-overflow-x], [data-overflow-y])": {
        display: "none",
      },
      bg: "neutral.4",
      "--thumb-bg": "{colors.neutral.7}",
      "&:is(:hover, :active)": {
        "--thumb-bg": "{colors.neutral.9}",
      },
      _before: {
        content: '""',
        position: "absolute",
      },
      _vertical: {
        width: "var(--scrollbar-size)",
        flexDirection: "column",
        "&::before": {
          width: "var(--scrollbar-click-area)",
          height: "100%",
          insetInlineStart: "calc(var(--scrollbar-margin) * -1)",
        },
      },
      _horizontal: {
        height: "var(--scrollbar-size)",
        flexDirection: "row",
        "&::before": {
          height: "var(--scrollbar-click-area)",
          width: "100%",
          top: "calc(var(--scrollbar-margin) * -1)",
        },
      },
    },
    thumb: {
      borderRadius: "inherit",
      bg: "var(--thumb-bg)",
      transition: "backgrounds",
      _vertical: { width: "full" },
      _horizontal: { height: "full" },
    },
    corner: {
      bg: "neutral.3",
      margin: "var(--scrollbar-margin)",
      opacity: 0,
      transition: "opacity 150ms 300ms",
      "&[data-hover]": {
        transitionDelay: "0ms",
        opacity: 1,
      },
    },
  },
  variants: {
    variant: {
      hover: {
        scrollbar: {
          opacity: "0",
          "&[data-hover], &[data-scrolling]": {
            opacity: "1",
            transitionDuration: "faster",
            transitionDelay: "0ms",
          },
        },
      },
      always: {
        scrollbar: {
          opacity: "1",
        },
      },
    },
    size: {
      xs: {
        root: {
          "--scrollbar-size": "{sizes.100}",
        },
      },
      sm: {
        root: {
          "--scrollbar-size": "{sizes.150}",
        },
      },
      md: {
        root: {
          "--scrollbar-size": "{sizes.200}",
        },
      },
      lg: {
        root: {
          "--scrollbar-size": "{sizes.300}",
        },
      },
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "hover",
  },
});
