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
  // Learn, design tokens and style props make up one section in the top bar.
  // The Foundations page is the entry of the section and links to the three.
  sections: [
    {
      id: "foundations",
      label: "Foundations",
      order: 2,
      page: "foundations",
      groups: ["learn", "home/design-tokens", "home/style-props"],
    },
  ],
};
