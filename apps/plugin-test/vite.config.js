import { defineConfig } from "vite";

// Uses the same regex and virtual-CJS-module mechanism as the real
// nimbusOptionalDependency plugin, but always activates (bypasses detection)
// so we can verify the stubbing path works inside the monorepo where nimbus
// IS installed.
const NIMBUS_RUNTIME_RE = /^@commercetools\/nimbus(?:$|\/(?!plugins(?:\/|$)))/;
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
