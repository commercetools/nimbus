## 1. Resolve open questions and add the dependency

- [ ] 1.1 Read `packages/tokens/src/base/tokens.json` and decide how chart tokens enter it (manual copy workflow from `color-tokens`, or a committed mapping file). Write the decision into `design.md`
- [ ] 1.2 Find the Nimbus token that is the current background in light and dark mode. Check whether charts on cards and other surfaces use a different background. Write it into `design.md`
- [ ] 1.3 Add `recharts` and `react-is` to `packages/nimbus/package.json` and install with pnpm
- [ ] 1.4 Build a throwaway `BarChart` with narrow Recharts imports. Run `pnpm check:bundle-size` and `pnpm check:bundler-compat`. Record the size increase in `design.md`
- [ ] 1.5 Open https://ui.shadcn.com/charts with Playwright and take reference screenshots of the six chart types. List the visual traits (grid lines, axes, bar radius, tooltip, legend, area fill) in `design.md`, and decide how many intermediate colors are needed

## 2. Chart palette tokens (spec: `color-tokens`)

- [ ] 2.1 Write failing unit tests: (a) only palettes with a white `contrast` token are chart palettes, (b) every chart color has at least 3:1 contrast against the current background in light and dark mode, (c) a solid that already has 3:1 is unchanged, (d) hue stays close to the original solid
- [ ] 2.2 Add the build script in `packages/color-tokens`: for each chart palette and mode, adapt only the lightness of the solid (`DEFAULT`) by the smallest amount that gives 3:1 against the current background, using chroma-js `contrast()`
- [ ] 2.3 Generate the intermediate colors between the adapted solid and the background, as decided in 1.5
- [ ] 2.4 Choose the fixed default palette order for charts. Write the order into `design.md`
- [ ] 2.5 Emit the chart tokens so `--nimbus-chart-<palette>` exists with a light and a dark value, and rebuild tokens
- [ ] 2.6 Confirm the tests in 2.1 pass. Check that `ctviolet` stays almost unchanged in light mode and that `gray` and `slate` are adapted separately for each mode
- [ ] 2.7 Update `packages/color-tokens/CLAUDE.md` and the `color-tokens` docs for the new output

## 3. Shared chart foundation (spec: `nimbus-charts`)

- [ ] 3.1 Define `ChartConfig` and shared types with JSDoc on every prop, with `aria-label` required
- [ ] 3.2 Write failing unit tests for config handling: palette to CSS variable, unknown series key (skipped and warned in development), invalid palette (warned in development, first palette in production)
- [ ] 3.3 Implement the config utilities until 3.2 passes
- [ ] 3.4 Implement `ChartContainer` with a default aspect ratio, the empty state, and the `isLoading` skeleton
- [ ] 3.5 Implement `ChartTooltip` and `ChartLegend` reading the shared config, as a live region for screen readers
- [ ] 3.6 Add the slot recipe and register it in `packages/nimbus/src/theme/slot-recipes/index.ts`. Regenerate theme typings
- [ ] 3.7 Add i18n messages for the empty state text with `pnpm extract-intl`

## 4. BarChart, LineChart and AreaChart (first release for the product team)

- [ ] 4.1 Write failing stories with play functions for `BarChart`: render, stacked, empty, loading, tooltip and legend, ArrowLeft and ArrowRight, Tab focus, light and dark mode
- [ ] 4.2 Implement `BarChart` with gaps or outlines between bars until 4.1 passes
- [ ] 4.3 Write failing stories for `LineChart`, including the many-series case
- [ ] 4.4 Implement `LineChart`. Pick the series threshold for dash styles or markers and write it into the spec and docs
- [ ] 4.5 Write failing stories for `AreaChart`, including stacked
- [ ] 4.6 Implement `AreaChart`
- [ ] 4.7 Export the shared types and the three charts from `packages/nimbus/src/components/index.ts`
- [ ] 4.8 Add `*.mdx`, `*.dev.mdx` and `*.docs.spec.tsx` for the three charts (use `/create-eng-docs`)
- [ ] 4.9 Add a changeset for the three charts (consumer-facing, see `docs/changeset-conventions.md`)
- [ ] 4.10 Run `pnpm lint`, `pnpm --filter @commercetools/nimbus typecheck:dev`, `pnpm test`, and `pnpm check:bundle-size`

## 5. PieChart

- [ ] 5.1 Write failing stories for `PieChart` with `nameKey` and `valueKey`: render, empty, loading, tooltip and legend, keyboard, light and dark mode
- [ ] 5.2 Implement `PieChart` with outlines or gaps between slices
- [ ] 5.3 Add docs, docs spec, and changeset text. Export from the components index

## 6. RadarChart and RadialChart (first to move to a later change if time runs out)

- [ ] 6.1 Write failing stories for `RadarChart`
- [ ] 6.2 Implement `RadarChart`
- [ ] 6.3 Write failing stories for `RadialChart` with `nameKey` and `valueKey`
- [ ] 6.4 Implement `RadialChart`
- [ ] 6.5 Add docs, docs specs, and changeset text. Export from the components index

## 7. Final checks

- [ ] 7.1 Run the Nimbus review (`nimbus-reviewer`) on all new files and fix findings
- [ ] 7.2 Run `pnpm test`, `pnpm typecheck:strict`, `pnpm check:package-shape`, `pnpm check:bundler-compat` and `pnpm check:bundle-size`
- [ ] 7.3 Check the stories in Storybook in light and dark mode, and with the keyboard only
- [ ] 7.4 Move any chart that did not finish to a new change, and list it in the pull request
