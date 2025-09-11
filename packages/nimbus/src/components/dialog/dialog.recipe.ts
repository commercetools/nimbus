import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Dialog recipe - styling for Dialog component overlays
 * Supports center positioning, various sizes, and motion presets for accessible dialog experiences
 */
export const dialogSlotRecipe = defineSlotRecipe({
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
  className: "nimbus-dialog",
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
      "&[data-entering]": {
        animationName: "fade-in",
        animationDuration: "fast",
      },
      "&[data-exiting]": {
        animationName: "fade-out",
        animationDuration: "faster",
      },
    },
    positioner: {
      display: "flex",
      width: "100vw",
      height: "100dvh",
      position: "fixed",
      left: 0,
      top: 0,
      "--dialog-z-index": "zIndex.modal",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
      justifyContent: "center",
      overscrollBehaviorY: "none",
      "&[data-entering]": {
        animationDuration: "moderate",
        animationName: "slide-from-bottom, scale-in, fade-in",
      },
      "&[data-exiting]": {
        animationDuration: "faster",
        animationName: "slide-to-top, scale-out, fade-out",
      },
    },
    content: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      outline: 0,
      borderRadius: "200",
      textStyle: "sm",
      my: "var(--dialog-margin, var(--dialog-base-margin))",
      "--dialog-z-index": "zIndex.modal",
      zIndex: "calc(var(--dialog-z-index) + var(--layer-index, 0))",
      bg: "bg",
      boxShadow: "6",
      width: "lg",
      maxW: "full",
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
          "--dialog-base-margin": "auto",
          mx: "auto",
        },
      },
      top: {
        positioner: {
          alignItems: "flex-start",
        },
        content: {
          "--dialog-base-margin": "spacing.1600",
          mx: "auto",
        },
      },
      bottom: {
        positioner: {
          alignItems: "flex-end",
        },
        content: {
          "--dialog-base-margin": "spacing.1600",
          mx: "auto",
        },
      },
      left: {
        positioner: {
          alignItems: "stretch",
          justifyContent: "flex-start",
        },
        content: {
          "--dialog-base-margin": "0",
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
          "--dialog-base-margin": "0",
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
  },
  defaultVariants: {
    scrollBehavior: "outside",
    placement: "center",
  },
});
