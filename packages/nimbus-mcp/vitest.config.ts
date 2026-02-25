import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "nimbus-mcp",
    include: ["src/**/*.spec.ts"],
    environment: "node",
  },
});
