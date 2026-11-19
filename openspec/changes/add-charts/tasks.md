## 1. Spikes: resolve open questions before building

- [x] 1.1 Color route: confirm that the step 9 solid of a palette is available
      as a CSS variable that switches with light and dark mode
      (`--nimbus-colors-<palette>-9`), so charts need no color tokens of their
      own. Written into `design.md`. Done: the chart stories read the variable
- [x] 1.2 Check the background: confirm that `bg` is `#fff` (light) and
      `#111111` (dark), and check the surfaces Nimbus uses for panels and cards.
      Done: measured against `bg`; the limits are in `design.md`
- [x] 1.3 Add `recharts@^3.10.1` and `react-is` to
      `packages/nimbus/package.json` and install with pnpm. Keep
      `minimumReleaseAgeStrict` as it is and add no `minimumReleaseAgeExclude`
      entry
- [x] 1.4 Build a throwaway `BarChart` with narrow Recharts imports. Run
      `pnpm build`, `pnpm check:bundle-size` and `pnpm check:bundler-compat`.
      Record the size change and the require-helper result in `design.md`. If
      `victory-vendor` fails the scan, decide between an alias, an external
      dependency or another version before going on
- [x] 1.5 Decide the visual traits of the six chart types (grid lines, axes, bar
      radius, tooltip, legend, area opacity, stroke width between shapes) and
      list them in `design.md`. Limit this to one short session
- [x] 1.6 Check how Recharts `PieChart` and `RadialBarChart` behave with the
      keyboard (Tab, ArrowLeft, ArrowRight, Enter). Write the result into
      `design.md`. Done: all six chart types work; animation is turned off with
      `isAnimationActive={false}`

## 2. Chart palettes (spec: `nimbus-charts`)

- [x] 2.1 Write `packages/nimbus/src/components/chart/chart.palettes.ts` by
      hand: `chartPaletteNames` (the 23 palettes with a white contrast color),
      the `ChartPalette` type and the default order (11 palettes in `design.md`,
      starting with `ctviolet`), so `config` accepts only chart palette names
- [x] 2.2 Color a series with `var(--nimbus-colors-<palette>-9)` in
      `utils/chart-config.ts`, with a unit test for the variable name and the
      default order. No change in `color-tokens`, `tokens` or
      `design-token-ts-plugin`

## 3. Shared chart foundation (spec: `nimbus-charts`)

- [x] 3.1 Create the folder `packages/nimbus/src/components/chart/` with
      `index.ts`, following `docs/file-type-guidelines/barrel-exports.md` and
      the structure in `docs/component-guidelines.md`
- [x] 3.2 Define `ChartConfig` and shared types with JSDoc on every prop, with
      `aria-label` or `aria-labelledby` required
- [x] 3.3 Write failing unit tests for config handling: palette to CSS variable,
      unknown series key (skipped and warned in development), invalid palette at
      run time (warned in development, first palette of the default order in
      production), more than 11 series (warned in development, palettes reused
      in the default order)
- [x] 3.4 Implement the config utilities until 3.3 passes
- [x] 3.5 Write a failing test for text contrast: chart text tokens have at
      least 4.5:1 against `bg` in both modes
- [x] 3.6 Implement `ChartTooltip` (announced through a polite live
      region in the chart root) and `ChartLegend` reading the shared config. Text
      uses `fg` and `fg.subtle`.
- [x] 3.7 Implement `ChartContainer` with a default aspect ratio, the empty
      state, the `isLoading` skeleton, `displayName`, and the legend rule (shown
      for two or more series)
- [x] 3.8 Add the slot recipe and register it in
      `packages/nimbus/src/theme/slot-recipes/index.ts`. Regenerate theme
      typings
- [x] 3.9 Add the `chart.i18n.ts` source file for the empty state text and run
      `pnpm extract-intl` (see `docs/file-type-guidelines/i18n.md`)
