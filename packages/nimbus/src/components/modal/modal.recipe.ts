import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Modal recipe - shared styling for Modal, Dialog, and Drawer components
 * Supports center positioning (Dialog), edge positioning (Drawer), and all motion presets
 */
export const modalSlotRecipe = defineSlotRecipe({
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
  className: "nimbus-modal",
  base: {
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
      "--modal-z-index": "zIndex.modal",
      zIndex: "calc(var(--modal-z-index) + var(--layer-index, 0))",
      justifyContent: "center",
      overscrollBehaviorY: "none",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      width: "100%",
      outline: 0,
      borderRadius: "200",
      textStyle: "sm",
      my: "var(--modal-margin, var(--modal-base-margin))",
      "--modal-z-index": "zIndex.modal",
      zIndex: "calc(var(--modal-z-index) + var(--layer-index, 0))",
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
    },
    description: {
      color: "fg.muted",
    },
    closeTrigger: {
      position: "absolute",
      top: "400",
      right: "400",
      zIndex: 1,
    },
  },
  variants: {
    placement: {
      center: {
        positioner: {
          alignItems: "center",
        },
        content: {
          "--modal-base-margin": "auto",
          mx: "auto",
        },
      },
      top: {
        positioner: {
          alignItems: "flex-start",
        },
        content: {
          "--modal-base-margin": "spacing.1600",
          mx: "auto",
        },
      },
      bottom: {
        positioner: {
          alignItems: "flex-end",
        },
        content: {
          "--modal-base-margin": "spacing.1600",
          mx: "auto",
        },
      },
      left: {
        positioner: {
          alignItems: "stretch",
          justifyContent: "flex-start",
        },
        content: {
          "--modal-base-margin": "0",
          mx: "0",
          my: "0",
          height: "100%",
          borderRadius: "0 200 200 0",
        },
      },
      right: {
        positioner: {
          alignItems: "stretch",
          justifyContent: "flex-end",
        },
        content: {
          "--modal-base-margin": "0",
          mx: "0",
          my: "0",
          height: "100%",
          borderRadius: "200 0 0 200",
        },
      },
    },
    scrollBehavior: {
      inside: {
        positioner: {
          overflow: "hidden",
        },
        content: {
          maxH: "calc(100% - 7.5rem)",
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
          maxW: "sm",
        },
      },
      sm: {
        content: {
          maxW: "md",
        },
      },
      md: {
        content: {
          maxW: "lg",
        },
      },
      lg: {
        content: {
          maxW: "2xl",
        },
      },
      xl: {
        content: {
          maxW: "4xl",
        },
      },
      narrow: {
        content: {
          maxW: "xs",
        },
      },
      wide: {
        content: {
          maxW: "6xl",
        },
      },
      cover: {
        positioner: {
          padding: "1000",
        },
        content: {
          width: "100%",
          height: "100%",
          "--modal-margin": "0",
        },
      },
      full: {
        content: {
          maxW: "100vw",
          minH: "100vh",
          "--modal-margin": "0",
          borderRadius: "0",
        },
      },
    },
    motionPreset: {
      scale: {
        content: {
          _open: {
            animationName: "scale-in, fade-in",
          },
          _closed: {
            animationName: "scale-out, fade-out",
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
      none: {},
    },
  },
  defaultVariants: {
    size: "md",
    scrollBehavior: "outside",
    placement: "center",
    motionPreset: "scale",
  },
});
