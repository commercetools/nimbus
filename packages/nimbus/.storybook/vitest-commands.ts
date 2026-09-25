/// <reference types="@vitest/browser-playwright" />
import type { BrowserCommand } from "vitest/node";

/**
 * Moves the real (Playwright) mouse cursor outside the viewport.
 *
 * Stories that use trusted input (`userEvent` from `vitest/browser`) leave the
 * real cursor wherever their last action put it. With `isolate: false`, later
 * stories render into the same page, and whatever element lands under that
 * parked cursor receives trusted `pointerover` events from Chromium. React
 * Aria's `useHover` ends a hover on any `pointerover` outside the hovered
 * element, so a synthetic `userEvent.hover()` in a later story can be undone
 * immediately (seen as flaky `data-hovered` / tooltip assertions in ListBox
 * and Slider). Parking the cursor outside the viewport after every test means
 * no element can sit under it.
 */
export const resetPointer: BrowserCommand<[]> = async (context) => {
  if (context.provider.name !== "playwright") return;
  await context.page.mouse.move(-1, -1);
};

// `vitest/browser` re-exports `BrowserCommands` from here, so augment the
// source module for `commands.resetPointer()` to type-check.
declare module "vitest/internal/browser" {
  interface BrowserCommands {
    resetPointer: () => Promise<void>;
  }
}
