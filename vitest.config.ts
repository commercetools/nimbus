import { defineConfig } from "vitest/config";

/**
 * Root Vitest configuration for the monorepo.
 *
 * Uses explicit project references instead of glob patterns to ensure
 * proper path alias resolution and configuration loading.
 */
export default defineConfig({
  test: {
    projects: [
      "./packages/nimbus/vitest.storybook.config.ts",
      "./packages/nimbus/vitest.unit.config.ts",
      "./packages/design-token-ts-plugin/vitest.config.ts",
    ],
  },
});
