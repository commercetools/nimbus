import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { UNSAFE_nimbusOptionalDependency } from "@commercetools/nimbus/plugins/vite";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.PAGES_BASE ?? "/",
  plugins: [react(), UNSAFE_nimbusOptionalDependency()],
});
