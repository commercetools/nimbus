import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileSystemApiPlugin } from "./scripts/vite-plugins/vite-plugin-fs-api";
import { imageUploadMiddleware } from "./scripts/vite-plugins/vite-plugin-file-uploader";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    fileSystemApiPlugin(),
    imageUploadMiddleware(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "lodash",
            "prism-react-renderer",
            "refractor",
            "jotai",
            "react-json-tree",
            "react-live",
            "react-syntax-highlighter",
          ],
          react: ["react", "react-dom"],
          mdx: ["mdx", "@mdx-js/mdx", "@mdx-js/react"],
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
