import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, type LibraryFormats, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// Library build for @commercetools/nimbus-viz. Mirrors the tool choice of
// packages/nimbus (Vite + vite-plugin-dts) but stays intentionally small:
// viz imports nothing from @commercetools/nimbus at runtime, so none of
// nimbus's Chakra typegen, plugin subpath entries, slate/markdown handling,
// React-Aria locale optimization, or multi-entry glob applies here.
//
// **Single barrel entry.** A per-chart multi-entry build was tried under tsup
// and the 47-entry DTS rollup exhausted an 8GB heap. vite-plugin-dts emits
// per source file (not a per-entry rollup), so it is memory-safe and preserves
// the exported generics (BarChart<T>, ScatterPlot<T>). We keep the single
// public entry regardless.

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

// Externalize every runtime dependency and peer (React, react-dom, all
// @visx/*, all d3-*) plus their subpaths, and Node built-ins. This reproduces
// tsup's default, which auto-externalizes `dependencies`. If visx/d3 were
// bundled instead, dist would grow by their whole weight and the relative-5%
// bundle-size gate (viz is in the tracked list) would fail.
const externalNames = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];
const external = [
  /^node:/,
  ...externalNames.map(
    (name) =>
      new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\/.*)?$`)
  ),
];

export default defineConfig(async (): Promise<UserConfig> => {
  const isWatch = process.argv.includes("--watch");
  // vite.config.ts is also imported as the base for the Vitest unit and
  // Storybook configs. Emitting declarations there is pure waste and would try
  // to walk story files, so only attach the dts plugin for a real lib build.
  const isTest = !!process.env.VITEST;

  const config: UserConfig = {
    plugins: [
      react(),
      ...(isWatch || isTest
        ? []
        : [
            dts({
              include: ["src/**/*.ts", "src/**/*.tsx"],
              exclude: [
                "src/**/*.spec.*",
                "src/**/*.stories.*",
                "src/stories/**",
              ],
            }),
          ]),
    ],
    build: {
      sourcemap: true,
      lib: {
        entry: fileURLToPath(new URL("src/index.ts", import.meta.url)),
        formats: ["es", "cjs"] satisfies LibraryFormats[],
        // Keep the exact filenames package.json `exports` already point at:
        // dist/index.js (ESM) and dist/index.cjs (CJS).
        fileName: (format) => (format === "cjs" ? "index.cjs" : "index.js"),
      },
      rollupOptions: { external },
    },
  };

  return config;
});
