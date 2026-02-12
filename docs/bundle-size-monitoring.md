# Bundle Size Monitoring

Nimbus includes a lightweight bundle size check that runs in CI. It measures the
gzipped size of every ES module entry point in `packages/nimbus/dist` and
compares against a checked-in baseline. If any file grows beyond a configured
threshold the CI job fails, preventing accidental size regressions from being
merged.

## Quick Reference

```bash
# Check sizes against baseline (what CI runs)
pnpm check:bundle-size

# Update the full baseline after an intentional size change
pnpm update:bundle-baseline

# Update the baseline for a single component
pnpm update:bundle-baseline button
```

## How It Works

The script (`scripts/check-bundle-size.mjs`) does the following:

1. Scans `packages/nimbus/dist/` for `index.es.js` and all `components/*.es.js`
   files.
2. Gzips each file (level 9) and records the byte count.
3. Compares every file against `packages/nimbus/bundle-size-baseline.json`.
4. Prints a table with current size, baseline size, percentage delta, and
   status.
5. Exits with code 1 if any file exceeds the **error threshold**.

Only ES module entry points are tracked. Internal chunks (hashed filenames in
`dist/chunks/`) are excluded because they change names across builds and
represent shared implementation details rather than public API surface.

## Thresholds

| Level   | Increase | Effect                           |
| ------- | -------- | -------------------------------- |
| OK      | 0 – 15%  | Reported, no action needed       |
| Warning | > 15%    | Printed in output, does not fail |
| Error   | > 30%    | CI job fails (exit code 1)       |

These values are defined at the top of `scripts/check-bundle-size.mjs`
(`WARN_THRESHOLD` and `ERROR_THRESHOLD`) and can be adjusted as the project
evolves.

## What Gets Tracked

- **`index.es.js`** — The main bundle (theme, hooks, utilities). Currently ~7 KB
  gzipped.
- **`components/*.es.js`** — One file per component. Most are small re-export
  stubs (~120–340 B gzipped) that point into shared chunks.

The baseline file also records when it was last generated, so reviewers can tell
how fresh it is.

## Common Scenarios

### Your PR Fails the Bundle Size Check

1. Look at the CI output to see which files exceeded the threshold and by how
   much.
2. If the increase is **unintentional**, investigate what changed. Common
   causes:
   - A new dependency was added to a component that was previously lightweight.
   - An import was changed from a deep path to a barrel export, pulling in extra
     code.
   - Tree-shaking broke due to side effects in a module.
3. If the increase is **intentional** (e.g. a new feature that legitimately adds
   code), update the baseline for that component:

   ```bash
   pnpm build:packages
   pnpm update:bundle-baseline button
   ```

   This updates only `components/button.es.js` in the baseline while preserving
   all other entries. You can also run `pnpm update:bundle-baseline` without a
   component name to regenerate the entire baseline.

   Commit the updated `packages/nimbus/bundle-size-baseline.json` as part of
   your PR.

### A New Component Was Added

New files that aren't in the baseline are reported as informational (`new`
status) and do **not** cause a failure. After the component lands, update the
baseline so future changes to that component are tracked:

```bash
pnpm update:bundle-baseline
```

### A Component Was Removed

Removed files are reported as `removed` status. Update the baseline to clean
them out.

## CI Integration

The check runs in the `build-and-test` workflow
(`.github/workflows/build-and-test.yml`) immediately after the build step:

```yaml
- name: Check bundle size
  run: node scripts/check-bundle-size.mjs
```

No additional dependencies or services are required — the script uses only
Node.js built-ins (`fs`, `zlib`, `path`).

## Running Locally

You need a built `packages/nimbus/dist` directory. If you don't have one:

```bash
pnpm build:packages
```

Then run the check:

```bash
pnpm check:bundle-size
```

The output looks like this:

```
File                                  Current    Baseline     Delta  Status
--------------------------------------------------------------------------
index.es.js                            7.0 KB      7.0 KB    +0.0%    ok
components/button.es.js                 125 B       125 B    +0.0%    ok
...
```

## Adjusting Thresholds

Edit the constants at the top of `scripts/check-bundle-size.mjs`:

```js
const WARN_THRESHOLD = 0.15; // 15% — prints a warning
const ERROR_THRESHOLD = 0.3; // 30% — fails the build
```

If you find the thresholds too sensitive or too lenient after a few weeks of
use, adjust them and commit the change.
