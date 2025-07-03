import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { defineConfig } from "vite";
import type { LibraryFormats } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import { analyzer } from "vite-bundle-analyzer";

const __dirname = dirname(fileURLToPath(import.meta.url));

// External dependencies that should not be bundled.
// NOTE: Anything listed in the external array also needs to be listed as a peerDependency & devDependency in its corresponding package.json (exception: "react/jsx-runtime").

const external = [
  // React core
  "react",
  "react-dom",
  "react/jsx-runtime",

  // UI frameworks & styling.
  "@chakra-ui/react",
  // "react-aria",
  // "react-aria-components",
  // "react-stately",
  // "@emotion/is-prop-valid",

  // Utility libraries
  // "react-use",
  // "next-themes",

  // Internal packages
  "@commercetools/nimbus-icons",
  "@commercetools/nimbus-tokens",
];

export const baseConfig = {
  plugins: [
    viteTsconfigPaths(),
    react(),
    // https://react-spectrum.adobe.com/react-aria/internationalization.html#vite
    optimizeLocales.vite({
      locales: ["en-US", "fr-FR", "pt-BR", "es-ES", "de-DE"],
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: [
        resolve(__dirname, "./src/index.ts"),
        resolve(__dirname, "./src/test/setup-jsdom-polyfills.ts"),
      ],
      name: "nimbus",
      fileName: (format: string, entryName: string) =>
        // `cjs` files need to end in `.cjs` when `type: module` is set in package.json,
        // otherwise you get an error when you `require` them
        format === "cjs"
          ? `${entryName}.${format}`
          : `${entryName}.${format}.js`,

      formats: ["es", "cjs"] satisfies LibraryFormats[],
    },
    rollupOptions: {
      external,
    },
  },
  // Ensure CommonJS and ES modules are handled properly
  target: "esnext",
  assetsInclude: ["/sb-preview/runtime.js"],
};

export default defineConfig((/* config */) => {
  const isWatchMode = process.argv.includes("--watch");
  const isAnalyzeMode = !!process.env.ANALYZE_BUNDLE;

  const config = baseConfig;

  if (!isWatchMode) {
    config.plugins.push(dts({ rollupTypes: true }));
  }
  if (isAnalyzeMode) {
    config.plugins.push(analyzer());
  }
  return config;
});
