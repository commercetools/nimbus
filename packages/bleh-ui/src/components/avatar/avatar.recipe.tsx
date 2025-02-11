import { defineRecipe } from "@chakra-ui/react";

export const avatarRecipe = defineRecipe({
  className: "avatar",
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
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "2px solid transparent",
    _focus: {
      borderWidth: "2px",
      borderColor: "primary.7",
    },
  },
  variants: {
    size: {
      md: { width: "40px", height: "40px", textStyle: "sm" },
      xs: { width: "32px", height: "32px", textStyle: "xs" },
      "2xs": { width: "24px", height: "24px", textStyle: "xs" },
    },
    tone: {
      primary: {
        backgroundColor: "primary.3",
        color: "primary",
      },
      neutral: {
        backgroundColor: "neutral.3",
        color: "neutral",
      },
      critical: {
        backgroundColor: "critical.3",
        color: "critical",
      },
    },
    variant: {
      default: {
        backgroundColor: "primary.3",
        color: "primary",
      },
      focused: {
        backgroundColor: "transparent",
        borderWidth: "2px",
        borderColor: "primary.7",
        color: "primary.11",
      },
      disabled: {
        backgroundColor: "primary.3",
        color: "primary.11",
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
    tone: "primary",
  },
});
