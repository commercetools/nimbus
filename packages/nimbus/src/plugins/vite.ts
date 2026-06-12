import { isNimbusResolvable } from "./is-nimbus-resolvable";
import { NIMBUS_RUNTIME_RE } from "./nimbus-runtime-re";
export { NIMBUS_RUNTIME_RE };
// The `.cjs` extension is load-bearing: it tells Rolldown to treat the virtual
// module as CJS, which allows any named import to resolve to `undefined` via
// CJS-to-ESM interop instead of failing with MISSING_EXPORT.
const STUB_ID = "\0nimbus-stub.cjs";

/**
 * Vite plugin that stubs `@commercetools/nimbus` imports when the package is
 * not installed. No-op when Nimbus is present.
 *
 * UNSAFE: stubbed imports resolve to `undefined` at runtime. Code that uses
 * Nimbus components or functions must guard against `undefined` or it will
 * crash. The build succeeds either way — only runtime behavior differs.
 */
export function UNSAFE_nimbusOptionalDependency(): {
  name: string;
  enforce?: "pre";
  resolveId?: (source: string) => string | undefined;
  load?: (id: string) => string | undefined;
} {
  if (isNimbusResolvable()) {
    return { name: "nimbus-optional-dependency" };
  }

  return {
    name: "nimbus-optional-dependency",
    // Must run before Vite's default resolver, which follows workspace
    // symlinks and would resolve nimbus even when the app hasn't installed it.
    enforce: "pre",
    resolveId(source: string) {
      if (NIMBUS_RUNTIME_RE.test(source)) {
        return STUB_ID;
      }
      return undefined;
    },
    load(id: string) {
      if (id === STUB_ID) {
        return "module.exports = {};";
      }
      return undefined;
    },
  };
}
