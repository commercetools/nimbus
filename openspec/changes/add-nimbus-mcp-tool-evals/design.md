## Context

See proposal.md for motivation. Constraints that shape the approach:

- `packages/nimbus-mcp` already has an in-process test client
  (`src/test-utils.ts`) used by the unit specs; it imports `src`, so it cannot
  validate the published build.
- `@modelcontextprotocol/sdk` provides a stdio client that can spawn
  `dist/index.js` exactly as an editor would. No new dependency is needed.
- The `Build and Test` workflow builds all packages before lint/typecheck/test,
  so `dist/` exists when a later step runs.
- Tool outputs are deterministic for a given data snapshot, so expectations can
  be exact and the gate can block from the first run.
- `vitest` projects are registered explicitly in the root `vitest.config.mts`;
  `pnpm test` runs all of them without a prior build.

## Goals / Non-Goals

**Goals:**

- A case is readable and reviewable without reading TypeScript.
- Adding a tool without evals, or breaking a seed case, fails CI.
- The runner reports size and latency so context cost is tracked over time.

**Non-Goals:**

- Model-graded expectations (natural-language `expectations[]` as in RFC-01).
  The vocabulary is intentionally closed.
- Running evals as part of `pnpm test`; they need a build.
- Snapshot-testing whole responses. Snapshots churn on every docs edit and
  review as noise; targeted expectations do not.

## Decisions

**Runner is a vitest project, not a bespoke script.**
`packages/nimbus-mcp/vitest.evals.config.ts` with a single
`evals/run.eval.spec.ts` that reads `evals/cases/*.json` at collection time and
generates one `it` per case. Rationale: failures render with vitest's diff
output, the same reporter CI already uses, and `--testNamePattern` lets a
developer re-run one case. Alternative considered: a standalone `tsx` script
with its own reporter — more code, worse failure output. The project is **not**
added to the root `projects` list, so `pnpm test` stays build-free; a package
script `eval` runs `vitest run --config vitest.evals.config.ts`.

**Transport is stdio against `dist/index.js`.**
`StdioClientTransport` from the SDK spawns `node dist/index.js`. One client is
shared across all cases (`beforeAll`/`afterAll`), matching how the unit specs
share a client. The runner checks `dist/index.js` exists before connecting and
throws `Build @commercetools/nimbus-mcp first (pnpm --filter
@commercetools/nimbus-mcp build)` if not. Alternative: in-process
`createServer()` — rejected because it tests source, not the shipped bundle.

**Case format.**

```json
{
  "tool": "search_docs",
  "cases": [
    {
      "id": "deep-implementation-term",
      "input": { "query": "allowFocusWhenDisabled" },
      "expect": {
        "rankWithin": {
          "field": "path",
          "value": "components/buttons/button",
          "k": 2,
          "also": { "matchedView": "dev" }
        },
        "contains": "allowFocusWhenDisabled",
        "maxChars": 4000
      }
    }
  ]
}
```

Files are validated with a `zod` schema using `.strict()` objects so a typo in
an expectation key fails at load with the file, case id and key. `field` paths
use a minimal subset: dot segments and `[n]` indexes. `rankWithin.also` carries
extra field/value checks on the matched element, so a case can assert a
property of a result without pinning its index (Tabs for `tabListAriaLabel`
is found, but its rank moves with docs edits). Verified against `dist/`:
Tooltip's implementation view also mentions `allowFocusWhenDisabled`, so that
case pins Button within 2, not 1. Values are compared with
deep equality. `contains`/`notContains` accept a string or array and match the
raw response text (so they work for JSON and plain-text tool responses alike).
Alternative considered: `expected_output` free text as in the skill-creator
format — not deterministic, rejected.

**Coverage from the live registry.**
The runner calls `client.listTools()` and compares against the set of `tool`
names in the case files. No hardcoded tool list to drift. Minimum three cases
per tool is a constant in the runner.

**Scorecard.**
Each `it` records `{ tool, id, pass, chars, ms }` in a module-level array
(failed cases are recorded before the assertion error is thrown, so they
appear in the table).
`afterAll` aggregates per tool (pass/fail, p50/max chars, p50/max ms), writes
`packages/nimbus-mcp/evals/.report/scorecard.json` (gitignored) and, if
`process.env.GITHUB_STEP_SUMMARY` is set, appends a Markdown table to that
file. Alternative: a custom vitest reporter — more plumbing for the same output.

**CI placement.**
A step `Nimbus MCP tool evals` running
`pnpm --filter @commercetools/nimbus-mcp eval` after `Check package shape` and
before `Run tests`. Blocking, no `continue-on-error`. The scorecard JSON is not
uploaded as an artifact initially; the job summary is enough until someone
wants history.

## Risks / Trade-offs

- [Docs content edits change tool output and break a case] → Cases assert on
  stable identifiers (routes, export names, prop names) and bounded properties
  (size cap, rank within k), not prose. A case that breaks on a legitimate docs
  change is fixed in the same PR, like any test.
- [Rank assertions are sensitive to scoring tweaks] → Use the loosest k that
  still catches the regression (k=1 only where the result is unambiguous).
- [Spawning a Node process per eval run adds ~1 s] → One process for the whole
  run; negligible next to the existing test job.
- [Scorecard numbers depend on the data snapshot] → They are informational; no
  threshold is enforced on bytes/latency in this change. A threshold can be
  added later as a `maxChars` on specific cases, which is already supported.
