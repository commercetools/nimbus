import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

const compactTransition = {
  transitionProperty: "padding, font-size, line-height, margin, opacity",
  transitionDuration: "fast",
  transitionTimingFunction: "ease-in-smooth",
  _motionReduce: { transitionDuration: "0s" },
};

/**
 * Recipe configuration for the DefaultPage component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const defaultPageSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "header",
    "backLink",
    "title",
    "subtitle",
    "actions",
    "tabNav",
    "content",
    "footer",
    "scrollSentinel",
  ],

  className: "nimbus-default-page",

  base: {
    root: {
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
      gridTemplateColumns: "1fr",
      width: "100%",
    },
    header: {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      paddingTop: "800",
      paddingX: "900",
      paddingBottom: "600",
      borderBottom: "solid-25",
      borderColor: "neutral.6",
      "&:has(.nimbus-default-page__tabNav)": {
        paddingBottom: "0",
      },
      "&:has(.nimbus-default-page__backLink)": {
        "& .nimbus-default-page__actions": {
          gridRow: "2 / span 2",
        },
      },
    },
    backLink: {
      focusRing: "outside",
      colorPalette: "primary",
      gridColumn: "1 / -1",
      display: "inline-flex",
      alignItems: "center",
      gap: "100",
      mb: "400",
      color: "colorPalette.11",
      textStyle: "sm",
      fontWeight: "500",
      cursor: "pointer",
      justifySelf: "start",
      _hover: {
        color: "colorPalette.12",
        textDecoration: "underline",
      },
    },
    title: {
      gridColumn: "1",
      alignSelf: "center",
      alignItems: "center",
      fontSize: "500",
      fontWeight: "600",
      lineHeight: "800",
      color: "neutral.12",
    },
    subtitle: {
      gridColumn: "1",
      alignSelf: "center",
      mt: "200",
      textStyle: "sm",
      color: "neutral.11",
    },
    actions: {
      gridColumn: "2",
      gridRow: "1 / span 2",
      display: "flex",
      alignItems: "center",
      justifyItems: "end",
      gap: "200",
    },
    tabNav: {
      gridColumn: "1 / -1",
      mt: "200",
    },
    content: {
      paddingX: "900",
      paddingY: "800",
    },
    footer: {
      borderTop: "solid-25",
      borderColor: "neutral.6",
      paddingX: "900",
      paddingY: "400",
    },
    // Out of flow, so it adds no grid item. Placed in grid row 1 with
    // `inset: 0`, it is as tall as the header's row and follows the header's
    // height, so the observer thresholds move with the shrink. The end line
    // must be explicit: an `auto` end line is the grid container's padding edge.
    scrollSentinel: {
      position: "absolute",
      gridRow: "1 / 2",
      gridColumn: "1 / 2",
      inset: "0",
      visibility: "hidden",
      pointerEvents: "none",
    },
  },

  variants: {
    layout: {
      /**
       * Constrained layout: the page fills the parent container height.
       * Only the content area scrolls. The header and footer are naturally
       * pinned by the CSS grid.
       */
      constrained: {
        root: {
          height: "100%",
        },
        content: {
          overflow: "auto",
        },
      },
      /**
       * Flexible layout: the page grows with its content.
       * The whole scroll container scrolls. Use `stickyHeader`/`stickyFooter`
       * to pin the header or footer.
       */
      flexible: {
        root: {
          height: "auto",
        },
      },
    },
    stickyHeader: {
      true: {
        header: {
          position: "sticky",
          top: 0,
          zIndex: 1,
          bg: "bg",
        },
      },
    },
    stickyFooter: {
      true: {
        footer: {
          position: "sticky",
          bottom: 0,
          zIndex: 1,
          bg: "bg",
        },
      },
    },
    /**
     * Set by Root from `stickyHeader="compact-on-scroll"`. Absent means the
     * feature is off and none of these rules apply.
     */
    compactHeader: {
      idle: {
        root: { position: "relative" },
        header: compactTransition,
        title: compactTransition,
        backLink: compactTransition,
        subtitle: compactTransition,
        tabNav: compactTransition,
      },
      compact: {
        root: { position: "relative" },
        // 12px around a 32px action row is the 56px band in the compact frame.
        // The 16px above the title is that shorter line, centered, not extra padding.
        header: {
          ...compactTransition,
          paddingTop: "300",
          paddingBottom: "300",
          "&:has(.nimbus-default-page__tabNav)": {
            paddingBottom: "300",
          },
          "&:has(.nimbus-default-page__backLink)": {
            gridTemplateColumns: "auto minmax(0, 1fr) auto",
            columnGap: "200",
            "& .nimbus-default-page__backLink": {
              gridColumn: "1",
              gridRow: "1",
            },
            "& .nimbus-default-page__title": {
              gridColumn: "2",
              gridRow: "1",
            },
            "& .nimbus-default-page__actions": {
              gridColumn: "3",
              gridRow: "1",
            },
          },
        },
        title: {
          ...compactTransition,
          fontSize: "400",
          lineHeight: "550",
          minWidth: "0",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        backLink: {
          ...compactTransition,
          gridColumn: "1",
          gridRow: "1",
          mb: "0",
          gap: "0",
          fontSize: "0px",
          lineHeight: "0px",
          whiteSpace: "nowrap",
          "& svg": {
            width: "250",
            height: "250",
          },
          _focusVisible: {
            fontSize: "350",
            lineHeight: "550",
            gap: "100",
            "& svg": {
              width: "1em",
              height: "1em",
            },
          },
        },
        subtitle: {
          ...compactTransition,
          gridColumn: "1 / -1",
          maxHeight: "0",
          overflow: "hidden",
          opacity: "0",
          mt: "0",
          _focusWithin: {
            maxHeight: "none",
            overflow: "visible",
            opacity: "1",
            mt: "200",
          },
        },
        tabNav: {
          ...compactTransition,
          mt: "0",
        },
      },
    },
  },

  defaultVariants: {
    layout: "constrained",
  },
});
