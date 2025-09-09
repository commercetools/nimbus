import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const drawerSlotRecipe = defineSlotRecipe({
  slots: [
    "trigger",
    "backdrop",
    "positioner",
    "content",
    "title",
    "description",
    "closeTrigger",
    "header",
    "body",
    "footer",
  ],
  className: "nimbus-drawer",
  base: {
    trigger: {
      // Inherits button styling from base theme
    },
    backdrop: {
      bg: {
        _dark: "bg/50",
        _light: "fg/50",
      },
      pos: "fixed",
      left: 0,
      top: 0,
      w: "100vw",
      h: "100dvh",
      zIndex: "modal",
      _open: {
        animationName: "fade-in",
        animationDuration: "slow",
      },
      _closed: {
        animationName: "fade-out",
        animationDuration: "moderate",
      },
    },
    positioner: {
      display: "flex",
      width: "100vw",
      height: "100dvh",
      position: "fixed",
      left: 0,
      top: 0,
      "--drawer-z-index": "zIndex.modal",
      zIndex: "calc(var(--drawer-z-index) + var(--layer-index, 0))",
      overscrollBehaviorY: "none",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      outline: 0,
      textStyle: "sm",
      "--drawer-z-index": "zIndex.modal",
      zIndex: "calc(var(--drawer-z-index) + var(--layer-index, 0))",
      bg: "bg",
      boxShadow: "lg",
      _open: {
        animationDuration: "moderate",
      },
      _closed: {
        animationDuration: "faster",
      },
    },
    header: {
      flex: 0,
      px: "600",
      pt: "600",
      pb: "400",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    body: {
      flex: "1",
      px: "600",
      pt: "200",
      pb: "600",
    },
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "300",
      px: "600",
      pt: "200",
      pb: "400",
    },
    title: {
      textStyle: "lg",
      fontWeight: "semibold",
      flex: 1,
      mr: "400",
    },
    description: {
      color: "fg.muted",
      mt: "200",
    },
    closeTrigger: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      outline: 0,
      border: 0,
      bg: "transparent",
      cursor: "pointer",
      borderRadius: "100",
      color: "fg.muted",
      p: "200",
      minW: "800",
      minH: "800",
      _hover: {
        bg: "bg.muted",
        color: "fg",
      },
      _focusVisible: {
        boxShadow: "outline",
      },
      _disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
  },
  variants: {
    side: {
      left: {
        positioner: {
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
        content: {
          height: "100vh",
          borderTopRightRadius: "200",
          borderBottomRightRadius: "200",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      },
      right: {
        positioner: {
          justifyContent: "flex-end",
          alignItems: "stretch",
        },
        content: {
          height: "100vh",
          borderTopLeftRadius: "200",
          borderBottomLeftRadius: "200",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      },
      top: {
        positioner: {
          alignItems: "flex-start",
          justifyContent: "stretch",
        },
        content: {
          width: "100vw",
          borderBottomLeftRadius: "200",
          borderBottomRightRadius: "200",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
      },
      bottom: {
        positioner: {
          alignItems: "flex-end",
          justifyContent: "stretch",
        },
        content: {
          width: "100vw",
          borderTopLeftRadius: "200",
          borderTopRightRadius: "200",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
      },
    },
    scrollBehavior: {
      inside: {
        positioner: {
          overflow: "hidden",
        },
        content: {
          maxH: "100vh",
        },
        body: {
          overflow: "auto",
        },
      },
      outside: {
        positioner: {
          overflow: "auto",
          pointerEvents: "auto",
        },
      },
    },
    size: {
      xs: {
        content: {
          "&[data-side=left], &[data-side=right]": {
            maxW: "xs",
            w: "xs",
          },
          "&[data-side=top], &[data-side=bottom]": {
            maxH: "xs",
            h: "xs",
          },
        },
      },
      sm: {
        content: {
          "&[data-side=left], &[data-side=right]": {
            maxW: "sm",
            w: "sm",
          },
          "&[data-side=top], &[data-side=bottom]": {
            maxH: "sm",
            h: "sm",
          },
        },
      },
      md: {
        content: {
          "&[data-side=left], &[data-side=right]": {
            maxW: "md",
            w: "md",
          },
          "&[data-side=top], &[data-side=bottom]": {
            maxH: "md",
            h: "md",
          },
        },
      },
      lg: {
        content: {
          "&[data-side=left], &[data-side=right]": {
            maxW: "lg",
            w: "lg",
          },
          "&[data-side=top], &[data-side=bottom]": {
            maxH: "lg",
            h: "lg",
          },
        },
      },
      xl: {
        content: {
          "&[data-side=left], &[data-side=right]": {
            maxW: "xl",
            w: "xl",
          },
          "&[data-side=top], &[data-side=bottom]": {
            maxH: "xl",
            h: "xl",
          },
        },
      },
      narrow: {
        content: {
          "&[data-side=left], &[data-side=right]": {
            maxW: "2xs",
            w: "2xs",
          },
          "&[data-side=top], &[data-side=bottom]": {
            maxH: "2xs",
            h: "2xs",
          },
        },
      },
      wide: {
        content: {
          "&[data-side=left], &[data-side=right]": {
            maxW: "2xl",
            w: "2xl",
          },
          "&[data-side=top], &[data-side=bottom]": {
            maxH: "2xl",
            h: "2xl",
          },
        },
      },
      cover: {
        content: {
          "&[data-side=left], &[data-side=right]": {
            width: "80vw",
            maxW: "80vw",
            height: "100vh",
          },
          "&[data-side=top], &[data-side=bottom]": {
            height: "80vh",
            maxH: "80vh",
            width: "100vw",
          },
        },
      },
      full: {
        content: {
          maxW: "100vw",
          width: "100vw",
          minH: "100vh",
          height: "100vh",
          borderRadius: "0",
        },
      },
    },
    motionPreset: {
      "slide-in-left": {
        content: {
          _open: {
            animationName: "slide-from-left, fade-in",
          },
          _closed: {
            animationName: "slide-to-left, fade-out",
          },
        },
      },
      "slide-in-right": {
        content: {
          _open: {
            animationName: "slide-from-right, fade-in",
          },
          _closed: {
            animationName: "slide-to-right, fade-out",
          },
        },
      },
      "slide-in-top": {
        content: {
          _open: {
            animationName: "slide-from-top, fade-in",
          },
          _closed: {
            animationName: "slide-to-top, fade-out",
          },
        },
      },
      "slide-in-bottom": {
        content: {
          _open: {
            animationName: "slide-from-bottom, fade-in",
          },
          _closed: {
            animationName: "slide-to-bottom, fade-out",
          },
        },
      },
      none: {},
    },
  },
  defaultVariants: {
    side: "left",
    size: "md",
    scrollBehavior: "outside",
    motionPreset: "slide-in-left",
  },
});
