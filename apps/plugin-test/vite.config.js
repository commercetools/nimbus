import { defineConfig } from "vite";
import { UNSAFE_nimbusOptionalDependency } from "@commercetools/nimbus/plugins/vite";

export default defineConfig({
  plugins: [UNSAFE_nimbusOptionalDependency({ UNSAFE_forceStub: true })],
  build: {
    outDir: "dist-vite",
  },
});
