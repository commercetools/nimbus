import { isNimbusResolvable } from "./is-nimbus-resolvable";

// Matches `@commercetools/nimbus` and any subpath EXCEPT `/plugins` and `/plugins/*`,
// which must remain resolvable to avoid circular stubbing.
const NIMBUS_RUNTIME_RE = /^@commercetools\/nimbus(?:$|\/(?!plugins(?:\/|$)))/;

/**
 * Webpack plugin that stubs `@commercetools/nimbus` imports when the package
 * is not resolvable from the consuming application. When Nimbus IS installed,
 * the plugin is a no-op.
 *
 * Uses webpack's built-in `NormalModuleReplacementPlugin` to redirect matching
 * imports to `@commercetools/nimbus/plugins/stub` — an empty module that ships
 * alongside this plugin and does not pull in the Nimbus runtime.
 *
 * @example
 * ```js
 * // webpack.config.js
 * const { NimbusOptionalDependencyPlugin } = require('@commercetools/nimbus/plugins/webpack');
 *
 * module.exports = {
 *   plugins: [new NimbusOptionalDependencyPlugin()],
 * };
 * ```
 */
export class NimbusOptionalDependencyPlugin {
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
