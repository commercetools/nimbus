import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "ts-plugin",
    include: ["src/**/*.spec.ts"],
  },
});
