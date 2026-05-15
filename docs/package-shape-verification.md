# Package Shape Verification

Nimbus runs a check on every CI build that validates the **published shape** of
each publishable package — not the workspace-linked source. It packs each
package the same way npm would, then runs two industry-standard linters against
the resulting tarball.

This is the safety net for toolchain changes (bundler swaps, `vite.config.ts`
edits, dependency upgrades, `package.json` `exports` map edits). It catches the
class of bugs that workspace symlinks hide: CJS/ESM interop breakage, missing
`exports` subpaths, types that don't match the runtime shape, and Node ESM
resolution errors.

## Quick Reference

```bash
# Run the check (CI runs this same command)
pnpm check:package-shape
```

Requires the target packages to be built first
(`pnpm build:tokens && pnpm build:packages && pnpm build:mcp`).

## How It Works

The script (`scripts/check-package-shape.mjs`) does the following for each
target package:

1. Runs `pnpm pack --json` to produce a tarball identical to what npm would
   publish.
2. Runs **`@arethetypeswrong/cli` (attw)** against the tarball — validates that
   TypeScript types resolve correctly across every module-resolution mode a
   consumer might use.
3. Runs **`publint`** against the tarball — validates `package.json` against the
   npm spec.
4. Cleans up the tarball.
5. Exits with code 1 if any package fails either check.

A `REPORT_ONLY` constant at the top of the script can be flipped to `true` to
surface findings without failing CI — useful if you need to land a change with
known issues to triage separately.

## What Gets Tracked

The check mirrors the `fixed` group in `.changeset/config.json` — every package
the changeset bot ships in a release. Four of the five are linted:

- **`@commercetools/nimbus`** — Core component library.
- **`@commercetools/nimbus-icons`** — SVG icons as React components.
- **`@commercetools/nimbus-design-token-ts-plugin`** — TypeScript language
  service plugin.
- **`@commercetools/nimbus-mcp`** — MCP server.

**Excluded (temporarily):** `@commercetools/nimbus-tokens` is currently excluded
because the published tarball has pre-existing shape issues (preconstruct emits
`.cjs.js` under a `"type": "module"` package, breaking CJS resolution at
runtime; the `exports` map has no `types` condition). Tracked in
[#1509](https://github.com/commercetools/nimbus/issues/1509) — once that lands,
the package gets re-added to `PACKAGES`.

To add or remove a tracked package, edit the `PACKAGES` array at the top of
`scripts/check-package-shape.mjs`.

## The Tools

### `@arethetypeswrong/cli` (attw)

Validates that TypeScript types resolve correctly under every module-resolution
mode a consumer might realistically use:

- **`node10`** — Legacy TS/bundler resolution; Jest defaults.
- **`node16` from CJS** — Modern Node when the consumer is CJS (Jest in JSDOM,
  classic Next.js pages dir).
- **`node16` from ESM** — Modern Node when the consumer is ESM (Next.js app
  router server components, Remix loaders, Node 22+ scripts with
  `"type": "module"`).
- **`bundler`** — Vite, Webpack 5, esbuild, Rspack (the realistic majority of
  consumers).

attw walks the `exports` map, traces every entry point, and flags any mode where
types are missing, malformed, or describe a different shape than the runtime
actually exports.

### `publint`

Validates `package.json` correctness against the npm spec. It catches things the
spec says are wrong but the npm CLI doesn't enforce:

- Missing files referenced by `exports`
- Inconsistent `import`/`require` conditions
- `.js` files described as ESM but interpreted as CJS (and vice versa)
- Deprecated fields
- Wrong extensions for the declared `"type"`

Output is tiered — errors fail the check, warnings fail strict mode, suggestions
are informational only.

Both tools run against the same tarball `pnpm pack` produces, which is exactly
what npm would publish.

## When To Run It

The check runs automatically in CI on every PR. Run it locally before pushing
when:

- You upgrade the bundler (Vite, Rollup, tsup, etc.) or change `vite.config.ts`
- You edit a publishable package's `package.json` — especially `exports`,
  `main`, `module`, `types`, or `type`
- You add or rename a publishable entry point (e.g. a new subpath export)
- You bump a major dependency that touches the type graph (`@react-aria/*`,
  `@chakra-ui/react`, etc.)
- You change the postbuild scripts (`packages/*/scripts/postbuild*.mjs`) or the
  shared rewriter (`scripts/lib/rewrite-relative-imports.mjs`)

## CI Integration

The check runs in the `build-and-test` workflow
(`.github/workflows/build-and-test.yml`) immediately after the Typecheck step:

```yaml
- name: Check package shape
  run: pnpm check:package-shape
```

No additional services or secrets — just `pnpm pack`, `attw`, and `publint`.

## Common Scenarios

### Your PR Fails the Package Shape Check

1. Look at the CI output. Each finding is annotated with the package and tool
   that produced it.
2. attw failures usually point to one of:
   - A new subpath in `exports` that lacks a `types` condition.
   - A `require.types` pointing at an `.d.ts` file that TypeScript will treat as
     ESM (needs to be `.d.cts`).
   - A bare relative import inside an emitted `.d.ts` (rejected by `node16` ESM
     resolution).
3. publint failures usually point to one of:
   - A file referenced by `exports` that wasn't emitted to `dist/`.
   - An `import` condition pointing at a `.cjs` file or vice versa.
   - A `"type"` mismatch between root `package.json` and a nested directory's
     marker `package.json`.
4. Reproduce locally with
   `pnpm build:tokens && pnpm build:packages && pnpm build:mcp && pnpm check:package-shape`.
5. Fix the package shape, not the check. The check is intentionally strict — if
   it's flagging something, real consumers will hit it.

### You Need To Land Something Despite Known Findings

Flip `REPORT_ONLY = true` at the top of `scripts/check-package-shape.mjs`.
Findings will still print but the check exits 0. **Flip it back to `false` in
the same PR or open a follow-up issue immediately** — leaving it on defeats the
purpose of the gate.

## Related Files

- `scripts/check-package-shape.mjs` — The check script.
- `scripts/lib/rewrite-relative-imports.mjs` — Shared helper used by package
  postbuild scripts to add `.js` extensions to bare relative imports (fixes the
  `node16` ESM resolution error that attw flags).
- `packages/nimbus/scripts/postbuild-types.mjs` — Relocates polyfills `.d.ts`,
  rewrites imports, duplicates `.d.ts` → `.d.cts` for CJS consumers.
- `packages/nimbus-icons/scripts/postbuild.mjs` — Writes dual-package marker
  `package.json` files, rewrites imports in `dist/esm/`.
