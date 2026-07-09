# Bundle Size Monitoring

Nimbus includes a bundle size check that runs on every pull request. It measures
the minified (not gzipped) output of each published package, compares against a
baseline derived from the most recently merged PR, and posts a sticky comment
with the results. If any package exceeds its size policy the CI job fails,
preventing accidental regressions from being merged.

## Quick Reference

```bash
# Check sizes against baseline (what CI runs)
pnpm check:bundle-size

# View bundle size trend across recent merged PRs
pnpm bundle-sizes:trend

# View trend as JSON (pipeable to jq or other scripts)
pnpm bundle-sizes:trend --json
```

## How It Works

### The Comment Chain

Every PR gets a sticky bot comment showing a table of current sizes, baselines,
deltas, and pass/fail status. This comment includes a machine-readable data
block (`<!-- bundle-sizes-data-v1: {...} -->`) that records the measured sizes.

When the next PR opens, the CI action queries the most recently merged PR with
the `bundle-sizes` label, extracts the data block from its bot comment, and uses
that as the baseline. This creates a chain: each merged PR's comment becomes the
next PR's baseline.

### Bootstrapping

The comment chain must be seeded by a **bootstrap file** (`bundle-sizes.json` in
the repo root). This file is only needed for the very first PR — once that PR
merges and receives the `bundle-sizes` label with a valid bot comment, the
comment chain is self-sustaining and the bootstrap file should be deleted.

