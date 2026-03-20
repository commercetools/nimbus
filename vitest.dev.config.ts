import { defineConfig } from "vitest/config";

/**
 * Root Vitest configuration for local development.
 *
 * Same as vitest.config.ts but uses the storybook-dev project
 * (source files) instead of the storybook project (built bundle).
 */
export default defineConfig({
  test: {
    projects: [
      "./packages/nimbus/vitest.storybookdev.config.ts",
      "./packages/nimbus/vitest.unit.config.ts",
      "./packages/nimbus/vitest.unit-isolated.config.ts",
      "./packages/design-token-ts-plugin/vitest.config.ts",
      "./packages/nimbus-mcp/vitest.config.ts",
      "./vitest.scripts.config.ts",
    ],
  },
});
