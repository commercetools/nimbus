import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Unit + render tests in jsdom. SVG geometry stubs are in vitest.setup.ts.
export default defineConfig({
  plugins: [react()],
  test: {
    name: "nimbus-viz-unit",
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.spec.{ts,tsx}"],
    exclude: ["src/**/*.stories.{ts,tsx}", "node_modules", "dist"],
  },
});
