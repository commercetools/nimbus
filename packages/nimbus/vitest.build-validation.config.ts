/**
 * Vitest Configuration for Build Validation Tests
 *
 * This configuration runs tests that import from the built package
 * (@commercetools/nimbus) to validate exports and types.
 *
 * IMPORTANT: These tests MUST run AFTER the build step.
 * Run with: pnpm test:build-validation
 *
 * These tests catch build issues like:
 * - Missing component exports in dist/index.js
 * - Missing type exports in dist/index.d.ts
 * - Incorrect module resolution
 */

import { defineConfig, mergeConfig } from "vitest/config";
import createBaseConfig from "./vite.config";

export default defineConfig(async () => {
  const baseConfig = await createBaseConfig({
    command: "build",
    mode: "production",
  });

  return mergeConfig(
    baseConfig,
    defineConfig({
      test: {
        name: "build-validation",
        environment: "jsdom",
        // Only include build validation test files
        include: ["src/**/*.build-validation.spec.{ts,tsx}"],
        // Exclude story tests and node_modules (but not regular spec files, as they won't match include anyway)
        exclude: ["src/**/*.stories.{ts,tsx}", "node_modules"],
        globals: true,
        // Setup file for JSDOM polyfills
        setupFiles: ["./src/test/unit-test-setup.ts"],
      },
    })
  );
});
