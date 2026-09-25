import { setProjectAnnotations } from "@storybook/react-vite";
import { afterEach } from "vitest";
import { commands } from "vitest/browser";
import * as projectAnnotations from "./preview";
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
// updated for storybook v9: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#experimental-test-addon-stabilized-and-renamed
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

/**
 * Park the real mouse cursor outside the viewport after every story.
 *
 * Stories run with `isolate: false`, so a story that uses trusted input
 * (e.g. Checkbox's `userEvent` from `vitest/browser`) leaves the real cursor
 * over the area where later stories render. Chromium then sends trusted
 * `pointerover` events to whatever element lands under it, which ends React
 * Aria hovers started by synthetic `userEvent.hover()` calls. See
 * `./vitest-commands.ts`.
 */
afterEach(async () => {
  await commands.resetPointer();
});

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
