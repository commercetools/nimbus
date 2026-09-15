# nimbus-viz — chart lifecycle criteria

Each chart's `.mdx` frontmatter carries a `lifecycleState`
(`Experimental | Alpha | Beta | Stable | Deprecated | EOL`). This file says what
a chart must have to hold each state, as checks that can be run mechanically.
`/chart:introspect` Step 9 applies them and moves a chart **one notch per
pass**; a human decides `Stable`.

Every state includes the states below it.

## Experimental

The chart exists and is reachable.

- [ ] `src/components/{chart}/` has `{chart}.tsx`, `{chart}.mdx`,
      `{chart}.stories.tsx`, `index.ts`.
- [ ] Exported from `src/index.ts` (or via `src/selection/index.ts` for
      `DataTable`) — `src/components/catalog.spec.ts` enforces this.
- [ ] `.mdx` frontmatter validates (`exportName` matches the real export).

## Alpha

The chart has been through one full hardening pass and has real tests.

- [ ] One `/chart:introspect` pass completed and committed.
- [ ] `{chart}.stories.tsx` has the full fixed story set from
      `writing-chart-stories` — at minimum `Base`, `Accessibility` (with a play
      function proving `role="img"`, a non-empty label, and the keyboard
      data-table disclosure where `table` is wired), `EdgeCase*` for empty data
      and for every excluded input the docs name, `Responsive`, and
      `Interaction` iff callbacks are wired.
- [ ] `writing-chart-documentation validate {Chart}` passes.
- [ ] No open 🔴 finding from the pass.
- [ ] Every `detect` in `docs/bug-classes.md` prints nothing for this chart, or
      the hit is listed under that row's Status as a legitimate exception or as
      open with a `KNOWN_GAPS` entry in
      `src/selection/registry-invariants.spec.tsx`.

Check quickly:

```bash
grep -c "export const Accessibility" packages/nimbus-viz/src/components/{chart}/{chart}.stories.tsx   # 1
grep -n "^lifecycleState:" packages/nimbus-viz/src/components/{chart}/{chart}.mdx
```

## Beta

The chart is correct under bad input, used somewhere real, and speaks the shared
contracts.

- [ ] No `KNOWN_GAPS` entry names this chart's base component; the registry
      invariant spec is green for it under every applicable mutation.
- [ ] Rendered on at least one `apps/viz-dashboard` page or in a `src/recipes/*`
      kit with realistic data.
- [ ] If it has hoverable marks: props `extends DatumInteractionProps<Payload>`
      (`src/chart/interaction.ts`) and an `Interaction` story proves the
      payload.
- [ ] If it has a value axis: `valueFormat` / `useChartFormatters()` threaded
      (`TODO.md` A2-tail) and the axis domain comes from `valueDomain()`; if it
      has a band axis: `bandByIndex()`.
- [ ] Data-table fallback wired (`table` passed to `ChartContainer`) unless the
      chart is itself text (`StatCard`, `DataTable`) or a glyph (`Sparkline`).
- [ ] Every prop has TSDoc (the `<PropsTable>` shows it).

Check quickly:

```bash
grep -n "{BaseComponent}" packages/nimbus-viz/src/selection/registry-invariants.spec.tsx    # no KNOWN_GAPS line
grep -lE "<{ExportName}([^A-Za-z0-9]|$)" apps/viz-dashboard/src/pages/*.tsx                 # at least one page
grep -n "extends DatumInteractionProps\|table={" packages/nimbus-viz/src/components/{chart}/{chart}.tsx
```

## Stable

The API is frozen for the 1.x line. A human confirms this state; the loop never
sets it.

- [ ] `@experimental` removed from the component's TSDoc.
- [ ] Every exported type of the chart has TSDoc; `.mdx` "Limitations" reviewed
      against the source in the same pass.
- [ ] A changeset entry describes the chart from the consumer's perspective
      (`docs/changeset-conventions.md`).
- [ ] One full `/auto-optimize-viz` cycle has passed since the last breaking
      change to its props.

## Deprecated / EOL

Set by hand when a chart is superseded. The `.mdx` names the replacement in
"When to use" and "Related charts"; the catalog entry stays until EOL so the
docs route keeps resolving.
