import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileSystemApiPlugin } from "./vite-plugins/vite-plugin-fs-api";
import { mdxHmrPlugin } from "./vite-plugins/vite-plugin-mdx-hmr";
import tsconfigPaths from "vite-tsconfig-paths";
import viteCompression from "vite-plugin-compression";
import path from "path";

/**
 * Extract route name from file ID for code splitting
 */
function extractRouteName(id: string): string {
  const match = id.match(/routes\/([^/]+)/);
  return match ? match[1] : "unknown";
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Compiler optimizations
      plugins: [],
    }),
    tsconfigPaths(),
    fileSystemApiPlugin(),
    mdxHmrPlugin(),
    // Gzip and Brotli compression
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
  ],
  build: {
    // Target modern browsers
    target: "es2020",
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Chunk size warning limit (KB)
    chunkSizeWarningLimit: 500,
    // Minification
    minify: "esbuild",
    // Sourcemaps for production debugging
    sourcemap: false,
    rollupOptions: {
      output: {
        // Advanced manual chunking strategy
        manualChunks: (id) => {
          // Route-based code splitting
          if (id.includes("/routes/") || id.includes("/data/routes/")) {
            return `route-${extractRouteName(id)}`;
          }

          // Framework chunks
          if (id.includes("node_modules")) {
            // React vendor chunk
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }

            // MDX runtime chunk
            if (id.includes("@mdx-js")) {
              return "mdx-runtime";
            }

            // Nimbus UI chunk
            if (id.includes("@commercetools/nimbus")) {
              return "nimbus-ui";
            }

            // Nimbus Icons chunk
            if (id.includes("@commercetools/nimbus-icons")) {
              return "nimbus-icons";
            }

            // Syntax highlighting chunk
            if (
              id.includes("prism-react-renderer") ||
              id.includes("react-syntax-highlighter")
            ) {
              return "syntax-highlighter";
            }

            // Live code editor chunk
            if (id.includes("react-live")) {
              return "live-editor";
            }

            // State management chunk
            if (id.includes("jotai")) {
              return "state-vendor";
            }

            // Search chunk
            if (id.includes("fuse.js")) {
              return "search-vendor";
            }

            // Utilities chunk
            if (id.includes("lodash")) {
              return "utils-vendor";
            }

            // All other vendor code
            return "vendor";
          }
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff2?|ttf|eot/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        // Chunk file naming
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
  },
  server: {
    open: true,
    // Enable HMR
    hmr: true,
  },
  // Optimize dependencies
  // NOTE: Do NOT add workspace packages here.
  // Workspace packages must be excluded from optimization to ensure changes
  // propagate immediately after rebuild without cache invalidation issues.
  optimizeDeps: {
    include: ["react", "react-dom", "jotai"],
  },
  define: {
    ["process.env.REPO_ROOT"]: JSON.stringify(path.resolve(__dirname, "../..")),
  },
});
