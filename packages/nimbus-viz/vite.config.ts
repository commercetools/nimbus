import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";

// Dev-only gallery for eyeballing prototype charts. Not part of the published
// build (tsup builds src/index.ts). Resolves the library from ./src directly.
export default defineConfig({
  root: "gallery",
  plugins: [react()],
  server: {
    port: 5199,
    fs: { allow: [searchForWorkspaceRoot(process.cwd())] },
  },
});
