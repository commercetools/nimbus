/**
 * Isolated unit test config for files that use vi.mock().
 *
 * vi.mock() hoists and replaces modules in the shared cache, which
 * corrupts singletons (e.g. toast store) for subsequent test files
 * when isolate: false. These files run with default isolation.
 */
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
      name: "unit-isolated",
      environment: "jsdom",
      include: ["src/components/toast/toast.spec.ts", "src/plugins/*.spec.ts"],
      globals: true,
      setupFiles: ["./src/test/unit-test-setup.ts"],
    },
  };

  return mergeConfig(baseConfig, overrides);
});
