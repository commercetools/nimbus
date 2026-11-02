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
  // Design tokens and style props are reference material, not part of
  // getting started, so they get their own section in the top bar. The
  // Styling page is the entry of the section; its guides come before the
  // reference pages.
  sections: [
    {
      id: "styling",
      label: "Styling",
      order: 2,
      page: "styling",
      groups: ["home/design-tokens", "home/style-props"],
    },
  ],
};
