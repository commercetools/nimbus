import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Dialog recipe - styling for Dialog component overlays
 * Supports center positioning, various sizes, and motion presets for accessible dialog experiences
 */
export const dialogSlotRecipe = defineSlotRecipe({
  slots: [
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
      width: "100vw",
      height: "var(--visual-viewport-height)",
      zIndex: 100,
      background: "#00000080",
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      position: "fixed",
      top: 0,
      left: 0,
    },
    modal: {
      outline: "none",
      maxWidth: "100%",
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
    title: {},
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
          pointerEvents: "auto",
        },
      },
    },
    variant: {
      plain: {},
      split: {
        header: {
          borderBottom: "solid-25",
          borderColor: "colorPalette.3",
        },
        footer: {
          borderTop: "solid-25",
          borderColor: "colorPalette.3",
        },
      },
    },
  },
  defaultVariants: {
    scrollBehavior: "outside",
    placement: "center",
  },
});
