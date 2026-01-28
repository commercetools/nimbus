import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

const dialogVariants = {
  placement: {
    center: {
      modal: {
        alignItems: "center",
      },
      content: {
        "--dialog-base-margin": "auto",
        mx: "auto",
      },
    },
    top: {
      modal: {
        alignItems: "flex-start",
      },
      content: {
        "--dialog-base-margin": "spacing.1600",
        mx: "auto",
      },
    },
    bottom: {
      modal: {
        alignItems: "flex-end",
      },
      content: {
        "--dialog-base-margin": "spacing.1600",
        mx: "auto",
      },
    },
  },
  scrollBehavior: {
    inside: {
      modal: {
        overflow: "hidden",
      },
      content: {
        maxH: "calc(100% - 7.5rem)",
      },
      body: {
        overflow: "auto",
        focusVisibleRing: "outside",
      },
    },
    outside: {
      modal: {
        overflow: "auto",
      },
    },
  },
} as const;

/**
 * Dialog recipe - styling for Dialog component overlays
 * Supports center positioning, various sizes, and motion presets for accessible dialog experiences
 */
export const dialogSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "trigger",
    "modalOverlay",
    "modal",
    "content",
    "title",
    "closeTrigger",
    "header",
    "body",
    "footer",
  ],
  className: "nimbus-dialog",
  base: {
    trigger: {
      focusRing: "outside",
    },
    modalOverlay: {
      bg: {
        _dark: "bg/20",
        _light: "fg/20",
      },
      pos: "fixed",
      left: 0,
      top: 0,
      w: "100vw",
      h: "100dvh",
      backdropFilter: "blur({sizes.100})",
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
    modal: {
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
      pointerEvents: "none",
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
      pointerEvents: "auto",
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
      py: "400",
    },
    title: {},
    closeTrigger: {
      position: "absolute",
      top: "400",
      right: "400",
      zIndex: 1,
    },
  },
  variants: dialogVariants,
  defaultVariants: {
    scrollBehavior: "outside",
    placement: "center",
  },
});

export type DialogPlacement = keyof typeof dialogVariants.placement;
export type DialogScrollBehavior = keyof typeof dialogVariants.scrollBehavior;