- [x] 3.10 Check that `apps/docs` and Storybook resolve `recharts` from the
      workspace (it is an external dependency of
      `packages/nimbus`), and run `pnpm check:package-shape` with a first chart
      exported. Status: Storybook resolves `recharts` (verified by the shared
      stories). `apps/docs` does not list `recharts` or `react-is`; add both
      (catalog `charts`) together with the first chart docs in task 4.9.
      `check:package-shape` can only show something once a chart is exported, so
      run it in task 4.13. `check:package-shape` also fails today on
      `nimbus-design-token-ts-plugin` and `nimbus-mcp` (publint), which this
      change does not touch Done: `apps/docs` lists `recharts` and `react-is`
      (catalog `charts`) and the docs build passes; `pnpm check:package-shape`
      with the charts exported reports no problems for `@commercetools/nimbus`
      (attw and publint pass). The overall command still fails on
      `nimbus-design-token-ts-plugin` and `nimbus-mcp`, which this change does
      not touch.

## 4. BarChart, LineChart and AreaChart (first release)

- [x] 4.1 Create the folders `bar-chart/`, `line-chart/` and `area-chart/` with
      `index.ts` and the file structure from `docs/component-guidelines.md`
- [x] 4.2 Write failing stories with play functions for `BarChart`: render,
      stacked, empty, loading, tooltip and legend, legend shown for two or more
      series, 2 px stroke between bars, role and tabIndex, ArrowLeft and
      ArrowRight, Tab focus, light and dark mode. Turn off Recharts animation in
      snapshotted stories and follow `docs/chromatic-visual-testing.md` for
      which stories get a visual snapshot
- [x] 4.3 Implement `BarChart` until 4.2 passes
- [x] 4.4 Write failing stories for `LineChart`: the same list as 4.2 (without
      stacked and bar stroke), plus the case with more than 3 series (dash style
      or marker)
- [x] 4.5 Implement `LineChart`
- [x] 4.6 Write failing stories for `AreaChart`: the same list as 4.2 (without
      bar stroke), plus the gradient fill (about 0.8 opacity at the line, about
      0.1 at the baseline) with a full-color line
- [x] 4.7 Implement `AreaChart`
- [x] 4.8 Export the shared types and the three charts from
      `packages/nimbus/src/components/index.ts`
- [x] 4.9 Add the designer `*.mdx`, the developer `*.dev.mdx` and
      `*.docs.spec.tsx` for `BarChart` (use `/create-eng-docs` and the
      `writing-designer-documentation` skill). Add the `@experimental` JSDoc tag
      on the main export and state in the docs text that a series uses the palette solid, that
      Nimbus installs `recharts` and `react-is`, and that the chart is experimental in the first release (see
      `docs/file-type-guidelines/documentation.md` and `main-component.md`
      "Lifecycle State Tag")
- [x] 4.10 Add the same three docs files for `LineChart`
- [x] 4.11 Add the same three docs files for `AreaChart`
- [x] 4.12 Add a changeset for the three charts (consumer-facing, see
      `docs/changeset-conventions.md`). Say in the text that they are
      experimental
- [x] 4.13 Run `pnpm lint`, `pnpm --filter @commercetools/nimbus typecheck:dev`,
      `pnpm test`, and `pnpm check:bundle-size`

## 5. PieChart

- [x] 5.1 Write the failing stories for `PieChart` with `nameKey` and
      `valueKey`: the same list as 4.2 (without stacked), legend always shown, 2
      px stroke between slices
- [x] 5.2 Implement `PieChart`
- [x] 5.3 Add the designer and developer docs, the docs spec, the
      `@experimental` JSDoc tag, and the changeset text (say the chart is
      experimental, as in 4.12). Export from the components index

## 6. RadarChart and RadialChart

- [x] 6.1 Write failing stories for `RadarChart`: the same list as 4.2 (without
      stacked and bar stroke)
- [x] 6.2 Implement `RadarChart`
- [x] 6.3 Write failing stories for `RadialChart` with `nameKey` and `valueKey`:
      the same list as 5.1
- [x] 6.4 Implement `RadialChart`
- [x] 6.5 Add the designer and developer docs, the docs specs, the
      `@experimental` JSDoc tag, and the changeset text (say the charts are
      experimental, as in 4.12). Export from the components index

## 7. Final checks

- [x] 7.1 Run the Nimbus review (`nimbus-reviewer`) on all new files and fix
      findings. Done: reviewed after every group (foundation, Bar/Line/Area,
      Pie/Radar/Radial) and once more as a final audit with a
      scenario-to-evidence table; all findings fixed or recorded
