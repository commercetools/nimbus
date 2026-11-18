## 1. Spikes: resolve open questions before building

- [x] 1.1 Token route spike: add a tiny `chart-tokens.json` with one token `color.chart.<palette>.{light,dark}` (no other keys in the pair) to `packages/tokens/src/base/`, add it to `source` in `packages/tokens/src/style-dictionary.config.js`, run `pnpm build:tokens`, and confirm that (a) Style Dictionary merges the second file, (b) the CSS variable is `--nimbus-colors-chart-<palette>` with a light and a dark value, and (c) the dark selector matches the one used by the docs and Storybook. Write the result into `design.md`
- [x] 1.2 Check the background: confirm that `bg` is `#fff` (light) and `#111111` (dark), and check the surfaces Nimbus uses for panels and cards. Done: decided to adapt against `bg` only, with the measured limits in `design.md`
- [x] 1.3 Add `recharts@^3.10.1` and `react-is` to `packages/nimbus/package.json` and install with pnpm. Keep `minimumReleaseAgeStrict` as it is and add no `minimumReleaseAgeExclude` entry
- [x] 1.4 Build a throwaway `BarChart` with narrow Recharts imports. Run `pnpm build`, `pnpm check:bundle-size` and `pnpm check:bundler-compat`. Record the size change and the require-helper result in `design.md`. If `victory-vendor` fails the scan, decide between an alias, an external dependency or another version before going on
- [x] 1.5 Open https://ui.shadcn.com/charts with Playwright and take reference screenshots of the six chart types. List the visual traits (grid lines, axes, bar radius, tooltip, legend, area opacity, stroke width between shapes) in `design.md`. Limit this to one short session
- [x] 1.6 Check how Recharts `PieChart` and `RadialBarChart` behave with the keyboard (Tab, ArrowLeft, ArrowRight, Enter). Write the result into `design.md`. Done: all six chart types work; animation is turned off with `isAnimationActive={false}`

## 2. Chart color tokens (spec: `color-tokens`)

- [x] 2.1 Write failing unit tests for selection and contrast: (a) only palettes with a white `contrast` token are chart palettes, read from the generated data, (b) every chart color, measured on the value as emitted in `packages/tokens/src/generated/chakra/theme-tokens.ts` (the build converts hex to rounded HSL), has at least 3:1 contrast against `bg` in light and dark mode, (c) a solid that already has 3:1 is unchanged
- [x] 2.2 Write failing unit tests for adaptation: (d) a changed color has at most 3.2:1 and, if chromatic (OKLCH chroma of at least 0.02), a hue within 3 degrees of the solid, (e) fixture `orange` in light mode changes (2.97 to at least 3:1), (f) fixture `#484848` on `#111111` changes (2.06 to at least 3:1)
- [x] 2.3 Add the build script in `packages/color-tokens`: for each chart palette and mode, adapt only the OKLCH lightness of the solid (`DEFAULT`) by the smallest amount that gives 3:1 against `bg`, using chroma-js `contrast()`. Write `packages/tokens/src/base/chart-tokens.json` (shape `color.chart.<palette>` with `light.DEFAULT` and `dark.DEFAULT`), add it to `source` in `packages/tokens/src/style-dictionary.config.js`, and register `chart: themeTokens.color.chart` in `packages/nimbus/src/theme/semantic-tokens/colors.ts`, until 2.1 and 2.2 pass
- [x] 2.4 Add the drift check that fails when `chart-tokens.json` differs from the generator output (a test, or a step in `build:tokens`)
- [x] 2.5 Write a failing unit test for the default palette order (the 11 palettes in `design.md`, starting with `ctviolet`; every pair at deltaE2000 of at least 15 in light and dark mode)
- [x] 2.6 Generate the `ChartPalette` type (named `chartPaletteNames` for the list) from the chart palettes into `packages/nimbus/src/components/chart/chart.palettes.ts`, and export the default order (a fixed list) as a constant in the same file, so `config` accepts only chart palette names
- [x] 2.7 Rebuild tokens and confirm all tests in this group pass. Check that only `orange` changes in light mode and that no palette changes in dark mode
- [x] 2.8 Update `packages/color-tokens/CLAUDE.md`, `packages/color-tokens/README.md`, `packages/tokens` docs and the `color-tokens` spec text for the new output

## 3. Shared chart foundation (spec: `nimbus-charts`)

