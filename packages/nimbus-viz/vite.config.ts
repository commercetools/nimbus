import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, type LibraryFormats, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// Single-entry library build. vite-plugin-dts emits declarations per source
// file (a per-entry rollup over all charts exhausts the heap).

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

// Externalize every runtime dependency and peer (React, visx, d3) plus their
// subpaths, and Node built-ins, so they stay out of the bundle.
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
  // Only emit declarations for a real build, not when the Vitest projects
  // reuse this config as their base.
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