- [x] 7.2 Run `pnpm test`, `pnpm typecheck:strict`, `pnpm check:package-shape`,
      `pnpm check:bundler-compat` and `pnpm check:bundle-size`. Done:
      `pnpm build` (clean tree afterwards), `pnpm test` 306 files / 3894 tests,
      `pnpm typecheck:strict`, `pnpm check:package-shape` (all packages),
      `pnpm check:bundler-compat`, `pnpm check:bundle-size` (limit 5%)
- [x] 7.3 Check the stories in Storybook in light and dark mode, and with the
      keyboard only. Done: keyboard (Tab, arrows, Enter) and light/dark mode are
      covered by story tests for all six charts; all six chart types were also
      checked in a browser (light mode, plus Bar in dark mode)
- [x] 7.4 Run `pnpm openspec validate add-charts --strict`. Done:
      `pnpm openspec validate add-charts --strict` passes
- [x] 7.5 Check whether new components need a Figma Code Connect file
      (`docs/figma-code-connect-ci.md`) or an entry in the MCP data
      (`packages/nimbus-mcp`), and add them if required. Done: Figma Code
      Connect is optional (45 of 98 components have one, Meter has none) and
      needs Figma nodes for charts: follow-up. MCP data is generated from the
      docs build: no entry needed (343 MCP tests pass)
- [x] 7.6 Move any chart that did not finish to a new change, and list it in the
      pull request. Done: all six charts are finished, none moved to a later
      change

## 8. `Chart` namespace (spec: `nimbus-charts`, Chart Composition; added after review)

- [x] 8.1 Spike: check that a custom component that returns a Recharts part Done: custom components (including `defs` next to an `Area`) work as children in Recharts 3.10.1
      works as a child of a Recharts chart (Recharts 3) in Storybook, including
      `defs` next to an `Area`
- [x] 8.2 Write failing stories: mixed bar and line chart (both drawn, legend Done: 12 stories in `chart-composition.stories.tsx`; 7 mutations of the parts each fail a story
      and tooltip list both), `Chart.Root` without `series` (config keys), a
      `dataKey` that is not in `series` (nothing drawn), `Chart.Grid` and
      `Chart.Tooltip` off switches, empty and loading state, dash patterns with
      4 mixed series, stacked bars and areas, and a part outside `Chart.Root`
      (throws an error that names `Chart.Root`)
- [x] 8.3 Add `data` to the chart context. Implement `ChartPlot`, `ChartBar`, Done: parts in `chart/components/`, `Chart` in `chart/chart.tsx`
      `ChartLine`, `ChartArea`, `ChartXAxis`, `ChartGrid` and `ChartTooltipPart`
      in `chart/components/`, and `ChartRoot` (a `ChartContainer` with a public
      `series` prop). Export `Chart` from `chart/chart.tsx` with JSDoc per part,
      and from the components index
- [x] 8.4 Build `BarChart`, `LineChart` and `AreaChart` from the same series Done: the 152 existing chart stories pass unchanged
      parts, axis, grid and tooltip. Their stories and VRT must stay unchanged
      and pass
- [x] 8.5 Rewrite the shared stories (`chart.stories.tsx`) to use `Chart.*`, so Done: `chart.stories.tsx` builds its test chart from `Chart.*`
      no story imports from `recharts` except the stories of the six charts that
      check Recharts output
- [x] 8.6 Add the type tests (required props, `aria-label`, no Recharts props), Done: `chart.mdx`, `chart.dev.mdx`, `chart.docs.spec.tsx`, type tests, changeset, links from Bar, Line and Area docs. Fixed the Storybook links in the six `.dev.mdx` files (`components-barchart--docs`, not `components-bar-chart--docs`). PR description: after the push
      the designer docs `chart.mdx`, the developer docs `chart.dev.mdx` and
      `chart.docs.spec.tsx` (mixed chart example). Update the six chart docs so
      they link to `Chart` for custom charts. Update the changeset,
      `packages/nimbus/src/docs/home-installation.mdx` if needed, and the pull
      request description
- [x] 8.7 Run the checks of group 7 again: review, tests, typecheck, package Done: `pnpm build`, `pnpm test` (308 files, 3911 tests), `pnpm typecheck:strict`, `pnpm check:package-shape`, `pnpm check:bundler-compat`, `pnpm check:bundle-size` (nimbus +1.2%), `pnpm lint` (0 errors), `pnpm openspec validate add-charts --strict`
      shape, bundler compatibility, bundle size, `openspec validate`
