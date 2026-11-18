import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "scripts",
    include: [
      "scripts/**/*.spec.{ts,mjs}",
      "apps/docs/src/**/*.spec.ts",
      "packages/nimbus-docs-build/src/**/*.spec.ts",
      ".claude/skills/**/*.spec.ts",
      ".github/actions/**/*.spec.{ts,mjs}",
    ],
  },
});
