import { isNimbusResolvable } from "./is-nimbus-resolvable";

const NIMBUS_RUNTIME_RE = /^@commercetools\/nimbus(?:$|\/(?!plugins\/))/;
const STUB_ID = "\0nimbus-stub";

/**
 * Vite plugin that stubs `@commercetools/nimbus` imports when the package
 * is not resolvable from the consuming application. When Nimbus IS installed,
 * the plugin is a no-op.
 *
 * Uses Vite's `resolveId` and `load` hooks to redirect matching imports to a
 * virtual stub module — an empty default export that does not pull in the
 * Nimbus runtime.
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
  resolveId?: (source: string) => string | undefined;
  load?: (id: string) => string | undefined;
} {
  if (isNimbusResolvable()) {
    return { name: "nimbus-optional-dependency" };
  }

  return {
    name: "nimbus-optional-dependency",
    resolveId(source: string) {
      if (NIMBUS_RUNTIME_RE.test(source)) {
        return STUB_ID;
      }
      return undefined;
    },
    load(id: string) {
      if (id === STUB_ID) {
        return "export default {};";
      }
      return undefined;
    },
  };
}
