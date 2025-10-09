import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  // Storybook tests (browser-based)
  "./vitest.storybook.config.ts",
  // Unit tests (JSDOM-based)
  "./vitest.unit.config.ts",
]);
