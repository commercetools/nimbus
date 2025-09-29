import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Drawer recipe - styling for Drawer component overlays
 * Supports center positioning, various sizes, and motion presets for accessible drawer experiences
 */
export const drawerSlotRecipe = defineSlotRecipe({
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
  className: "nimbus-drawer",
  base: {
    trigger: {
      focusRing: "outside",
    },
    modalOverlay: {
      pos: "fixed",
      left: 0,
      top: 0,
      w: "100vw",
      h: "100dvh",
      zIndex: "modal",
    },
    modal: {
      display: "flex",
      width: "100vw",
      height: "100dvh",
      position: "fixed",
      left: 0,
      top: 0,
      "--drawer-z-index": "zIndex.modal",
      zIndex: "calc(var(--drawer-z-index) + var(--layer-index, 0))",
      justifyContent: "center",
      overscrollBehaviorY: "none",
      pointerEvents: "none",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      outline: 0,
      borderRadius: "200",
      textStyle: "sm",
      my: "var(--drawer-margin, var(--drawer-base-margin))",
      "--drawer-z-index": "zIndex.modal",
      zIndex: "calc(var(--drawer-z-index) + var(--layer-index, 0))",
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
    showBackdrop: {
      true: {
        modalOverlay: {
          bg: {
            _dark: "bg/20",
            _light: "fg/20",
          },
          backdropFilter: "blur({sizes.100})",
        },
      },
      false: {
        modalOverlay: {
          bg: "transparent",
        },
      },
    },
    placement: {
      left: {
        modal: {
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
        content: {
          "--drawer-base-margin": 0,
          mx: 0,
          height: "100vh",
          borderRadius: 0,
        },
      },
      right: {
        modal: {
          justifyContent: "flex-end",
          alignItems: "stretch",
        },
        content: {
          "--drawer-base-margin": 0,
          mx: 0,
          height: "100vh",
          borderRadius: 0,
        },
      },
      top: {
        modal: {
          alignItems: "flex-start",
        },
        content: {
          "--drawer-base-margin": "spacing.1600",
          mx: "auto",
        },
      },
      bottom: {
        modal: {
          alignItems: "flex-end",
        },
        content: {
          "--drawer-base-margin": "spacing.1600",
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
  },
  defaultVariants: {
    scrollBehavior: "outside",
    placement: "right",
    showBackdrop: false,
  },
});
