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
  // Learn comes first, so the tab opens it; tokens and props are the
  // reference material after it.
  sections: [
    {
      id: "foundations",
      label: "Foundations",
      order: 2,
      groups: ["learn", "home/design-tokens", "home/style-props"],
    },
  ],
};
