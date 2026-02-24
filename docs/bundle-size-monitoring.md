# Bundle Size Monitoring

Nimbus includes a lightweight bundle size check that runs in CI. It measures the
minified (not gzipped) size of each published package's output and compares
against a baseline committed to the repo (`bundle-sizes.json`). If any package
grows beyond a 5% threshold the CI job fails, preventing accidental size
regressions from being merged.

## Quick Reference

```bash
# Check sizes against baseline (what CI runs)
pnpm check:bundle-size

# Update the baseline after an intentional size change
node scripts/update-bundle-sizes.mjs
```

## How It Works

The script (`scripts/check-bundle-size.mjs`) does the following:

1. Measures minified output sizes for each tracked package, broken down by
   format (ESM and CJS).
2. Fetches `bundle-sizes.json` from the `main` branch via `git show` as the
   baseline (falls back to local file if main has no baseline yet).
3. Compares each package/format — if any exceeds the 5% threshold, it checks
   whether the PR's local `bundle-sizes.json` has been updated to match the
   current sizes (the "approval" mechanism).
4. Prints a table with current size, baseline size, percentage delta, and
   status.
5. Exits with code 1 if any entry exceeds the threshold without approval.

## Threshold

| Increase | Effect            |
| -------- | ----------------- |
| 0 – 5%   | OK, no action     |
| > 5%     | CI fails (exit 1) |

The threshold is defined at the top of `scripts/check-bundle-size.mjs`
(`THRESHOLD`) and can be adjusted as the project evolves.

## What Gets Tracked

Three published packages are tracked, each with ESM and CJS formats:

- **`@commercetools/nimbus`** — The core component library.
- **`@commercetools/nimbus-icons`** — SVG icons as React components.
- **`@commercetools/nimbus-tokens`** — Design tokens.

The baseline file (`bundle-sizes.json`) is committed to the repo root and looks
like this:

```json
{
  "@commercetools/nimbus": { "esm": 1541463, "cjs": 60526 },
  "@commercetools/nimbus-icons": { "esm": 1555358, "cjs": 2159234 },
  "@commercetools/nimbus-tokens": { "esm": 209, "cjs": 216 }
}
```

## Common Scenarios

### Your PR Fails the Bundle Size Check

1. Look at the CI output to see which packages exceeded the threshold and by how
   much.
2. If the increase is **unintentional**, investigate what changed. Common
   causes:
   - A new dependency was added to a component that was previously lightweight.
   - An import was changed from a deep path to a barrel export, pulling in extra
     code.
   - Tree-shaking broke due to side effects in a module.
3. If the increase is **intentional** (e.g. a new feature that legitimately adds
   code), approve it:

   ```bash
   pnpm build:packages
   node scripts/update-bundle-sizes.mjs
   git add bundle-sizes.json
   git commit -m "chore: approve bundle size increase"
   ```

   The reviewer will see the `bundle-sizes.json` diff in the PR review, making
   bundle increases an explicit, reviewed decision.

### A New Package Format Was Added

New entries that aren't in the baseline are reported as `new` status and do
**not** cause a failure. Run `node scripts/update-bundle-sizes.mjs` to include
them in the baseline.

### A Package Was Removed

Removed entries are reported as `removed` status. Update the baseline to clean
them out.

## CI Integration

The check runs in the `build-and-test` workflow
(`.github/workflows/build-and-test.yml`) immediately after the build step:

```yaml
- name: Check bundle size
  run: node scripts/check-bundle-size.mjs
```

No additional dependencies, services, or secrets are required — the script uses
only Node.js built-ins (`fs`, `path`, `child_process`) and git.

## Approval Flow

The approval mechanism is designed so that bundle size increases are visible in
PR review:

1. Push PR.
2. CI fails: "X FAIL: @commercetools/nimbus esm increased 8.2% (threshold 5%)"
3. You decide this is expected.
4. Run: `node scripts/update-bundle-sizes.mjs`
5. Commit the updated `bundle-sizes.json`.
6. CI re-runs — PR baseline matches measured size — passes.
7. Reviewer sees the `bundle-sizes.json` diff in the PR.

No post-merge CI commits or special GitHub permissions are needed. The PR itself
carries the baseline update.

## Running Locally

You need built packages. If you don't have them:

```bash
pnpm build:packages
```

Then run the check:

```bash
pnpm check:bundle-size
```

The output looks like this:

```
Package                                   Format     Current    Baseline     Delta  Status
----------------------------------------------------------------------------------------
@commercetools/nimbus-icons                  cjs     2.06 MB     2.06 MB     +0.0%    ok
@commercetools/nimbus-icons                  esm     1.48 MB     1.48 MB     +0.0%    ok
@commercetools/nimbus                        esm     1.47 MB     1.47 MB     +0.0%    ok
...
```

## Adjusting the Threshold

Edit the constant at the top of `scripts/check-bundle-size.mjs`:

```js
const THRESHOLD = 0.05; // 5%
```

If we find the threshold too sensitive or too lenient after a few weeks of use,
adjust it and commit the change.
