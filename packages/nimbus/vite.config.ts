import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { defineConfig } from "vite";
import type { LibraryFormats } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

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
  "@emotion/is-prop-valid",

  // Utility libraries
  "react-hotkeys-hook",
  "react-use",
  "next-themes",

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
      entry: resolve(__dirname, "./src/index.ts"),
      name: "nimbus",
      fileName: "index",
      formats: ["es", "umd"] satisfies LibraryFormats[],
    },
    rollupOptions: {
      external,
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",

          "@chakra-ui/react": "ChakraUI",
          "@emotion/is-prop-valid": "isPropValid",

          "next-themes": "NextThemes",
          "react-hotkeys-hook": "ReactHotkeysHook",
          "react-use": "ReactUse",

          "@commercetools/nimbus-icons": "NimbusIcons",
          "@commercetools/nimbus-tokens": "NimbusTokens",
        },
      },
    },
  },
  // Ensure CommonJS and ES modules are handled properly
  target: "esnext",
  assetsInclude: ["/sb-preview/runtime.js"],
};

export default defineConfig((/* config */) => {
  const isWatchMode = process.argv.includes("--watch");

  const config = baseConfig;

  if (!isWatchMode) {
    config.plugins.push(dts({ rollupTypes: true }));
  }

  return config;
});
