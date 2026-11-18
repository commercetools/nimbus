import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "color-tokens",
    include: ["**/*.spec.ts"],
    exclude: ["**/node_modules/**", "dist/**"],
  },
});
