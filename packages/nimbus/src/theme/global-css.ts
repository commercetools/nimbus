import { defineGlobalStyles } from "@chakra-ui/react/styled-system";

export const globalCss = defineGlobalStyles({
  "*": {
    fontFeatureSettings:
      '"liga", "calt", "case", "ss01", "ss07", "ss08", "tnum"',
    /**
     * OVERRIDES FOR CSS VARS PROVIDED BY CHAKRA's `defaultBaseConfig` THEME
     * OBJECT THAT CANNOT BE RENAMED / OVERRIDDEN VIA THEME CONFIGURATION
     * `defaultBaseConfig` is defined here:
     * https://github.com/chakra-ui/chakra-ui/blob/daa05b1c7962990075ae5065a17d897d80e276f2/packages/react/src/preset-base.ts#L220
     */
    "--ring-inset": "var(--chakra-empty,/*!*/ /*!*/)",
    "--ring-offset-width": "0px",
    "--ring-offset-color": "#fff",
    "--ring-color": "rgba(66, 153, 225, 0.6)",
    "--ring-offset-shadow": "0 0 #0000",
    "--ring-shadow": "0 0 #0000",
    // Set default chakra-variables for focus ring
    "--focus-ring-color": "colors.primary.7",
    "--focus-ring-width": "sizes.50",
    "--focus-ring-offset": "spacing.50",
    "--focus-ring-style": "solid",
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
    /**
     * PREFIX ANY GLOBAL CSS VARIABLE THAT IS DEFINED BELOW THIS COMMENT WITH `--nimbus`
     * TO DENOTE THAT IT IS SPECIFIC TO THE NIMBUS THEME AND NOT OVERRIDING CHAKRA
     */
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
  /** overrides for styling in the chakra theme's preflight @reset layer
   * overview of preflight config:
   * https://chakra-ui.com/docs/theming/overview#preflight
   * values set in @reset layer by preflight option:
   * https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/styled-system/preflight.ts
   */
  body: {
    /** stops reset layer from triggering react-aria bug in overlay/tooltip positioning:
     * https://github.com/adobe/react-spectrum/issues/7654
     * https://github.com/adobe/react-spectrum/issues/7960
     */
    position: "initial",
  },
  "img, svg, video, canvas, audio, iframe, embed, object": {
    display: "initial",
    verticalAlign: "initial",
  },
});
