import { isNimbusResolvable } from "./is-nimbus-resolvable";
import { NIMBUS_RUNTIME_RE } from "./nimbus-runtime-re";
export { NIMBUS_RUNTIME_RE };

/**
 * Webpack plugin that stubs `@commercetools/nimbus` imports when the package
 * is not installed. No-op when Nimbus is present.
 *
 * UNSAFE: stubbed imports resolve to `undefined` at runtime. Code that uses
 * Nimbus components or functions must guard against `undefined` or it will
 * crash. The build succeeds either way — only runtime behavior differs.
 */
export class UNSAFE_NimbusOptionalDependencyPlugin {
  apply(compiler: {
    webpack: {
      NormalModuleReplacementPlugin: new (
        regex: RegExp,
        replacement: string
      ) => { apply: (compiler: unknown) => void };
    };
  }): void {
    if (isNimbusResolvable()) return;

    // Access via `compiler.webpack` instead of importing webpack directly,
    // so this plugin has zero dependencies and works with any webpack 5+ version.
    const { NormalModuleReplacementPlugin } = compiler.webpack;

    new NormalModuleReplacementPlugin(
      NIMBUS_RUNTIME_RE,
      "@commercetools/nimbus/plugins/stub"
    ).apply(compiler);
  }
}
