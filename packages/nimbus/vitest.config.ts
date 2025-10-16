import { defineConfig } from "vitest/config";

/**
 * Root Vitest configuration that orchestrates multiple test projects.
 *
 * Projects:
 * - storybook: Browser-based tests using Playwright
 * - unit: JSDOM-based unit tests
 * - build-validation: Tests that validate built package exports and types
 */
export default defineConfig({
  test: {
    projects: [
      // Storybook tests (browser-based)
      "./vitest.storybook.config.ts",
      // Unit tests (JSDOM-based)
      "./vitest.unit.config.ts",
      // Build validation tests (validates dist/ output)
      "./vitest.build-validation.config.ts",
    ],
  },
});
