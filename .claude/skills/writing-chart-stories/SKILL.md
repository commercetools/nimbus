---
description: Create, update, or validate the Storybook stories (with real play functions) for a nimbus-viz chart component
argument-hint: create|update|validate ChartName (e.g. create BarChart)
---

# Writing Chart Stories Skill

You are the `@commercetools/nimbus-viz` chart testing specialist. This skill
creates, updates, and validates the `{chart}.stories.tsx` that lives beside
each chart component in `packages/nimbus-viz/src/components/{chart}/`.

## The core principle

**A chart whose story file has no `play` function has zero test coverage.**
`docs/file-type-guidelines/testing-strategy.md` is unambiguous that Storybook
stories are **the only place** component behavior is tested — charts have no
`.spec.tsx` companions (`chart/` and `selection/` do; individual chart
components don't). Most chart story files started as an 11-line stub (one
`Base` story rendering a `RegistryPreview`, no `play`); count the ones still in
that state with
`grep -L "play:" packages/nimbus-viz/src/components/*/*.stories.tsx`. This
skill's job is to close that, one chart at a time, without inventing test
claims the component doesn't actually support.

Charts are not core Nimbus components: no `.recipe`/`.slots`/`.types.ts`
split, and the sibling `docs/file-type-guidelines/stories.md` was written for
widget-shaped components (buttons, menus) with ARIA roles and discrete
variants — not SVG plots sized by `ResponsiveContainer` with data-driven
marks. This skill adapts that file's proven rules (the `StoryObj<typeof X>`
performance rule, `step()` naming discipline, no Chromatic unless told
otherwise) to what a chart actually is.

## Modes

Parse `$ARGUMENTS` for the mode; default to **create**.

- **create** — replace the stub with the full fixed story set below.
- **update** — add whichever stories from the fixed set are missing;
  preserve existing stories that already do real work.
- **validate** — check against the checklist below; report only, change
  nothing.

## Required research (all modes)

Do this before writing — the story set is derived from what the component
actually does, never from what a chart "usually" has:

1. **The component source** — `{chart}.tsx`. Read the `Props` interface and
   record: the data prop's name/type; every configurable prop (`orientation`,
   `variant`, `hue`, …); whether `ChartContainer` is called with `table` (if
   so, the keyboard "view as table" disclosure exists and is testable — see
   §2 below); whether `onDatumClick`/`onDatumHover`/`onSelectionChange` are
   wired; whether `useReducedMotion`/`useForcedColors` are called; whether it
   accepts overlay `children`.
2. **How individual marks are wired** — grep the JSX for
   `onMouseEnter`/`onMouseLeave`/`onClick` on the rendered SVG elements. As of
   this writing, marks (`<rect>`/`<circle>`/`<path>`) carry **no individual
   accessible role or name** — confirmed on `bar-chart.tsx`. This means a
   play function reaches one mark via a raw DOM query
   (`canvasElement.querySelectorAll("rect")[i]`), never `getByRole`. Verify
   this per chart rather than assuming it; if a chart you're writing stories
   for _does_ label its marks, use the accessible query instead and say so.
3. **`packages/nimbus-viz/src/chart/chart-container.tsx`** and
   **`chart/chart-frame.tsx`** — the actual accessibility mechanics your
   Accessibility story asserts against: the SVG's `role="img"` +
   `aria-label` lives in `chart-frame.tsx`; the visually-hidden "view as
   table" toggle (`aria-expanded` button revealing a `role="region"` panel)
   lives in `chart-container.tsx`.
4. **The existing `{chart}.stories.tsx`** (if any) and one neighbor chart's
   _already-upgraded_ story file (one that has been through `/chart:introspect`),
   to match voice and structure. If none exist yet, this file's snippets are
   the template.
5. **`.claude/skills/writing-chart-documentation/references/dataviz-accessibility.md`**
   — the accessibility checklist your Accessibility story must actually prove,
   not just gesture at.

## The fixed story set

Emit whichever rows apply — REQUIRED rows on every chart, CONDITIONAL rows
only when the source in step 1 actually supports them. Never add a story that
asserts a capability the component doesn't have.

