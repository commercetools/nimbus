import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the PageContent component.
 * Defines width constraint variants and column layout patterns using CSS grid.
 */
export const pageContentRecipe = defineSlotRecipe({
  slots: ["root", "column"],

  className: "nimbus-page-content",

  base: {
    root: {
      display: "grid",
      width: "100%",
      gap: "800",
    },
    column: {
      '&[data-sticky="true"]': {
        position: "sticky",
        top: 0,
        alignSelf: "start",
      },
    },
  },

  variants: {
    variant: {
      wide: {
        root: {
          gridTemplateAreas: "'. content .'",
          gridTemplateColumns: "1fr minmax({sizes.sm}, {sizes.6xl}) 1fr",
        },
      },
      narrow: {
        root: {
          gridTemplateAreas: "'. content .'",
          gridTemplateColumns: "1fr minmax({sizes.sm}, {sizes.3xl}) 1fr",
        },
      },
      full: {
        root: {
          gridTemplateAreas: "'content'",
          gridTemplateColumns: "1fr",
        },
      },
    },

    columns: {
      "1": {
        root: {
          "& > [data-slot=content]": {
            gridArea: "content",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
          },
        },
      },
      "1/1": {
        root: {
          "& > [data-slot=content]": {
            gridArea: "content",
            display: "grid",
            gridTemplateColumns: {
              base: "minmax(0, 1fr)",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: "inherit",
          },
        },
      },
      "2/1": {
        root: {
          "& > [data-slot=content]": {
            gridArea: "content",
            display: "grid",
            gridTemplateColumns: {
              base: "minmax(0, 1fr)",
              md: "minmax(0, 2fr) minmax(0, 1fr)",
            },
            gap: "inherit",
          },
        },
      },
    },
  },

  defaultVariants: {
    variant: "wide",
    columns: "1",
  },
});
