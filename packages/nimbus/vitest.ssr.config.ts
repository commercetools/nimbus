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
        name: "ssr",
        environment: "node",
        include: ["src/**/*.ssr.spec.{ts,tsx}"],
        globals: true,
      },
    })
  );
});
