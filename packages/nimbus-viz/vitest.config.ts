import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Unit + render tests run against the SOURCE in jsdom. Charts take explicit
// width/height props, so no layout measurement is needed — only a couple of
// SVG geometry stubs jsdom doesn't implement (see vitest.setup.ts).
export default defineConfig({
  plugins: [react()],
  test: {
    name: "nimbus-viz",
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.spec.{ts,tsx}"],
  },
});