| #   | Story                                    | When                                                                             | What it proves                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --- | ---------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `Base`                                   | REQUIRED                                                                         | Minimal render with realistic fixture data (reuse `RegistryPreview` for registry-backed charts, per today's stub; otherwise inline a small realistic dataset). No `play` needed — a resting visual is proven by rendering, not asserting.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2   | `Accessibility`                          | REQUIRED                                                                         | `play` function: the root `<svg>` has `role="img"` and a non-empty `aria-label`; if `ChartContainer` receives `table`, `userEvent.tab()` reaches the hidden disclosure button, activating it reveals a `role="region"` with the real row/column data — this is `TODO.md`'s `#8` capability, and this story is what actually tests it (nothing currently does)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 3   | One showcase per configurable prop group | CONDITIONAL                                                                      | e.g. `Orientation`, `Variant`, `ValueFormat` — a rendered comparison of the prop's real range, mirroring `stories.md`'s "Variants" pattern; visual only, no `play` needed unless the prop changes interactive behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 4   | `Interaction`                            | CONDITIONAL — only if `onDatumClick`/`onDatumHover`/`onSelectionChange` is wired | `play` function using `userEvent.hover`/`click` on a mark (queried per step 2's finding) with `fn()` mocks, asserting the callback fires with the right datum                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 5   | `EdgeCases`                              | REQUIRED                                                                         | Empty data (assert no crash — most charts return `null`; assert that, not just "doesn't throw"), single datum, and — for any input the component's own docs name as excluded (non-negative-only, single-series-only, …) — assert the _actual_ failure mode, not just "renders without throwing." Found piloting this on `BarChart`: a negative value doesn't crash, doesn't render obviously wrong — it draws an invisible, zero-height bar indistinguishable from a real `0`. `expect(svg).toBeInTheDocument()` would have missed that entirely and called the case covered. See `/chart:introspect`'s Lens E2 ("Boundary safety") for the plausible/implausible call and the Loud/Silent-wrong classification — a Silent-wrong result is the one worth asserting precisely, e.g. the excluded row contributes no visible mark rather than a generic "something rendered" check. |
| 6   | `Responsive`                             | REQUIRED                                                                         | Wrap in `ResponsiveContainer` (not a fixed `width`/`height` like `Base`) and render at two container sizes, proving the chart actually reads its measured size rather than being tested once at one hardcoded size                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 7   | `ReducedMotionAndForcedColors`           | CONDITIONAL — only if `useReducedMotion`/`useForcedColors` is called             | Per `stories.md`'s existing rule for core components: a media query can't be faked in the browser-mode runner, so assert the compiled CSS/behavior still ships rather than trying to simulate the mode                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

Row 3's "CONDITIONAL" is not the same as "skippable when present." If a prop
changes more than a single visual value — reordering, relayout, margin
changes, which sub-features are wired (e.g. `BarChart`'s `orientation` also
toggles whether `children` overlays are supported) — write the showcase.
Reserve skipping row 3 for props that are genuinely a single visual swap with
nothing else riding on it.

No `tags: ["vrt"]` / `chromatic: { disableSnapshot: false }` on any story.
`packages/nimbus-viz/TODO.md` records Chromatic as dropped **for nimbus-viz
specifically**, by product decision — Storybook (with `addon-a11y` and
`addon-vitest` running every story headlessly per `vitest.storybook.config.ts`)
is the agreed bar. Don't reintroduce VRT tags because the core-package
convention has them.

## File conventions

