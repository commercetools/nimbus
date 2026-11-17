import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the DefaultPage component.
 * Defines the styling variants and base styles using Chakra UI's recipe system.
 */
export const defaultPageSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "header",
    "backLink",
    "backLinkLabel",
    "title",
    "subtitle",
    "actions",
    "tabNav",
    "content",
    "footer",
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
     * Collapse header on scroll. `DefaultPage.Root` sets this variant only
     * when the header is pinned. The one-step change marks the collapsed
     * header with `data-collapsed="true"`; the scroll-driven change marks the
     * pinned header with `data-scroll-collapsed="true"`. Both attributes are
     * internal. Pages without the option get none of these styles.
     *
     * Values from the compact header design: 12px vertical padding, title at
     * font size 400 / line height 550 (all lines stay), back link as a 24px icon
     * 4px before the title.
     */
    collapseHeaderOnScroll: {
      true: {
        // Scroll-driven collapse, constrained layout: the header moves up
        // with the scroll position of the content area (its top margin), and
        // Root clips it at its top edge.
        root: {
          "&[data-scroll-driven='constrained']": {
            overflowY: "clip",
          },
        },
        header: {
          // Parts that appear when the header returns to its full form fade
          // in. The collapsed rules below set `transition: none`, so parts
          // that disappear are hidden at once.
          "& .nimbus-default-page__subtitle, & .nimbus-default-page__backLinkLabel":
            {
              transitionProperty: "opacity",
              transitionDuration: "fast",
              transitionTimingFunction: "ease-out",
              _motionReduce: {
                transition: "none",
              },
            },
          "&[data-collapsed='true']": {
            paddingTop: "300",
            paddingBottom: "300",
            // `minmax(0, …)` lets the title column shrink, also for a title a
            // page truncates. The number of columns stays the same, so page-owned
            // content keeps its grid column.
            gridTemplateColumns: "minmax(0, 1fr) auto",
            "& .nimbus-default-page__subtitle, & .nimbus-default-page__backLinkLabel":
              {
                // Hidden visually, kept in the accessibility tree.
                srOnly: true,
                opacity: 0,
                transition: "none",
              },
            "& .nimbus-default-page__backLink": {
              gridColumn: "1",
              gridRow: "1",
              alignSelf: "center",
              justifyContent: "center",
              minWidth: "600",
              minHeight: "600",
              mb: "0",
            },
            "& .nimbus-default-page__title": {
              gridRow: "1",
              minWidth: "0",
              // All lines stay. Pages that want one line truncate the title.
              fontSize: "400",
              lineHeight: "550",
            },
            // The back link shares the title's grid cell. A margin (not a
            // padding) keeps the title box off the link, so the link stays
            // clickable.
            "&:has(.nimbus-default-page__backLink) .nimbus-default-page__title":
              {
                marginInlineStart: "calc({sizes.600} + {spacing.100})",
              },
            "& .nimbus-default-page__actions, &:has(.nimbus-default-page__backLink) .nimbus-default-page__actions":
              {
                gridRow: "1",
              },
            "&:has(.nimbus-default-page__tabNav)": {
              paddingBottom: "0",
              "& .nimbus-default-page__tabNav": {
                mt: "300",
              },
            },
          },
          // Scroll-driven collapse: the pinned collapsed form. The
          // header keeps its full layout (its parts are moved with
          // transforms), so only the back link changes: its icon in a 24px
          // box, the label hidden visually. The negative margins keep the
          // link's outer size and its icon's place, so nothing else moves.
          "&[data-scroll-collapsed='true']": {
            "& .nimbus-default-page__backLinkLabel": {
              srOnly: true,
            },
            "& .nimbus-default-page__backLink": {
              justifyContent: "center",
              width: "600",
              height: "600",
              marginTop: "calc((1lh - {sizes.600}) / 2)",
              marginBottom: "calc({spacing.400} + (1lh - {sizes.600}) / 2)",
              marginInlineStart: "var(--default-page-back-icon-inset, 0px)",
            },
          },
        },
      },
    },
  },

  defaultVariants: {
    layout: "constrained",
  },
});
