import { isNimbusResolvable } from "./is-nimbus-resolvable";

// Matches `@commercetools/nimbus` and any subpath EXCEPT `/plugins` and `/plugins/*`,
// which must remain resolvable to avoid circular stubbing.
const NIMBUS_RUNTIME_RE = /^@commercetools\/nimbus(?:$|\/(?!plugins(?:\/|$)))/;
// The `.cjs` extension is load-bearing: it tells Rolldown to treat the virtual
// module as CJS, which allows any named import to resolve to `undefined` via
// CJS-to-ESM interop instead of failing with MISSING_EXPORT.
const STUB_ID = "\0nimbus-stub.cjs";

/**
 * Vite plugin that stubs `@commercetools/nimbus` imports when the package
 * is not resolvable from the consuming application. When Nimbus IS installed,
 * the plugin is a no-op.
 *
 * Uses Vite's `resolveId` and `load` hooks to redirect matching imports to a
 * virtual CJS stub module — an empty `module.exports` that does not pull in
 * the Nimbus runtime. Named imports resolve to `undefined` at runtime.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { nimbusOptionalDependency } from '@commercetools/nimbus/plugins/vite';
 *
 * export default defineConfig({
 *   plugins: [nimbusOptionalDependency()],
 * });
 * ```
 */
export function nimbusOptionalDependency(): {
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