- `Meta`/`Story` typing: keep the untyped `const meta: Meta = {...}` the stub
  already uses, and write every story with its own `render`, not `args`. This
  isn't the same tradeoff `docs/file-type-guidelines/stories.md` documents for
  core components (that rule is `StoryObj<typeof Component>` vs. the more
  expensive `StoryObj<typeof meta>` — both presuppose `args`-driven stories).
  Chart stories don't use `args` at all, so neither form of that rule applies
  — the reason to stay untyped here is different: several charts are generic
  or, after `/chart:introspect`'s fixes, **overloaded**
  (`BarChart`/`ScatterPlot` today, more once `TODO.md`'s `C1` lands), and an
  overloaded/generic function doesn't reliably resolve as a `ComponentType`
  for `Meta<typeof Chart>` — verify this per chart if you're ever tempted to
  add it, don't assume it typechecks.
- **Do not wrap stories in `ChartThemeProvider` yourself.**
  `packages/nimbus-viz/.storybook/preview.tsx` already applies it globally, as
  a `decorators` entry that follows the dark-mode toolbar toggle
  (`<ChartThemeProvider mode={isDark ? "dark" : "light"}>`) — every story in
  every chart file already renders inside one. A per-story
  `ChartThemeProvider` would just double-wrap; it wouldn't break anything, but
  it's dead code that misstates where theming actually comes from. The same
  file also sets `a11y: { test: "error" }`, so `@storybook/addon-a11y`
  actively fails a story on a real violation — on top of, not instead of,
  the assertions your `Accessibility` story writes.
- For a layout-only wrapper (e.g. constraining `Responsive`'s container
  width), use a plain `<div style={{...}}>`, not a Nimbus `Box` — no existing
  `nimbus-viz` story imports from `@commercetools/nimbus`, and a chart story's
  only layout need is a sized box, not the design-system primitive.
- Import test utilities from `storybook/test` (`userEvent`, `within`,
  `expect`, `waitFor`, `fn`), matching core-package convention.
- Every `step()` name must be backed by its assertions — same rule as
  `stories.md`: don't call a step "shows tooltip on hover" if the assertion
  only checks the tooltip element exists in the DOM regardless of hover.

## Running one story file

From the repo root, against the browser project only:

```bash
pnpm vitest run --project nimbus-viz-storybook packages/nimbus-viz/src/components/{chart}/{chart}.stories.tsx
```

Run this after every edit to the file; it is the fast signal. The whole-package
`pnpm --filter @commercetools/nimbus-viz test` is the gate `/chart:introspect`
runs before committing.

## Adversarial inputs

`EdgeCase*` stories should not hand-roll their bad input. Import the shared
mutators from `src/stories/adversarial.ts` — `duplicateLabels`,
`negateEveryOther`, `allZero`, `singleDatum` — and apply them to the story's
own inline fixture. The same functions drive the generic invariant spec
(`src/selection/registry-invariants.spec.tsx`), so a story and the spec assert
the same case the same way.

## Snippets

```tsx
// Accessibility — proves role="img" + the keyboard data-table disclosure
export const Accessibility: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("SVG carries an accessible label", async () => {
      const svg = canvasElement.querySelector("svg");
      expect(svg).toHaveAttribute("role", "img");
      expect(svg).toHaveAttribute("aria-label");
      expect(svg?.getAttribute("aria-label")).not.toBe("");
    });

    await step("Data table is reachable by keyboard", async () => {
      await userEvent.tab();
      const toggle = canvas.getByRole("button", {
        name: /view data as table/i,
      });
      expect(toggle).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => {
        expect(
          canvas.getByRole("region", { name: /data table/i })
        ).toBeInTheDocument();
      });
    });
  },
};

// EdgeCases — empty data must be a deliberate null render, not an unproven claim.
// No ChartThemeProvider here — .storybook/preview.tsx already provides one globally.
export const EdgeCases: Story = {
  render: () => <BarChart width={400} height={240} data={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

// Responsive — proves ResponsiveContainer sizing actually drives the render
export const Responsive: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <ResponsiveContainer height={220}>
        {(width, height) => (
          <BarChart width={width} height={height} data={fixture} />
        )}
      </ResponsiveContainer>
    </div>
  ),
};
```

## Validate mode checklist

Report PASS/FAIL per item; fix nothing in validate mode.

- [ ] At least one `play` function exists in the file.
- [ ] An `Accessibility` story exists and actually asserts `role="img"` +
      `aria-label`, plus the data-table disclosure if `table` is wired.
- [ ] An `Interaction` story exists **iff** the component wires
      `onDatumClick`/`onDatumHover`/`onSelectionChange` — and does **not**
      exist claiming interaction the component doesn't support.
- [ ] An `EdgeCases` story exists and asserts the empty-data behavior, not
      just that it "doesn't throw" by omission.
- [ ] A `Responsive` story exists using `ResponsiveContainer`, not a second
      copy of `Base`'s fixed dimensions.
- [ ] No `tags: ["vrt"]` anywhere.
- [ ] `Meta`/`StoryObj` are not parameterized with `typeof meta`.
- [ ] Every `step()` name is backed by its assertions.
- [ ] Any story that renders 2+ instances of the chart passes a distinct
      `ariaLabel` to each (axe `landmark-unique`; bug class `BC-7`).
- [ ] `EdgeCase*` stories that need bad input import it from
      `src/stories/adversarial.ts` rather than hand-rolling it.

## Common mistakes

| Mistake                                                                                                                | Fix                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Querying a mark with `getByRole` when it has no accessible name                                                        | Use a raw DOM query and note the gap (individual mark labeling is `TODO.md`'s `D1-rest`, not yet done anywhere)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Adding an `Interaction` story for a chart with no `onDatumClick`/`onDatumHover`                                        | Don't — that asserts a capability that doesn't exist. Flag the missing capability upstream (in `/chart:introspect`'s audit) instead                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Tagging a story `vrt` "to be consistent with core Nimbus"                                                              | nimbus-viz dropped Chromatic by product decision — this is the one Nimbus convention that does **not** carry over                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Asserting reduced-motion by trying to fake `matchMedia` in the browser runner                                          | Assert the compiled rule/behavior instead, per the same rule core stories already follow                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| One `EdgeCases` story that only checks "no error thrown"                                                               | Assert the actual documented empty-state behavior (usually a `null` render) — "didn't crash" is not the same claim as "renders nothing"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Two chart instances in one story (e.g. an `Orientation` comparison) sharing the same data with no explicit `ariaLabel` | Every chart auto-generates a default `ariaLabel` from its data shape (e.g. `` `Bar chart of ${rows.length} categories` `` on `bar-chart.tsx`), so two instances of the same data collide on an identical label — each renders its own visually-hidden data-table region with `role="region"` + that label, and axe's `landmark-unique` fails on the duplicate. Pass a distinct, descriptive `ariaLabel` to each instance whenever a story puts 2+ of the same chart on one page (found on `bar-chart.stories.tsx`'s `Orientation` story; not an `isolate: false` accumulation issue — reproduces from that one story alone) |
| Asserting that an invalid or negative `r`/`width`/`height` removes the mark from the DOM                               | It does not. SVG keeps the element and simply does not paint it. Assert the attribute value (`Number(el.getAttribute("r"))` is negative / zero), not `querySelectorAll(...).length` (found on `bubble-chart.stories.tsx`)                                                                                                                                                                                                                                                                                                                                                                                                   |
| Counting `<circle>` elements to count bubbles or points                                                                | Size legends render reference `<circle>`s with `fill="none"`. Filter them out (`.filter((c) => c.getAttribute("fill") !== "none")`) before counting or indexing marks                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Assuming DOM order equals data order                                                                                   | Several charts sort marks before drawing (bubbles largest-first so small ones stay hoverable). Locate a mark by its datum (attribute values, or `toContainEqual(call.datum)` on the callback payload), not by its index in `points`                                                                                                                                                                                                                                                                                                                                                                                         |
| Asserting a too-large mark "draws wider than the plot"                                                                 | An embedded `<svg>` has browser-default `overflow: hidden`; overrun is clipped, not drawn. Assert the attribute (e.g. `width` greater than `innerWidth`) and document clipping, not overdraw (bug class `BC-6`, found on `funnel-chart`)                                                                                                                                                                                                                                                                                                                                                                                    |
| `userEvent.hover` on a wrapping `<g>` or the `<svg>` to trigger a mark's hover                                         | Target the mark element itself (`rect`/`circle`/`path`); the handlers live there. Hovering a parent that has no handler fires nothing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
