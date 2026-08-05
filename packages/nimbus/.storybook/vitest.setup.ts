import { setProjectAnnotations } from "@storybook/react-vite";
import * as projectAnnotations from "./preview";
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
// updated for storybook v9: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#experimental-test-addon-stabilized-and-renamed
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

/**
 * Neutralize overlay enter/exit animations for the duration of a test run.
 *
 * React Aria's `useExitAnimation` keeps an overlay mounted until every
 * animation returned by `element.getAnimations()` settles, so any component
 * with a `&[data-exiting]` animation only unmounts once the browser has
 * actually finished running that animation. Four recipes opt into this —
 * Drawer, Dialog, DatePicker and DateRangePicker — which makes every
 * "overlay is gone after close" assertion a race against the real animation
 * timeline. Every other overlay (Tooltip, Menu, Select, ComboBox, Popover)
 * declares no exit animation, so `getAnimations()` is empty and React Aria
 * unmounts synchronously.
 *
 * Setting `animation: none` empties `getAnimations()`, which puts the animated
 * overlays on that same synchronous path. No story asserts on `data-entering`
 * or `data-exiting`, so nothing is under test here — the wait was incidental.
 *
 * Scoped to this setup file, so `pnpm start:storybook` and the Storybook build
 * that Chromatic snapshots keep their animations.
 */
const style = document.createElement("style");
style.setAttribute("data-nimbus-test-no-animation", "");
style.textContent = `
  [data-entering], [data-exiting] {
    animation: none !important;
  }
`;
document.head.appendChild(style);

/**
 * Suppress "Could not parse CSS stylesheet" noise in test output.
 *
 * Emotion / Chakra UI inject CSS via CSSStyleSheet APIs with syntax that
 * the browser's CSSOM parser sometimes rejects. The resulting console messages
 * are non-actionable and flood CI output.
 */
function isCssParseNoise(args: unknown[]): boolean {
  return (
    typeof args[0] === "string" &&
    args[0].includes("Could not parse CSS stylesheet")
  );
}

const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (isCssParseNoise(args)) return;
  originalWarn.apply(console, args);
};

const originalError = console.error;
console.error = (...args: unknown[]) => {
  if (isCssParseNoise(args)) return;
  originalError.apply(console, args);
};
