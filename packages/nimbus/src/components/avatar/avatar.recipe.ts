import { defineRecipe } from "@chakra-ui/react/styled-system";

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
    // Person-icon fallback sized relative to the avatar slot. The icon
    // ships with width/height "1em", which would inherit the recipe's
    // small text font-size. We override to ~70% of the slot so the icon
    // visually balances initials text across all sizes.
    "& > svg": {
      width: "70%",
      height: "70%",
    },
  },
  variants: {
    size: {
      md: { width: 1000, height: 1000, textStyle: "sm" },
      xs: { width: 800, height: 800, textStyle: "xs" },
      "2xs": { width: 600, height: 600, textStyle: "xs" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
