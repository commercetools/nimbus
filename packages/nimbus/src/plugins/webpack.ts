import { isNimbusResolvable } from "./is-nimbus-resolvable";

const NIMBUS_RUNTIME_RE = /^@commercetools\/nimbus(?:$|\/(?!plugins\/))/;

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

    const { NormalModuleReplacementPlugin } = compiler.webpack;

    new NormalModuleReplacementPlugin(
      NIMBUS_RUNTIME_RE,
      "@commercetools/nimbus/plugins/stub"
    ).apply(compiler);
  }
}
