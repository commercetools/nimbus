import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { UNSAFE_nimbusOptionalDependency } from "@commercetools/nimbus/plugins/vite";

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    // GitHub Pages serves from /nimbus/ subpath
    base: process.env.GITHUB_PAGES ? "/nimbus/petsmart-agentic-workflow/" : "/",
    plugins: [
      react(),
      UNSAFE_nimbusOptionalDependency(),
    ],
  };
});
