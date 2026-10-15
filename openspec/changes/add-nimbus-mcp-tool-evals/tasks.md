## 1. Runner scaffold

- [x] 1.1 Add `packages/nimbus-mcp/vitest.evals.config.ts` (name `nimbus-mcp-evals`, include `evals/**/*.eval.spec.ts`, node environment) and an `eval` script in `package.json`; verify `pnpm --filter @commercetools/nimbus-mcp eval` runs and reports zero tests
- [x] 1.2 Write the failing load-time test: `evals/cases.spec.ts` asserts the case schema rejects an unknown expectation key and a missing `id`, naming file/case/key; verify it fails (no schema yet)
- [x] 1.3 Implement `evals/case-schema.ts` (strict zod objects for the vocabulary: `isError`, `contains`, `notContains`, `field`, `rankWithin`, `absent`, `length`, `maxChars`) and `evals/load-cases.ts`; verify 1.2 passes
- [x] 1.4 Write the failing matcher unit tests in `evals/matchers.spec.ts` covering every vocabulary key against fixed JSON and plain-text responses, including `field` path parsing (`[0].matchedView`, `results[2].name`); verify they fail
- [x] 1.5 Implement `evals/matchers.ts` so each matcher returns `{ ok, expected, actual }`; verify 1.4 passes
- [x] 1.6 Add `evals/.report/` to `.gitignore`; verify `git status` ignores a file written there

## 2. Execution against the built artifact

- [x] 2.1 Implement `evals/client.ts`: check `dist/index.js` exists (throw with the build command if not) and connect a `StdioClientTransport` client; verify running `eval` without a build fails with that message and with a build connects (listTools returns the seven tools)
- [x] 2.2 Implement `evals/run.eval.spec.ts`: load all case files, `describe` per tool, one `it` per case calling the tool and applying every matcher, failing with tool/id/expectation/expected/actual; verify a deliberately wrong temporary case fails with that message, then remove it
- [x] 2.3 Add the coverage test to `run.eval.spec.ts`: every tool from `listTools()` has ≥ 3 cases, every case-file tool is registered, ids unique; verify by temporarily deleting one case file (fails naming the tool) and restoring it

## 3. Seed cases

- [x] 3.1 `evals/cases/search_docs.json`: deep implementation term (`allowFocusWhenDisabled` → Button top-1, `matchedView` dev, snippet contains), late-alphabet page (`tabListAriaLabel` → Tabs dev; `activeFillStyle` → Toggle button present with snippet), co-occurrence (`isLoading setTimeout` snippet contains both), no leaked fences (`Box flex container` notContains "``"), cap (`limit: 10` on `button`, `component`, `accessibility` → `maxChars` 4000), nonsense query → "No matching documentation found."; verify `eval` passes
- [x] 3.2 `evals/cases/get_component.json`: Button metadata lists the five sections; Button props include `variant` and `size` and exclude `onClick`; Drawer props aggregate sub-components (contains `DrawerRoot`); unknown name → `isError`; verify `eval` passes
- [x] 3.3 `evals/cases/get_docs_page.json`: `home/getting-started/installation` title/path; `components/buttons/button` has > 1 section; unknown path → `isError`; verify `eval` passes
- [x] 3.4 `evals/cases/get_tokens.json`: category list order starts `color, colorPalettes, spacing, fontSize`; `spacing` category returns `category: "spacing"`; a large category returns a paging `hint`; verify `eval` passes
- [x] 3.5 `evals/cases/list_components.json`: ≥ 60 components; `Inputs` subcategory contains `Select` and `Combo box`; nonsense filter → empty; verify `eval` passes
- [x] 3.6 `evals/cases/search_icons.json`: `importPath` is `@commercetools/nimbus-icons`; a broad query has `hasMore: true` and `pageSize: 10`; nonsense → `totalResults: 0`; verify `eval` passes
- [x] 3.7 `evals/cases/migrate_from_uikit.json`: `PrimaryButton` → `Button`, `mappingType` variant; `Spacings` → `compoundRoot` with ≥ 4 mappings including `Spacings.Stack`; `ZylonAccordion` → suggestion `Accordion` with confidence `medium`; verify `eval` passes

## 4. Scorecard and CI

- [x] 4.1 Record `{ tool, id, pass, chars, ms }` per case and in `afterAll` write `evals/.report/scorecard.json` with per-tool pass/fail and p50/max chars and ms; verify the file exists after a local run and its totals match the vitest summary
- [x] 4.2 When `GITHUB_STEP_SUMMARY` is set, append a Markdown table of the same data; verify locally by pointing the variable at a temp file and inspecting it
- [x] 4.3 Add the `Nimbus MCP tool evals` step to `.github/workflows/build-and-test.yml` after `Check package shape`; verify the workflow YAML parses (`pnpm exec yaml-lint` or a dry read) and the step appears in the PR's checks
- [x] 4.4 Document the eval suite in `packages/nimbus-mcp/README.md` (how to run, how to add a case, the vocabulary) and add a short note to `packages/nimbus-mcp/CLAUDE.md` that a new tool needs ≥ 3 cases; verify both render and link correctly
