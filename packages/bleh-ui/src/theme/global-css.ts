import { defineGlobalStyles } from "@chakra-ui/react";

export const globalCss = defineGlobalStyles({
  "*": {
    fontFeatureSettings:
      '"liga", "calt", "case", "ss01", "ss07", "ss08", "tnum"',
    "--ring-inset": "var(--chakra-empty,/*!*/ /*!*/)",
    "--ring-offset-width": "0px",
    "--ring-offset-color": "#fff",
    "--ring-color": "rgba(66, 153, 225, 0.6)",
    "--ring-offset-shadow": "0 0 #0000",
    "--ring-shadow": "0 0 #0000",
    "--focus-ring-color": "colors.neutral.7",
    "--brightness": "var(--chakra-empty,/*!*/ /*!*/)",
    "--contrast": "var(--chakra-empty,/*!*/ /*!*/)",
    "--grayscale": "var(--chakra-empty,/*!*/ /*!*/)",
    "--hue-rotate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--invert": "var(--chakra-empty,/*!*/ /*!*/)",
    "--saturate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--sepia": "var(--chakra-empty,/*!*/ /*!*/)",
    "--drop-shadow": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-blur": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-brightness": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-contrast": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-grayscale": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-hue-rotate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-invert": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-opacity": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-saturate": "var(--chakra-empty,/*!*/ /*!*/)",
    "--backdrop-sepia": "var(--chakra-empty,/*!*/ /*!*/)",
    "--global-font-mono": "fonts.mono",
    "--global-font-body": "fonts.body",
    "--global-color-border": "colors.border",
  },
  /** 'liga' may replace 2 characters with a single one,
   * which causes differences in formatting when a monospace font is used.*/
  "code *": {
    fontFeatureSettings: '"calt", "case", "ss01", "ss07", "ss08", "tnum"',
  },
  html: {
    color: "fg",
    bg: "bg",
    lineHeight: "1.5",
    colorPalette: "neutral",
  },
  "*::placeholder": {
    color: "fg.muted/80",
  },
  "*::selection": {
    bg: "colorPalette.9",
    color: "colorPalette.contrast",
  },
});
