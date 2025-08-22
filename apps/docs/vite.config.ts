import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileSystemApiPlugin } from "./vite-plugins/vite-plugin-fs-api";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), fileSystemApiPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "lodash",
            "prism-react-renderer",
            "jotai",
            "react-json-tree",
            "react-live",
            "react-syntax-highlighter",
          ],
          react: ["react", "react-dom"],
          mdx: ["@mdx-js/mdx"],
          ui: ["@commercetools/nimbus"],
          icons: ["@commercetools/nimbus-icons"],
        },
      },
    },
  },
  server: {
    open: true,
  },
  define: {
    ["process.env.REPO_ROOT"]: JSON.stringify(path.resolve(__dirname, "../..")),
  },
});
