import { defineConfig } from "vite";
import { NIMBUS_RUNTIME_RE } from "@commercetools/nimbus/plugins/vite";

// Always-active version of UNSAFE_nimbusOptionalDependency that bypasses detection,
// so we can verify the stubbing path inside the monorepo where nimbus IS installed.
const STUB_ID = "\0nimbus-stub.cjs";

function nimbusStubPlugin() {
  return {
    name: "nimbus-stub-test",
    enforce: "pre",
    resolveId(source) {
      if (NIMBUS_RUNTIME_RE.test(source)) return STUB_ID;
    },
    load(id) {
      if (id === STUB_ID) return "module.exports = {};";
    },
  };
}

export default defineConfig({
  plugins: [nimbusStubPlugin()],
  build: {
    outDir: "dist-vite",
  },
});
