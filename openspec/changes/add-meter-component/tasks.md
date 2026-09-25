## 1. Scaffold component structure

- [x] 1.1 Create `packages/nimbus/src/components/meter/` with shell files:
      `meter.tsx` (exported empty `Meter` + `displayName`), `meter.types.ts`,
      `meter.recipe.ts`, `meter.slots.tsx`, `utils/get-meter-segments.ts`,
      `constants/meter.constants.ts`, `meter.stories.tsx`, `index.ts` (barrel
      exporting component + types). **Done when:** files exist, `index.ts`
      re-exports `meter` and `meter.types`, and `typecheck:dev` passes.
- [x] 1.2 Register `nimbusMeter: meterSlotRecipe` in
      `packages/nimbus/src/theme/slot-recipes/index.ts` and run
      `pnpm --filter @commercetools/nimbus build-theme-typings`. **Done when:**
      `SlotRecipeProps<"nimbusMeter">` resolves in types.

## 2. Failing tests first (TDD)

- [x] 2.1 Write unit tests `utils/get-meter-segments.spec.ts` for
      `getMeterSegments`: proportional widths, clamping above max / below min,
      negative → 0, overflow cut at 100%, `min === max` → 0%, empty array.
      **Done when:** tests exist and fail.
- [x] 2.2 Write story play functions in `meter.stories.tsx` covering every
      scenario in `specs/nimbus-meter/spec.md`: role + min/max/now, custom range
      width, not focusable (Tab skips it), visible label + `aria-labelledby`,
      `aria-label` in `minimal`, percent / unit / `valueLabel` text, clamping,
      segments widths, total > max, negative, zero segment in legend, empty
      segments, exactly one `role="meter"`, summary `aria-valuetext`, no nested
      meter/progressbar roles, legend item count + order + `aria-hidden`, no
      legend for single value, `colorPalette` on meter and segment, default
      colors differ between adjacent segments, stacked / inline / minimal
      layouts, ref points to the meter element. **Done when:**
      `pnpm test:storybook:dev packages/nimbus/src/components/meter/meter.stories.tsx`
      runs and the tests fail for the expected reason (missing implementation,
      not syntax errors).

## 3. Implementation

- [x] 3.1 Implement `meter.types.ts` (skill: `writing-types`): recipe props
      (`size`, `layout`), slot props, `MeterSegment`, and public `MeterProps` as
      a discriminated union (`value` XOR `segments`), `aria-label` required when
      `label` is absent. JSDoc on every public prop with defaults. **Done
      when:** a story that passes both `value` and `segments` is a type error,
      and `typecheck:dev` passes.
- [x] 3.2 Implement `meter.recipe.ts` (skill: `writing-recipes`): slots
      `root, label, value, track, segment, legend, legendItem,     legendSwatch`;
      sizes `2xs` / `md` and layouts matching `ProgressBar`; flat
      `colorPalette.9` fill; 2px gap between segments; width transition disabled
      under `prefers-reduced-motion`; default segment color sequence. **Done
      when:** no gradients or keyframe animations are used, and every sequence
      color is ≥ 3:1 against the track in light and dark themes (record the
      measured ratios in the PR).
- [x] 3.3 Implement `meter.slots.tsx` (skill: `writing-slots`) with
      `createSlotRecipeContext({ key: "nimbusMeter" })`. **Done when:** one slot
      component per recipe slot, typed with the slot props.
- [x] 3.4 Implement `getMeterSegments` in `utils/get-meter-segments.ts` (skill:
      `writing-utils-and-constants`). **Done when:** all tests from 2.1 pass.
- [x] 3.5 Implement `meter.tsx` (skill: `writing-main-component`) on React Aria
      Components `<Meter>`: single value as one internal segment, summary
      `aria-valuetext` via `useNumberFormatter` + `Intl.ListFormat`, legend only
      in segment mode with `aria-hidden="true"`, dev warnings for missing name /
      overflow / negative values, `extractStyleProps`, ref forwarding. Modular
      Chakra imports only. **Done when:** all play functions from 2.2 pass.
- [x] 3.6 Export from `packages/nimbus/src/components/index.ts`. **Done when:**
      `import { Meter } from "@commercetools/nimbus"` works in the stories.
- [x] 3.7 Developer documentation (skill: `writing-developer-documentation`):
      `meter.mdx`, `meter.dev.mdx`, `meter.docs.spec.tsx` (consumer test
      examples: find the meter by role, read `aria-valuenow` /
      `aria-valuetext`). **Done when:** `meter.docs.spec.tsx` passes and
      examples cover single value, units, segments, and color.
- [x] 3.8 Designer documentation (skill: `writing-designer-documentation`):
      `meter.guidelines.mdx` (Meter vs ProgressBar, when to use segments,
      recommended max ~5 segments, color guidance) and `meter.a11y.mdx` (role,
      labelling, summary text, legend decision). **Done when:** both files exist
      and the Meter-vs-ProgressBar section quotes the APG rule.
- [x] 3.9 Add a minor changeset per `docs/changeset-conventions.md`. **Done
      when:** `pnpm changeset:status` lists `@commercetools/nimbus` minor.
- [x] 3.10 Run lint and type checks. **Done when:** `pnpm lint` and
      `pnpm --filter @commercetools/nimbus typecheck:dev` report no errors.
- [x] 3.11 Run the full test suite. **Done when:** `pnpm test:dev` passes.

## 4. Instrument for Chromatic (VRT)

- [x] 4.1 Audit the finished stories per `docs/chromatic-visual-testing.md` and
      opt each real visual state in with `tags: ["vrt"]` plus
      `parameters: { chromatic: { disableSnapshot: false } }`. Derive the list
      from the **recipe** (sizes, layouts, colorPalette, segment mode, legend),
      not from story names. **Done when:** - Every state the recipe paints
      differently is visible in some snapshotted frame: a `SmokeTest` matrix of
      size × layout × colorPalette, and a `Segments` showcase with 1, 2 and 4
      segments (including a zero-value segment and an overflow case). - States a
      matrix cannot hold have their own snapshotted story (none expected for
      focus or overlays, because Meter is not interactive — state this in the
      meta note). - Behavior-only stories stay un-snapshotted (project default),
      and any visual state deliberately not snapshotted names where its visual
      is covered. - Snapshotted stories are deterministic: fixed values, no live
      data, no focus ring, width transition finished or disabled.

## 5. Validation

- [x] 5.1 `pnpm --filter @commercetools/nimbus typecheck:dev` passes, then after
      `pnpm build:packages`, `pnpm typecheck:strict` passes.
- [x] 5.2
      `pnpm test:storybook:dev packages/nimbus/src/components/meter/meter.stories.tsx`
      passes; `utils/get-meter-segments.spec.ts` and `meter.docs.spec.tsx` pass.
- [x] 5.3 `pnpm lint` passes.
- [x] 5.4 Documentation complete: `.mdx`, `.dev.mdx`, `.guidelines.mdx`,
      `.a11y.mdx`, `.docs.spec.tsx` exist and match the implemented API.
- [x] 5.5 `Meter` and its types are exported from the `packages/nimbus` barrel.
- [x] 5.6 VRT instrumented: at least one story opts in, and the `meta` note
      explains why no focus/overlay snapshots exist.
- [x] 5.7 Run nimbus-reviewer on the component folder; resolve all MUST-level
      findings.
- [ ] 5.8 Manual screen-reader check (VoiceOver + NVDA) of a segmented meter;
      record the result for Open Question 1 in `design.md`.
- [x] 5.9 `pnpm openspec validate add-meter-component --strict` passes.
