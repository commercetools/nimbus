## 1. Spikes: resolve open questions before building

- [ ] 1.1 Token route spike: add a tiny `chart-tokens.json` with one token `color.chart.<palette>.{light,dark}` (no other keys in the pair) to `packages/tokens/src/base/`, add it to `source` in `packages/tokens/src/style-dictionary.config.js`, run `pnpm build:tokens`, and confirm that (a) Style Dictionary merges the second file, (b) the CSS variable is `--nimbus-colors-chart-<palette>` with a light and a dark value, and (c) the dark selector matches the one used by the docs and Storybook. Write the result into `design.md`
- [ ] 1.2 Check the background: confirm that `bg` is `#fff` (light) and `#111111` (dark), and check the surfaces Nimbus uses for panels and cards. Write the result into `design.md` and decide the open question about other surfaces
- [ ] 1.3 Add `recharts@^3.10.1` and `react-is` to `packages/nimbus/package.json` and install with pnpm. Keep `minimumReleaseAgeStrict` as it is and add no `minimumReleaseAgeExclude` entry
- [ ] 1.4 Build a throwaway `BarChart` with narrow Recharts imports. Run `pnpm build`, `pnpm check:bundle-size` and `pnpm check:bundler-compat`. Record the size change and the require-helper result in `design.md`. If `victory-vendor` fails the scan, decide between an alias, an external dependency or another version before going on
- [ ] 1.5 Open https://ui.shadcn.com/charts with Playwright and take reference screenshots of the six chart types. List the visual traits (grid lines, axes, bar radius, tooltip, legend, area opacity, stroke width between shapes) in `design.md`. Limit this to one short session
- [ ] 1.6 Check how Recharts `PieChart` and `RadialBarChart` behave with the keyboard (Tab, ArrowLeft, ArrowRight, Enter). Write the result into `design.md`. Also find the Recharts prop that turns animation off, for the Chromatic stories

## 2. Chart color tokens (spec: `color-tokens`)

- [ ] 2.1 Write failing unit tests for selection and contrast: (a) only palettes with a white `contrast` token are chart palettes, read from the generated data, (b) every chart color has at least 3:1 contrast against `bg` in light and dark mode, (c) a solid that already has 3:1 is unchanged
- [ ] 2.2 Write failing unit tests for adaptation: (d) a changed color has at most 3.2:1 and, if chromatic (OKLCH chroma of at least 0.02), a hue within 3 degrees of the solid, (e) fixture `orange` in light mode changes (2.97 to at least 3:1), (f) fixture `#484848` on `#111111` changes (2.06 to at least 3:1)
- [ ] 2.3 Add the build script in `packages/color-tokens`: for each chart palette and mode, adapt only the OKLCH lightness of the solid (`DEFAULT`) by the smallest amount that gives 3:1 against `bg`, using chroma-js `contrast()`. Write `packages/tokens/src/base/chart-tokens.json` until 2.1 and 2.2 pass
- [ ] 2.4 Add the drift check that fails when `chart-tokens.json` differs from the generator output (a test, or a step in `build:tokens`)
- [ ] 2.5 Write a failing unit test for the default palette order (the 11 palettes in `design.md`: `blue`, `bronze`, `crimson`, `cyan`, `grass`, `indigo`, `orange`, `plum`, `red`, `slate`, `teal`; every pair at deltaE2000 of at least 15 in light and dark mode)
- [ ] 2.6 Generate the `ChartPalette` union type from the token file into `packages/nimbus/src/components/chart/chart.palettes.ts`, and export the default order (a fixed list) as a constant in the same file, so `config` accepts only chart palette names
- [ ] 2.7 Rebuild tokens and confirm all tests in this group pass. Check that only `orange` changes in light mode and that no palette changes in dark mode
- [ ] 2.8 Update `packages/color-tokens/CLAUDE.md`, `packages/color-tokens/README.md`, `packages/tokens` docs and the `color-tokens` spec text for the new output

## 3. Shared chart foundation (spec: `nimbus-charts`)

- [ ] 3.1 Create the folder `packages/nimbus/src/components/chart/` with `index.ts`, following `docs/file-type-guidelines/barrel-exports.md` and the structure in `docs/component-guidelines.md`
- [ ] 3.2 Define `ChartConfig` and shared types with JSDoc on every prop, with `aria-label` required
- [ ] 3.3 Write failing unit tests for config handling: palette to CSS variable, unknown series key (skipped and warned in development), invalid palette at run time (warned in development, first palette of the default order in production), more than 11 series (warned in development, palettes reused in the default order)
- [ ] 3.4 Implement the config utilities until 3.3 passes
- [ ] 3.5 Write a failing test for text contrast: chart text tokens have at least 4.5:1 against `bg` in both modes
- [ ] 3.6 Implement `ChartTooltip` (with `role="status"` and `aria-live="assertive"`) and `ChartLegend` reading the shared config. Text uses `fg` and `fg.subtle`. The legend can show values for the Pie and Radial fallback
- [ ] 3.7 Implement `ChartContainer` with a default aspect ratio, the empty state, the `isLoading` skeleton, `displayName`, and the legend rule (shown for two or more series)
- [ ] 3.8 Add the slot recipe and register it in `packages/nimbus/src/theme/slot-recipes/index.ts`. Regenerate theme typings
- [ ] 3.9 Add the `chart.i18n.ts` source file for the empty state text and run `pnpm extract-intl` (see `docs/file-type-guidelines/i18n.md`)

