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
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        exclude: ["src/**/*.stories.{ts,tsx}", "node_modules", "dist"],
        globals: true,
        setupFiles: ["./src/test/unit-test-setup.ts"],
      },
    })
  );
});
