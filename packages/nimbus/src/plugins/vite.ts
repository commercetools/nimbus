import type { Plugin } from "vite";
import { isNimbusResolvable } from "./is-nimbus-resolvable";
import { NIMBUS_RUNTIME_RE } from "./nimbus-runtime-re";
// The `.cjs` extension is load-bearing: it tells Rolldown to treat the virtual
// module as CJS, which allows any named import to resolve to `undefined` via
// CJS-to-ESM interop instead of failing with MISSING_EXPORT.
const STUB_ID = "\0nimbus-stub.cjs";

/**
 * Vite plugin that stubs `@commercetools/nimbus` imports when the package is
 * not installed. No-op when Nimbus is present.
 *
 * @param options.cwd - Directory to resolve Nimbus from. Defaults to
 *   `process.cwd()`. Pass an explicit path in monorepo CI setups where the
 *   build runs from the repo root rather than the application directory.
 *
 * @param options.UNSAFE_forceStub - Forces the plugin to always stub Nimbus
 *    imports regardless whether it's installed. This is useful for monorepos
 *    in which nimbus is installed in the repo root but a subpackage needs to
 *    stub nimbus at build-time, or for use in integration tests.
 *
 * UNSAFE: stubbed imports resolve to `undefined` at runtime. Code that uses
 * Nimbus components or functions must guard against `undefined` or it will
 * crash. The build succeeds either way — only runtime behavior differs.
 */
export function UNSAFE_nimbusOptionalDependency(options?: {
  cwd?: string;
  UNSAFE_forceStub?: boolean;
}): Plugin {
  if (!options?.UNSAFE_forceStub && isNimbusResolvable(options?.cwd)) {
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