- [x] 3.1 Create the folder `packages/nimbus/src/components/chart/` with `index.ts`, following `docs/file-type-guidelines/barrel-exports.md` and the structure in `docs/component-guidelines.md`
- [x] 3.2 Define `ChartConfig` and shared types with JSDoc on every prop, with `aria-label` required
- [x] 3.3 Write failing unit tests for config handling: palette to CSS variable, unknown series key (skipped and warned in development), invalid palette at run time (warned in development, first palette of the default order in production), more than 11 series (warned in development, palettes reused in the default order)
- [x] 3.4 Implement the config utilities until 3.3 passes
- [x] 3.5 Write a failing test for text contrast: chart text tokens have at least 4.5:1 against `bg` in both modes
- [x] 3.6 Implement `ChartTooltip` (with `role="status"` and `aria-live="assertive"`) and `ChartLegend` reading the shared config. Text uses `fg` and `fg.subtle`.
- [x] 3.7 Implement `ChartContainer` with a default aspect ratio, the empty state, the `isLoading` skeleton, `displayName`, and the legend rule (shown for two or more series)
- [x] 3.8 Add the slot recipe and register it in `packages/nimbus/src/theme/slot-recipes/index.ts`. Regenerate theme typings
- [x] 3.9 Add the `chart.i18n.ts` source file for the empty state text and run `pnpm extract-intl` (see `docs/file-type-guidelines/i18n.md`)
- [x] 3.10 Check that `apps/docs` and Storybook resolve `recharts` from the workspace (it is an external peer and dev dependency of `packages/nimbus`), and run `pnpm check:package-shape` with a first chart exported. Status: Storybook resolves `recharts` (verified by the shared stories). `apps/docs` does not list `recharts` or `react-is`; add both (catalog `charts`) together with the first chart docs in task 4.9. `check:package-shape` can only show something once a chart is exported, so run it in task 4.13. `check:package-shape` also fails today on `nimbus-design-token-ts-plugin` and `nimbus-mcp` (publint), which this change does not touch Done: `apps/docs` lists `recharts` and `react-is` (catalog `charts`) and the docs build passes; `pnpm check:package-shape` with the charts exported reports no problems for `@commercetools/nimbus` (attw and publint pass). The overall command still fails on `nimbus-design-token-ts-plugin` and `nimbus-mcp`, which this change does not touch.

## 4. BarChart, LineChart and AreaChart (first release for the product team)

- [x] 4.1 Create the folders `bar-chart/`, `line-chart/` and `area-chart/` with `index.ts` and the file structure from `docs/component-guidelines.md`
- [x] 4.2 Write failing stories with play functions for `BarChart`: render, stacked, empty, loading, tooltip and legend, legend shown for two or more series, 2 px stroke between bars, role and tabIndex, ArrowLeft and ArrowRight, Tab focus, light and dark mode. Turn off Recharts animation in snapshotted stories and follow `docs/chromatic-visual-testing.md` for which stories get a visual snapshot
- [x] 4.3 Implement `BarChart` until 4.2 passes
- [x] 4.4 Write failing stories for `LineChart`: the same list as 4.2 (without stacked and bar stroke), plus the case with more than 3 series (dash style or marker)
- [x] 4.5 Implement `LineChart`
- [x] 4.6 Write failing stories for `AreaChart`: the same list as 4.2 (without bar stroke), plus the gradient fill (about 0.8 opacity at the line, about 0.1 at the baseline) with a full-color line
- [x] 4.7 Implement `AreaChart`
- [x] 4.8 Export the shared types and the three charts from `packages/nimbus/src/components/index.ts`
- [x] 4.9 Add the designer `*.mdx`, the developer `*.dev.mdx` and `*.docs.spec.tsx` for `BarChart` (use `/create-eng-docs` and the `writing-designer-documentation` skill). Add the `@experimental` JSDoc tag on the main export and state in the docs text that colors are checked against `bg`, that consumers install `recharts` and `react-is`, and that the chart is experimental in the first release (see `docs/file-type-guidelines/documentation.md` and `main-component.md` "Lifecycle State Tag")
- [x] 4.10 Add the same three docs files for `LineChart`
- [x] 4.11 Add the same three docs files for `AreaChart`
- [x] 4.12 Add a changeset for the three charts (consumer-facing, see `docs/changeset-conventions.md`). Say in the text that they are experimental
- [ ] 4.13 Run `pnpm lint`, `pnpm --filter @commercetools/nimbus typecheck:dev`, `pnpm test`, and `pnpm check:bundle-size`

## 5. PieChart

- [ ] 5.1 Write the failing stories for `PieChart` with `nameKey` and `valueKey`: the same list as 4.2 (without stacked), legend always shown, 2 px stroke between slices
- [ ] 5.2 Implement `PieChart`
- [ ] 5.3 Add the designer and developer docs, the docs spec, the `@experimental` JSDoc tag, and the changeset text (say the chart is experimental, as in 4.12). Export from the components index

## 6. RadarChart and RadialChart (first to move to a later change if time runs out)

- [ ] 6.1 Write failing stories for `RadarChart`: the same list as 4.2 (without stacked and bar stroke)
- [ ] 6.2 Implement `RadarChart`
- [ ] 6.3 Write failing stories for `RadialChart` with `nameKey` and `valueKey`: the same list as 5.1
- [ ] 6.4 Implement `RadialChart`
- [ ] 6.5 Add the designer and developer docs, the docs specs, the `@experimental` JSDoc tag, and the changeset text (say the charts are experimental, as in 4.12). Export from the components index

## 7. Final checks

- [ ] 7.1 Run the Nimbus review (`nimbus-reviewer`) on all new files and fix findings
- [ ] 7.2 Run `pnpm test`, `pnpm typecheck:strict`, `pnpm check:package-shape`, `pnpm check:bundler-compat` and `pnpm check:bundle-size`
- [ ] 7.3 Check the stories in Storybook in light and dark mode, and with the keyboard only
- [ ] 7.4 Run `pnpm openspec validate add-charts --strict`
- [ ] 7.5 Check whether new components need a Figma Code Connect file (`docs/figma-code-connect-ci.md`) or an entry in the MCP data (`packages/nimbus-mcp`), and add them if required
- [ ] 7.6 Move any chart that did not finish to a new change, and list it in the pull request
