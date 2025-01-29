import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig((/* config */) => {
  const isWatchMode = process.argv.includes("--watch");

  const plugins = [react(), viteTsconfigPaths()];

  if (!isWatchMode) {
    plugins.push(dts({ rollupTypes: true }));
  }

  return {
    plugins,
    test: {
      // make vitest fn's available globally (no need to import them)
      globals: true,
      // config for running tests in one or multiple *real* browsers
      browser: {
        enabled: true,
        // ... use playwright to run tests
        provider: "playwright",
        // ... only in chromium
        instances: [{ browser: "chromium" }],
        // ... do not open the browser-ui
        headless: true,
        // ... do not capture screenshots on failure
        screenshotFailures: false,
      },
    },
    build: {
      lib: {
        entry: resolve(__dirname, "./src/index.ts"),
        name: "bleh-ui",
        fileName: "index",
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["react", "react-dom", "@emotion/react"],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "@emotion/react": "emotionReact",
          },
        },
      },
    },
  };
});
