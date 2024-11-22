import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
});
