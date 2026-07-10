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
    // SVG content (the Person fallback or a custom icon) sized relative to the
    // avatar slot. The icon ships with width/height "1em", which would inherit
    // the recipe's small text font-size. We override to 75% of the slot so the
    // icon visually balances initials text — and, because every avatar size is
    // a multiple of 4px, ¾ of it always lands on a whole, even pixel value
    // (md 40→30, xs 32→24, 2xs 24→18). That keeps the icon crisp (a fractional
    // size such as 70%→16.8px anti-aliases across half-pixels) and matches the
    // Figma chat-bubble spec of a 24px icon in the 32px (`xs`) avatar.
    "& > svg": {
      fontSize: "1.5em",
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
