import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "nimbus-docs-build",
    include: ["src/**/*.spec.ts"],
    environment: "node",
  },
});
