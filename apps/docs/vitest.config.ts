import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      name: "docs-unit",
      // Unit tests use JSDOM for DOM simulation
      environment: "jsdom",
      // Test file patterns
      include: [
        "src/__tests__/unit/**/*.spec.{ts,tsx}",
        "src/__tests__/integration/**/*.spec.{ts,tsx}",
      ],
      exclude: ["src/__tests__/e2e/**/*", "node_modules", "dist", "build"],
      // Enable global test APIs (describe, it, expect, etc.)
      globals: true,
      // Setup files run before tests
      setupFiles: ["./src/test/unit-test-setup.ts"],
      // Coverage configuration
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "src/**/*.spec.{ts,tsx}",
          "src/**/*.e2e.spec.{ts,tsx}",
          "src/**/*.stories.{ts,tsx}",
          "src/test/**",
          "src/vite-env.d.ts",
          "src/main.tsx",
        ],
        // Coverage thresholds
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  })
);
