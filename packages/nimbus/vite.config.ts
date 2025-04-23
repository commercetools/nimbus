import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Add all external dependencies that should not be bundled
const external = [
  // React core
  "react",
  "react-dom",
  "react/jsx-runtime",

  // React Aria ecosystem
  // "react-aria",
  // "react-aria-components",
  // "react-stately/*",
  // "@react-aria/*",

  // UI frameworks & styling
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
    cssCodeSplit: true, // Wrkbetter CSS processing
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "nimbus",
      fileName: "index",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // Externalized deps that shouldn't be bundled into your library
      external,
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",

          // React Aria ecosystem
          "react-aria-components": "ReactAriaComponents",
          "react-aria": "ReactAria",
          "@react-aria/utils": "ReactAriaUtils",
          "@react-aria/autocomplete": "ReactAriaAutocomplete",
          "@react-aria/overlays": "ReactAriaOverlays",
          "@react-aria/focus": "ReactAriaFocus",
          "@react-aria/interactions": "ReactAriaInteractions",
          "react-stately": "ReactStately",

          // UI frameworks & styling
          "@chakra-ui/react": "ChakraUI",
          "@emotion/is-prop-valid": "isPropValid",

          // Utility libraries
          "next-themes": "NextThemes",
          "react-hotkeys-hook": "ReactHotkeysHook",
          "react-use": "ReactUse",

          // Internal packages
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
