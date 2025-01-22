import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  build: {
    lib: {
      entry: resolve(__dirname, "./src/index.ts"),
      name: "BlehUI",
      // the proper extensions will be added
      fileName: "bleh-ui",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom", "@emotion/react", "@react-types/button"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@emotion/react": "emotionReact",
          "@react-types/button": "ReactTypesButton",
        },
      },
    },
  },
});
