import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

/**
 * Recipe configuration for the ItemGroup component.
 *
 * `ItemGroup.Root` lays a set of `Item` rows out as a vertical stack;
 * `ItemGroup.Separator` is a horizontal divider between rows. The group is a
 * plain container and deliberately does **not** assign `role="list"` — a list
 * role would require every child to be a `listitem` and would forbid separator
 * children (`aria-required-children`), which the free-composition API cannot
 * guarantee.
 */
export const itemGroupSlotRecipe = defineSlotRecipe({
  slots: ["root", "separator"],

  className: "nimbus-item-group",

  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    // Mirrors the Nimbus Separator's horizontal treatment so grouped dividers
    // read identically to standalone ones.
    separator: {
      colorPalette: "neutral",
      border: "0",
      flexShrink: "0",
      width: "100%",
      height: "25",
      backgroundColor: "colorPalette.6",
    },
  },
});
