import { isNimbusResolvable } from "./is-nimbus-resolvable";
import { NIMBUS_RUNTIME_RE } from "./nimbus-runtime-re";

/**
 * Webpack plugin that stubs `@commercetools/nimbus` imports when the package
 * is not installed. No-op when Nimbus is present. Requires webpack 5+.
 *
 * @param options.cwd - Directory to resolve Nimbus from. Defaults to
 *   `process.cwd()`. Pass an explicit path in monorepo CI setups where the
 *   build runs from the repo root rather than the application directory.
 *
 * @param options.UNSAFE_forceStub - Forces the plugin to always stub Nimbus
 *    imports regardless of whether it's installed. This is useful for monorepos
 *    in which nimbus is installed in the repo root but a subpackage needs to
 *    stub nimbus at build-time, or for use in integration tests.
 *
 * UNSAFE: stubbed imports resolve to `undefined` at runtime. Code that uses
 * Nimbus components or functions must guard against `undefined` or it will
 * crash. The build succeeds either way — only runtime behavior differs.
 */
export class UNSAFE_NimbusOptionalDependencyPlugin {
  private cwd: string | undefined;
  private UNSAFE_forceStub: boolean | undefined;

  constructor(options?: { cwd?: string; UNSAFE_forceStub?: boolean }) {
    this.cwd = options?.cwd;
    this.UNSAFE_forceStub = options?.UNSAFE_forceStub;
  }

  apply(compiler: {
    webpack?: {
      NormalModuleReplacementPlugin: new (
        regex: RegExp,
        replacement: string
      ) => { apply: (compiler: unknown) => void };
    };
  }): void {
    if (!this.UNSAFE_forceStub && isNimbusResolvable(this.cwd)) return;

    if (!compiler.webpack) {
      throw new Error(
        "UNSAFE_NimbusOptionalDependencyPlugin requires webpack 5+. " +
          "compiler.webpack is undefined — are you using webpack 4 or older?"
      );
    }

    const { NormalModuleReplacementPlugin } = compiler.webpack;

    new NormalModuleReplacementPlugin(
      NIMBUS_RUNTIME_RE,
      "@commercetools/nimbus/plugins/stub"
    ).apply(compiler);
  }
}
