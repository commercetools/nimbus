import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileSystemApiPlugin } from "./vite-plugins/vite-plugin-fs-api";
import { imageUploadMiddleware } from "./vite-plugins/vite-plugin-file-uploader";
import tsconfigPaths from "vite-tsconfig-paths";

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
            "react",
            "react-dom",
            "lodash",
            "lodash-es",
            "sucrase",
            "prism-react-renderer",
            "acorn",
            "refractor",
            "jotai",
            "@ariakit/react",
            "mdx",
            "@mdx-js/mdx",
            "@mdx-js/react",
            "react-json-tree",
            "react-live",
            "react-syntax-highlighter",
          ],
          ui: ["@bleh-ui/react"],
          icons: ["@bleh-ui/icons"],
        },
      },
    },
  },
  server: {
    open: true,
  },
});
