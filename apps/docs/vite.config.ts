import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileSystemApiPlugin } from "./vite-plugins/vite-plugin-fs-api";
import { imageUploadMiddleware } from "./vite-plugins/vite-plugin-file-uploader";
import { viteAiMiddleware } from "./vite-plugins/vite-plugin-ai-api";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    fileSystemApiPlugin(),
    imageUploadMiddleware(),
    viteAiMiddleware(),
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
            "@ariakit/react",
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
