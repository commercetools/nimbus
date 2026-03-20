/**
 * Isolated unit test config for files that use vi.mock().
 *
 * vi.mock() hoists and replaces modules in the shared cache, which
 * corrupts singletons (e.g. toast store) for subsequent test files
 * when isolate: false. These files run with default isolation.
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
        name: "unit-isolated",
        environment: "jsdom",
        include: ["src/components/toast/toast.spec.tsx"],
        globals: true,
        setupFiles: ["./src/test/unit-test-setup.ts"],
      },
    })
  );
});
