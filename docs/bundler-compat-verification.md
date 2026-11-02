# Bundler Compatibility Verification

Nimbus runs a check on every CI build that validates the **bundled code** in the
`@commercetools/nimbus` dist, as a consumer's bundler sees it. It complements
[Package Shape Verification](./package-shape-verification.md), which checks
types and `package.json` but does not read the code inside `dist/`.

It catches two classes of bugs that only show up when a consumer bundles Nimbus:

- **Imports webpack cannot resolve statically.** Nimbus 3.7.0 shipped a chunk
  that read `i["module.exports"]` from `import * as i from "react"`. Merchant
  Center applications build with `mc-scripts`, which sets
  `strictExportPresence: true`, and their builds failed with
  `export 'module.exports' (imported as 'i') was not found in 'react'`.
- **Rolldown's runtime `require` helper.** When bundled CJS code calls
  `require()` for an external module (such as `react`), Rolldown adds a helper
  that throws in browsers: "Calling `require` for ... in an environment that
  doesn't expose the `require` function". See #1451.

## Quick Reference

```bash
# Run the check (CI runs this same command)
pnpm check:bundler-compat
```

Requires the nimbus package to be built first (`packages/nimbus/dist/` must
exist).

## How It Works

1. Bundles the public runtime entry points `@commercetools/nimbus` and
   `@commercetools/nimbus/theme` with webpack 5 (Node API), resolved by package
   name through the `exports` map, like a consumer app. The config matches
   `mc-scripts` where it matters: `mode: "production"`, `target: "web"` and
   `module.strictExportPresence: true`. Errors **and** warnings fail the check,
   because `mc-scripts` treats warnings as errors when `CI` is set.
2. Scans every `*.es.js` and `*.esm.js` file in `packages/nimbus/dist/` for
   Rolldown's `require` helper and reports `file:line` for each match. The
   helper's name is shortened in the output, so the scan matches its error
   message (``doesn't expose the `require` function``), which Rolldown keeps
   verbatim. It also matches `__require(`, the helper's unshortened name. If
   `dist/chunks/` has no file with either extension, the scan fails: the chunk
   naming changed, and `ESM_FILE` in the script needs updating.
3. Prints a summary and exits non-zero on any finding.

The webpack build takes a few seconds. Its output goes to a temporary directory
that is removed afterwards.

## When To Run It

The check runs automatically in CI on every PR. Run it locally before pushing
when:

- You upgrade Vite or Rolldown, or change `packages/nimbus/vite.config.ts`
  (externals, aliases, plugins)
- You add or upgrade a dependency that Nimbus bundles, especially one that ships
  CJS
- You change which modules are external

## CI Integration

The check runs in the `build-and-test` workflow
(`.github/workflows/build-and-test.yml`) immediately after the Check package
shape step:

```yaml
- name: Check bundler compatibility
  run: pnpm check:bundler-compat
```

No additional services or secrets. `webpack` is a root devDependency from the
`tooling` catalog.

## Common Scenarios

### Your PR Fails the Strict Webpack Consumer Build

1. Read the webpack error. It names the dist chunk and the import, for example
   `ERROR in ./packages/nimbus/dist/chunks/<Chunk>-<hash>.es.js`.
2. Find the source of that code: the chunk's `.map` file lists the bundled
   modules in `sources`. Look for CJS files (`/cjs/`, `module.exports`) and for
   `builtin:` virtual modules.
3. Fix the bundle, not the check. Prefer removing the CJS code from the bundle
   (an alias to an ESM equivalent, or externalizing the dependency) over
   rewriting generated code.

### Your PR Fails the Require Helper Scan

1. Open the reported `file:line`. It is usually the shared
   `chunks/rolldown-runtime-*.es.js` chunk.
2. Find the chunks that import the helper from that runtime chunk and call it
   with a module name, such as `e("react")`. The `.map` file of each chunk names
   the bundled CJS module that makes the call.
3. Remove that CJS code from the bundle, as above. Nimbus requires React 19, so
   React polyfills (for example `use-sync-external-store/shim`) can be aliased
   to `react` in `packages/nimbus/vite.config.ts`.

## Related Files

- `scripts/check-bundler-compat.mjs` — The check script.
- `packages/nimbus/vite.config.ts` — Library build config: externals and the
  `use-sync-external-store/shim` alias.
- `.github/workflows/build-and-test.yml` — CI step.
- `docs/package-shape-verification.md` — Sibling check for types and
  `package.json`.
