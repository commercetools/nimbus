import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "bleh-ui",
      fileName: "index",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
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
