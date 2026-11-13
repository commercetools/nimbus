import type { NavigationConfig } from "./shape-navigation";

/**
 * How the docs app shapes the menu from the route manifest into the top bar
 * and the sidebar. Page URLs do not change; see `shapeNavigation`.
 */
export const navigationConfig: NavigationConfig = {
  // Pages for trying out docs features, not documentation.
  hidden: ["home/playground"],
  // "Other" says nothing about its pages; list them with the other tokens.
  merged: ["home/design-tokens/other"],
  // Show the component name instead of a description of it.
  labels: {
    "components/inputs/select-input": "Select",
    "components/inputs/range-slider": "RangeSlider",
  },
  // Every top-level section comes from the first entry of a page's `menu`, so
  // no section is built from groups of other sections.
  sections: [],
};
