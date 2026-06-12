import { createRequire } from "node:module";

/**
 * Checks whether `@commercetools/nimbus` is resolvable from the consuming
 * application's working directory. Used by the bundler plugins to decide
 * whether to stub out Nimbus imports at build time.
 *
 * Uses `process.cwd()` as the `createRequire` base instead of
 * `import.meta.url` because Rolldown's CJS output transpiles
 * `import.meta.url` to `{}.url` (undefined), which breaks `createRequire`.
 */
export function isNimbusResolvable(): boolean {
  try {
    const cwd = process.cwd();
    // `paths: [cwd]` resolves from the app root, not from this plugin's
    // location — so the check reflects what the app being built has installed.
    // The noop.js filename is arbitrary; createRequire just needs a valid path.
    createRequire(cwd + "/noop.js").resolve("@commercetools/nimbus", {
      paths: [cwd],
    });
    return true;
  } catch {
    return false;
  }
}
