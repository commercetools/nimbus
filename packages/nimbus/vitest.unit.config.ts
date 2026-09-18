import { defineConfig, mergeConfig, type ViteUserConfig } from "vitest/config";
import createBaseConfig from "./vite.config.ts";

export default defineConfig(async () => {
  const baseConfig = await createBaseConfig({
    command: "build",
    mode: "production",
  });

  // Typed explicitly (instead of wrapping in `defineConfig(...)`) so
  // `mergeConfig`'s overload resolution isn't fed the ambiguous
  // union/function-inclusive return type `defineConfig()` produces here —
  // see https://github.com/vuejs/create-vue/issues/328 for the same
  // TS2345 "not assignable to parameter of type 'never'" pattern. Kept in
  // sync with vitest.storybook.config.ts / vitest.storybookdev.config.ts for
  // consistency, even though this file's shape doesn't currently trigger it.
  const overrides: ViteUserConfig = {
    test: {
      name: "unit",
      // Unit tests use JSDOM instead of real browser
      environment: "jsdom",
      // Standard test file patterns
      include: ["src/**/*.spec.{ts,tsx}"],
      exclude: [
        "src/**/*.stories.{ts,tsx}",
        // Files using vi.mock() must run isolated to avoid polluting
        // the shared module cache (see vitest.unit-isolated.config.ts)
        "src/components/toast/toast.spec.ts",
        "src/plugins/*.spec.ts",
        "node_modules",
        "dist",
      ],
      globals: true,
      setupFiles: ["./src/test/unit-test-setup.ts"],
      // Reuse module cache across test files to reduce import overhead
      isolate: false,
    },
  };

  return mergeConfig(baseConfig, overrides);
});
