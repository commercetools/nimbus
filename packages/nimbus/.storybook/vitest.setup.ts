import { setProjectAnnotations } from "@storybook/react-vite";
import * as projectAnnotations from "./preview";
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
// updated for storybook v9: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#experimental-test-addon-stabilized-and-renamed
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

/**
 * Collapse overlay enter/exit animations to near-zero duration.
 *
 * React Aria's `useExitAnimation` keeps an overlay mounted until every
 * animation returned by `element.getAnimations()` settles.  Drawer, Dialog,
 * DatePicker and DateRangePicker define CSS `@keyframes` animations on their
 * `[data-entering]` / `[data-exiting]` states, which means overlay-close
 * assertions race the real animation timeline (200–400 ms).
 *
 * We shorten the duration to 10 ms rather than removing the animation
 * entirely.  `animation: none` empties `getAnimations()`, which forces React
 * Aria onto its synchronous `onEnd()` code path — a different lifecycle from
 * what real animations exercise, and one that breaks sequential open/close
 * interactions in Chromium.  A short but non-zero duration keeps the animation
 * registered in the browser's timeline so React Aria still goes through its
 * normal async `Promise.allSettled → flushSync(onEnd)` path, but the
 * animation finishes within a single frame.
 *
 * Scoped to this setup file so `pnpm start:storybook` and the Storybook build
 * that Chromatic snapshots keep their real durations.
 */
const style = document.createElement("style");
style.setAttribute("data-nimbus-test-fast-animation", "");
style.textContent = `
  [data-entering], [data-exiting] {
    animation-duration: 10ms !important;
    animation-delay: 0s !important;
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