## 4. BarChart, LineChart and AreaChart (first release for the product team)

- [ ] 4.1 Create the folders `bar-chart/`, `line-chart/` and `area-chart/` with `index.ts` and the file structure from `docs/component-guidelines.md`
- [ ] 4.2 Write failing stories with play functions for `BarChart`: render, stacked, empty, loading, tooltip and legend, legend shown for two or more series, 2 px stroke between bars, role and tabIndex, ArrowLeft and ArrowRight, Tab focus, light and dark mode. Turn off Recharts animation in snapshotted stories and follow `docs/chromatic-visual-testing.md` for which stories get a visual snapshot
- [ ] 4.3 Implement `BarChart` until 4.2 passes
- [ ] 4.4 Write failing stories for `LineChart`: the same list as 4.2 (without stacked and bar stroke), plus the case with more than 3 series (dash style or marker)
- [ ] 4.5 Implement `LineChart`
- [ ] 4.6 Write failing stories for `AreaChart`: the same list as 4.2 (without bar stroke), plus the reduced-opacity fill with a full-color line
- [ ] 4.7 Implement `AreaChart`
- [ ] 4.8 Export the shared types and the three charts from `packages/nimbus/src/components/index.ts`
- [ ] 4.9 Add the designer `*.mdx`, the developer `*.dev.mdx` and `*.docs.spec.tsx` for `BarChart` (use `/create-eng-docs` and the `writing-designer-documentation` skill). Add the `@experimental` JSDoc tag on the main export and state in the docs text that the chart is experimental in the first release (see `docs/file-type-guidelines/documentation.md` and `main-component.md` "Lifecycle State Tag")
- [ ] 4.10 Add the same three docs files for `LineChart`
- [ ] 4.11 Add the same three docs files for `AreaChart`
- [ ] 4.12 Add a changeset for the three charts (consumer-facing, see `docs/changeset-conventions.md`). Say in the text that they are experimental
- [ ] 4.13 Run `pnpm lint`, `pnpm --filter @commercetools/nimbus typecheck:dev`, `pnpm test`, and `pnpm check:bundle-size`

## 5. PieChart

- [ ] 5.1 Use the result of task 1.6 to write the failing stories for `PieChart` with `nameKey` and `valueKey`: the same list as 4.2 (without stacked, ArrowLeft and ArrowRight unless 1.6 shows they work), legend always shown, 2 px stroke between slices
- [ ] 5.2 Implement `PieChart`. If arrow keys do not move between slices, show the value of each category in the legend and record the gap in the docs
- [ ] 5.3 Add the designer and developer docs, the docs spec, the `@experimental` JSDoc tag, and the changeset text (say the chart is experimental, as in 4.12). Export from the components index

## 6. RadarChart and RadialChart (first to move to a later change if time runs out)

- [ ] 6.1 Write failing stories for `RadarChart`: the same list as 4.2 (without stacked and bar stroke)
- [ ] 6.2 Implement `RadarChart`
- [ ] 6.3 Write failing stories for `RadialChart` with `nameKey` and `valueKey`: the same list as 5.1, using the result of task 1.6
- [ ] 6.4 Implement `RadialChart`
- [ ] 6.5 Add the designer and developer docs, the docs specs, the `@experimental` JSDoc tag, and the changeset text (say the charts are experimental, as in 4.12). Export from the components index

## 7. Final checks

- [ ] 7.1 Run the Nimbus review (`nimbus-reviewer`) on all new files and fix findings
- [ ] 7.2 Run `pnpm test`, `pnpm typecheck:strict`, `pnpm check:package-shape`, `pnpm check:bundler-compat` and `pnpm check:bundle-size`
- [ ] 7.3 Check the stories in Storybook in light and dark mode, and with the keyboard only
- [ ] 7.4 Run `pnpm openspec validate add-charts --strict`
- [ ] 7.5 Check whether new components need a Figma Code Connect file (`docs/figma-code-connect-ci.md`) or an entry in the MCP data (`packages/nimbus-mcp`), and add them if required
- [ ] 7.6 Move any chart that did not finish to a new change, and list it in the pull request
