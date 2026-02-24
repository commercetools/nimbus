import { defineConfig } from "vitest/config";
import { resolve } from "path";

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
      resolve(__dirname, "./vitest.storybook.config.ts"),
      // Unit tests (JSDOM-based)
      resolve(__dirname, "./vitest.unit.config.ts"),
    ],
  },
});