If the comment chain is ever lost (e.g., all `bundle-sizes` labels are removed),
create a new bootstrap file to re-seed it. See
[First-Time Setup](#first-time-setup) below.

### Post-Merge Labeling

After a PR merges, a separate workflow
(`.github/workflows/bundle-size-comment.yml`) automatically adds the
`bundle-sizes` label to the merged PR. This is the tracking label that makes the
PR discoverable as a baseline source — it is not the approval label.

## What Gets Tracked

Three published packages are tracked:

| Package                        | Policy            | Details                       |
| ------------------------------ | ----------------- | ----------------------------- |
| `@commercetools/nimbus`        | Relative (5%)     | Core component library        |
| `@commercetools/nimbus-icons`  | Relative (5%)     | SVG icons as React components |
| `@commercetools/nimbus-tokens` | Absolute (512 KB) | Design tokens                 |

### Per-Package Policies

Most packages use the **relative threshold** (default 5%). If the `dist` output
grows more than 5% compared to the baseline, the check fails.

Small packages like `nimbus-tokens` use an **absolute budget** instead. Rather
than a percentage, the policy defines a hard ceiling in bytes. This prevents
trivially small increases from being ignored — a 100-byte increase on a 2 KB
package is a 5% jump, but an absolute budget of 512 KB is clearer for packages
that should stay tiny.

Policies are defined in `.github/actions/bundle-size/check-bundle-size.mjs`:

```js
"@commercetools/nimbus-tokens": {
  dist: "packages/tokens/dist",
  policy: { kind: "absolute", maxBytes: 512000 },
},
```

## The PR Comment

Every PR receives a bot comment titled **Bundle Size Report** that shows:

| Column   | Description                                   |
| -------- | --------------------------------------------- |
| Package  | Package name                                  |
| Format   | `dist`                                        |
| Current  | Measured size of the PR's build output (KB)   |
| Baseline | Size from the comment-chain baseline (KB)     |
| Delta    | Percentage change from baseline               |
| Status   | `ok`, `fail`, `new`, `removed`, or `approved` |

The comment is updated in place on each CI run (not duplicated). It includes a
timestamp so reviewers can see when the data was last refreshed.

## Common Scenarios

### Your PR Fails the Bundle Size Check

1. Look at the bot comment on your PR to see which packages exceeded their
   policy.
2. If the increase is **unintentional**, investigate. Common causes:
   - A new dependency pulled in extra code.
   - An import changed from a deep path to a barrel export.
   - Tree-shaking broke due to side effects.
3. If the increase is **intentional** (a new feature that legitimately adds
   code), approve it by adding the `bundle-size-approved` label to the PR and
   re-running CI. The check will pass with an `approved` status.

### Approving a Size Increase

1. Push your PR.
2. CI fails — the bot comment shows which packages exceeded the threshold.
3. You (or a reviewer) decide the increase is expected.
4. Add the **`bundle-size-approved`** label to the PR.
5. Re-run CI — the check sees the label and passes with `approved` status.
6. The reviewer sees the delta in the bot comment, making the increase an
   explicit, reviewed decision.

No files need to be committed to approve an increase — the label is the approval
mechanism.

### A New Package Format Was Added

New entries that aren't in the baseline are reported as `new` status and do
**not** cause a failure.

### A Package Was Removed

Removed entries are reported as `removed` status and do not cause a failure.

## CI Integration

The check runs in the `build-and-test` workflow
(`.github/workflows/build-and-test.yml`) on pull requests:

```yaml
- name: Bundle size check
  if: github.event_name == 'pull_request'
  uses: ./.github/actions/bundle-size
  with:
    gh-token: ${{ github.token }}
    pr-number: ${{ github.event.pull_request.number }}
```

The action:

1. Fetches the baseline from the comment chain
   (`.github/actions/bundle-size/fetch-bundle-baseline.mjs`)
2. Checks for the `bundle-size-approved` label
3. Measures and compares sizes
   (`.github/actions/bundle-size/check-bundle-size.mjs`)
4. Posts or updates the bot comment
   (`.github/actions/bundle-size/post-bundle-size-comment.mjs`)
5. Fails the job if thresholds are exceeded and the approval label is absent

## Running Locally

You need built packages and the [GitHub CLI](https://cli.github.com) (`gh`)
installed and authenticated:

```bash
pnpm build:packages
pnpm check:bundle-size
```

When `BUNDLE_SIZE_BASELINE` is not set (the normal local case), the script
automatically fetches the baseline from the comment chain via `gh`. Run it from
within the repo — the `GITHUB_REPOSITORY` variable that Actions provides in CI
is absent locally, so the fetch derives the repo from your checkout via
`gh repo view`. The output shows a table with current size, baseline, delta, and
status for each tracked package. All sizes are displayed in KB.

## Viewing the Trend

The `bundle-sizes:trend` command reconstructs a historical view of bundle sizes
from merged PR comments. It queries merged PRs with the `bundle-sizes` label,
parses the data block from each bot comment, and prints a chronological table
with per-package sizes and deltas.

```bash
# Show trend for the last 20 merged PRs (default)
pnpm bundle-sizes:trend

# Limit to the last 5
pnpm bundle-sizes:trend --limit 5

# Output raw JSON (pipeable to jq or other scripts)
pnpm bundle-sizes:trend --json

# Show usage
pnpm bundle-sizes:trend --help
```

Each PR requires a separate API call to fetch its comments, so higher `--limit`
values will be slower.

Example output:

```
┌─────────┬─────────┬──────────────────────┬──────────────┬─────────────┬──────────┐
│ (index) │ PR      │ Title                │ Merged       │ nimbus (KB) │ nimbus Δ │
├─────────┼─────────┼──────────────────────┼──────────────┼─────────────┼──────────┤
│ 0       │ '#1499' │ 'FEC-912: comment…'  │ '2026-05-15' │ '16583.0'   │ '—'      │
│ 1       │ '#1498' │ 'chore(ci): add …'   │ '2026-05-16' │ '16588.2'   │ '+5.1'   │
└─────────┴─────────┴──────────────────────┴──────────────┴─────────────┴──────────┘
```

Requires the [GitHub CLI](https://cli.github.com) (`gh`) to be installed and
authenticated. The script is read-only — it only queries the API, never writes.

## First-Time Setup

To establish the comment chain for the first time (or re-establish it after it
breaks):

1. Build all packages:

   ```bash
   pnpm build:packages
   ```

2. Measure current sizes and write them to `bundle-sizes.json`:

   ```bash
   node -e "
     import { readdirSync, existsSync, statSync, writeFileSync } from 'fs';
     import { join } from 'path';
     function sum(dir) {
       let t = 0;
       if (!existsSync(dir)) return t;
       for (const e of readdirSync(dir, { withFileTypes: true }))
         t += e.isDirectory() ? sum(join(dir, e.name)) : statSync(join(dir, e.name)).size;
       return t;
     }
     const sizes = {
       '@commercetools/nimbus': { dist: sum('packages/nimbus/dist') },
       '@commercetools/nimbus-icons': { dist: sum('packages/nimbus-icons/dist') },
       '@commercetools/nimbus-tokens': { dist: sum('packages/tokens/dist') },
     };
     writeFileSync('bundle-sizes.json', JSON.stringify(sizes, null, 2) + '\n');
     console.log('Wrote bundle-sizes.json:', sizes);
   "
   ```

3. Commit `bundle-sizes.json`, push a PR, and merge it. The CI action will use
   the bootstrap file as the baseline, post a bot comment with the measured
   sizes, and the post-merge workflow will add the `bundle-sizes` label.

4. After the PR merges, delete `bundle-sizes.json` from the repo — the comment
   chain is now self-sustaining.

## Adjusting the Threshold

Edit the constant at the top of
`.github/actions/bundle-size/check-bundle-size.mjs`:

```js
const DEFAULT_THRESHOLD = 0.05; // 5%
```

If we find the threshold too sensitive or too lenient after a few weeks of use,
adjust it and commit the change. For absolute budgets, edit the `policy` field
on the relevant package definition.
