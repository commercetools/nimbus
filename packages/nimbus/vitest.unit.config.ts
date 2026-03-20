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
        name: "unit",
        // Unit tests use JSDOM instead of real browser
        environment: "jsdom",
        // Standard test file patterns
        include: ["src/**/*.spec.{ts,tsx}"],
        exclude: [
          "src/**/*.stories.{ts,tsx}",
          // Files using vi.mock() must run isolated to avoid polluting
          // the shared module cache (see vitest.unit-isolated.config.ts)
          "src/components/toast/toast.spec.tsx",
          "node_modules",
          "dist",
        ],
        globals: true,
        setupFiles: ["./src/test/unit-test-setup.ts"],
        // Reuse module cache across test files to reduce import overhead
        isolate: false,
      },
    })
  );
});
