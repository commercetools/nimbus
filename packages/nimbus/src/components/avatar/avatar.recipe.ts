import { defineRecipe } from "@chakra-ui/react/styled-system";

const avatarVariants = {
  size: {
    md: { width: 1000, height: 1000, textStyle: "sm" },
    xs: { width: 800, height: 800, textStyle: "xs" },
    "2xs": { width: 600, height: 600, textStyle: "xs" },
  },
} as const;

export const avatarRecipe = defineRecipe({
  className: "nimbus-avatar",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    overflow: "hidden",
    userSelect: "none",
    borderRadius: "full",
    flexShrink: 0,
    fontWeight: "600",
    backgroundColor: "colorPalette.3",
    colorPalette: "primary",
    color: "colorPalette.11",
    focusVisibleRing: "outside",
    "button&": {
      cursor: "button",
    },
    _disabled: {
      layerStyle: "disabled",
    },
  },
  variants: avatarVariants,
  defaultVariants: {
    size: "md",
  },
});

export type AvatarSize = keyof typeof avatarVariants.size;
