import { createRequire } from "node:module";

/**
 * Checks whether `@commercetools/nimbus` is resolvable from the consuming
 * application's working directory. Used by the bundler plugins to decide
 * whether to stub out Nimbus imports at build time.
 */
export function isNimbusResolvable(): boolean {
  try {
    const require = createRequire(import.meta.url);
    require.resolve("@commercetools/nimbus", { paths: [process.cwd()] });
    return true;
  } catch {
    return false;
  }
}
