import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "scripts",
    include: ["scripts/**/*.spec.{ts,mjs}"],
  },
});
