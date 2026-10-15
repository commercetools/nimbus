## Why

`@commercetools/nimbus-mcp` ships seven tools that coding agents call to find
Nimbus docs, props, tokens, icons and UI Kit migrations. Nothing in CI checks
that a tool still returns the *right* thing — only that it returns the right
shape. This session's `search_docs` work found three silent regressions that
had passed every unit test: content past 2 KB of a page was never searched,
only 30 pages were ever deep-searched, and fuzzy matching returned every page
whose description contained the word "a". A tool can get materially worse for
agents without a single test going red.

RFC-01 "Evaluating commercetools AI skills" sets up model-graded evals for
skills and explicitly scopes MCP servers out. MCP tools are the complementary,
easier case: the output is deterministic, so evals need no model, no AI-credit
budget, no advisory period and no re-runs — they can block merges from day one.

## What Changes

- Add a per-tool eval suite to `packages/nimbus-mcp`: one JSON case file per
  tool, each case an input plus a small set of deterministic expectations
  (text contains / does not contain, a field equals a value, a result is ranked
  within the top k, a result is absent, response size cap, error flag).
- Add a runner that executes every case against the **built** server artifact
  over stdio — the same thing consumers install — and fails on any unmet
  expectation.
- Enforce coverage: every tool the server registers has at least three cases,
  and case ids are unique. Adding a tool without evals fails the run.
- Emit a scorecard (pass rate per tool, response bytes and latency percentiles)
  to the CI job summary and as a JSON artifact, so "how much context does this
  tool cost" is measured, not estimated.
- Add a blocking `eval` step to the `Build and Test` workflow after the
  package-shape check.
- Seed cases: the `search_docs` regressions verified by hand this session
  (`allowFocusWhenDisabled`, `activeFillStyle`, `tabListAriaLabel`, Box fence
  leak, 4 KB response cap) and representative cases for the other six tools
  lifted from their existing specs.

No tool behaviour changes. No changeset: evals and CI are not consumer-facing.

## Capabilities

### New Capabilities

- `nimbus-mcp-evals`: deterministic, CI-enforced quality checks for every
  nimbus-mcp tool — case format, coverage rules, execution against the built
  artifact, failure reporting, and the scorecard.

### Modified Capabilities

<!-- None -->

## Impact

- New files under `packages/nimbus-mcp/evals/` (case files, runner, matcher
  library) and a new `eval` script in its `package.json`.
- `.github/workflows/build-and-test.yml` gains one step.
- `@modelcontextprotocol/sdk` is already a dependency; its stdio client is used
  as-is. No new dependencies.
- Not in scope: evaluating tool output with a model, evaluating the docs site
  search, or running evals against a published npm version.
