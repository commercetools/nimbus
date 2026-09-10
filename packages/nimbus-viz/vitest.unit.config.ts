import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Fast unit + render tests against SOURCE in jsdom — pure functions, hooks, and
// the render `.spec.tsx` files. Component behavior tests move to Storybook play
// functions (the browser project) over time; the split mirrors packages/nimbus
// (jsdom `unit` project + browser `storybook` project). Charts take explicit
// width/height props, so no layout measurement is needed — only a couple of
// SVG geometry stubs jsdom doesn't implement (see vitest.setup.ts).
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
