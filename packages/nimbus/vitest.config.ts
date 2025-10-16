import { defineConfig } from "vitest/config";

/**
 * Root Vitest configuration that orchestrates multiple test projects.
 *
 * Projects:
 * - storybook: Browser-based tests using Playwright
 * - unit: JSDOM-based unit tests
 */
export default defineConfig({
  test: {
    projects: [
      // Storybook tests (browser-based)
      "./vitest.storybook.config.ts",
      // Unit tests (JSDOM-based)
      "./vitest.unit.config.ts",
    ],
  },
});
