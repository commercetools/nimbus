# Slider Visual Variants + Thumb Centering Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a cosmetic `variant` prop (`solid` | `outline` | `minimal` |
`enclosed`) to the Slider slot recipe — applying to both `Slider` and
`RangeSlider` — and fix the thumb's cross-axis mis-centering.

**Architecture:** All work lives in `slider.recipe.ts` (a Chakra
`defineSlotRecipe`) plus its stories and docs. The `variant` is purely
presentational: it composes with the existing `size` and `orientation` variants
and never reaches React Aria. Dimensional variant deltas are applied on the
consuming slot as `calc()` against the existing `--slider-thumb-size` CSS var,
so `size` scaling is preserved and the two variant axes never race over the same
var. The thumb-centering fix supplies the cross-axis inset
(`top`/`insetInlineStart`) that React Aria intentionally leaves to CSS.

**Tech Stack:** React 19, React Aria Components 1.19, Chakra UI v3 slot recipes,
Storybook 8 (play-function tests in headless Chromium), Vitest.

## Global Constraints

- **No barrel imports from `@chakra-ui/react`** — use modular subpath imports
  (e.g. `@chakra-ui/react/styled-system`). (This plan edits
  `.recipe.ts`/`.stories.tsx`/`.mdx` only; no new Chakra imports are needed, but
  honor this if adding any.)
- **Variant names are verbatim from the mockup:** `solid`, `outline`, `minimal`,
  `enclosed` (NOT `outlined`). Default is `solid`.
- **`solid` must reproduce today's exact look** — existing consumers see zero
  visual change.
- **No changes to `slider.types.ts`** — `variant` flows automatically via
  `SlotRecipeProps<"nimbusSlider">` once the recipe declares it and theme
  typings are regenerated.
- **Tokens only** — no new design tokens; reuse existing token paths
  (`colorPalette.*`, `neutral.*`, `critical.*`, `spacing.*`, `shadow`,
  `solid-25`/`solid-50`).
- **TDD workflow / test command:** run story tests against **source** with
  `pnpm test:dev <path-to-stories>` (no build required). Regenerate recipe
  typings with `pnpm --filter @commercetools/nimbus build-theme-typings`. Dev
  typecheck: `pnpm --filter @commercetools/nimbus typecheck:dev`.

---

## File Structure

- **Modify** `packages/nimbus/src/components/slider/slider.recipe.ts` — add
  cross-axis thumb centering (Task 1) and the `variant` variant group +
  invalid-border robustness (Task 2).
- **Modify** `packages/nimbus/src/components/slider/slider.stories.tsx` — add
  `ThumbCentering` story (Task 1) and `Variants` story (Task 2).
- **Modify** `packages/nimbus/src/components/slider/range-slider.stories.tsx` —
  add `Variants` story (Task 3).
- **Modify** `packages/nimbus/src/components/slider/slider.dev.mdx` — add a
  "Visual variants" section (Task 3).
- **Modify** `packages/nimbus/src/components/slider/slider.docs.spec.tsx` — add
  a variant-rendering consumer test (Task 3).
- **Create** `.changeset/slider-visual-variants.md` — consumer-facing release
  note (Task 3).

No `slider-base.tsx` change is needed: `variant` is not destructured there, so
it stays in `restProps` and is picked up by
`recipe.splitVariantProps({ size, ...restProps })` once the recipe declares it.

---

### Task 1: Thumb cross-axis centering fix

**Files:**

- Modify: `packages/nimbus/src/components/slider/slider.recipe.ts` (the `thumb`
  slot in `base`)
- Test: `packages/nimbus/src/components/slider/slider.stories.tsx` (new
  `ThumbCentering` story)

**Interfaces:**

- Consumes: nothing new.
- Produces: no API change. Adds CSS-only centering so the thumb visually centers
  on the track cross-axis in both orientations.

- [ ] **Step 1: Write the failing test**

Add this story to `packages/nimbus/src/components/slider/slider.stories.tsx`
(append after the existing `Vertical` story). It uses real layout geometry
(`getBoundingClientRect`) — story tests run in a real browser, so this is
reliable:

```tsx
/**
 * Regression guard for thumb cross-axis centering. React Aria positions the
 * thumb on the MAIN axis only (`left` for horizontal, `top` for vertical) plus
 * a `translate(-50%, -50%)`, and leaves the CROSS axis to CSS. Before the fix
 * the recipe never set the cross axis, so the translate pulled the thumb half a
 * thumb off-center (up on horizontal, inline-start on vertical).
 */
export const ThumbCentering: Story = {
  render: () => (
    <>
      <div data-testid="h">
        <Slider aria-label="Horizontal" defaultValue={50} />
      </div>
      <div data-testid="v" style={{ height: 200 }}>
        <Slider
          aria-label="Vertical"
          defaultValue={50}
          orientation="vertical"
        />
      </div>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const center = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const trackOf = (id: string) =>
      canvasElement.querySelector(`[data-testid="${id}"] [data-slot="track"]`)!;
    const thumbOf = (id: string) =>
      canvasElement.querySelector(`[data-testid="${id}"] [data-slot="thumb"]`)!;

    await step("horizontal thumb centers vertically on the track", async () => {
      const dy = Math.abs(center(thumbOf("h")).y - center(trackOf("h")).y);
      await expect(dy).toBeLessThanOrEqual(1.5);
    });

    await step("vertical thumb centers horizontally on the track", async () => {
      const dx = Math.abs(center(thumbOf("v")).x - center(trackOf("v")).x);
      await expect(dx).toBeLessThanOrEqual(1.5);
    });
  },
};
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
`pnpm test:dev packages/nimbus/src/components/slider/slider.stories.tsx -t "ThumbCentering"`
Expected: FAIL — the centering deltas exceed 1.5px (thumb is off by ~half its
height/width).

- [ ] **Step 3: Add cross-axis centering to the thumb slot**

In `slider.recipe.ts`, inside `base.thumb`, add the cross-axis inset. Insert
`top: "50%"` after the `focusRing: "outside"` line, and add a
vertical-orientation override. The thumb IS a React Aria element carrying
`data-orientation`, so the self-selector `&[data-orientation="vertical"]` works
directly (unlike the tick, which needs ancestor scoping):

```ts
    thumb: {
      boxSize: "var(--slider-thumb-size)",
      borderRadius: "full",
      backgroundColor: "neutral.1",
      border: "solid-50",
      borderColor: "colorPalette.9",
      transition: "background-color 0.15s, transform 0.15s",
      focusRing: "outside",

      // React Aria positions the thumb on the main axis only (inline `left`
      // for horizontal, `top` for vertical) and defers cross-axis centering to
      // CSS. Supply it here; React Aria's inline main-axis value wins over
      // these via inline-style specificity, so this only fills the cross axis
      // and stays RTL-safe.
      top: "50%",
      '&[data-orientation="vertical"]': {
        insetInlineStart: "50%",
      },

      "&[data-hovered='true']": {
        backgroundColor: "colorPalette.2",
      },
      // ...rest of the thumb block unchanged...
```

Leave everything below (`data-hovered`, `data-dragging`, `[data-invalid]`)
exactly as-is.

- [ ] **Step 4: Run the test to verify it passes**

Run:
`pnpm test:dev packages/nimbus/src/components/slider/slider.stories.tsx -t "ThumbCentering"`
Expected: PASS (both steps).

- [ ] **Step 5: Run the full slider story suite to confirm no regression**

Run: `pnpm test:dev packages/nimbus/src/components/slider/slider.stories.tsx`
Expected: PASS — all existing stories (Base, Vertical, VerticalWithTicks, Sizes,
WithTicks, Disabled, FormattedValue, WithFormField) plus ThumbCentering.

- [ ] **Step 6: Commit**

```bash
git add packages/nimbus/src/components/slider/slider.recipe.ts packages/nimbus/src/components/slider/slider.stories.tsx
git commit -m "fix(slider): center thumb on the track cross-axis"
```

---

### Task 2: Add the `variant` prop to the recipe + Slider variant stories

**Files:**

- Modify: `packages/nimbus/src/components/slider/slider.recipe.ts` (add
  `variant` to `variants` + `defaultVariants`; make the invalid thumb border
  robust)
- Test: `packages/nimbus/src/components/slider/slider.stories.tsx` (new
  `Variants` story)

**Interfaces:**

- Consumes: the `base` thumb centering from Task 1.
- Produces: `variant?: "solid" | "outline" | "minimal" | "enclosed"` on
  `SliderProps` and `RangeSliderProps` (via regenerated `NimbusSliderVariant`).
  Default `"solid"`. Slots affected: `track`, `fill`, `thumb`.

- [ ] **Step 1: Write the failing test**

Add this story to `slider.stories.tsx` (append after `ThumbCentering`). Each
variant is wrapped in a `data-testid` div; assertions key off distinguishing
computed styles, comparing against `solid` as the baseline:

```tsx
/** All four visual variants. Assertions lock each variant's distinguishing treatment. */
export const Variants: Story = {
  render: () => (
    <>
      <div data-testid="solid">
        <Slider aria-label="Solid" variant="solid" defaultValue={60} />
      </div>
      <div data-testid="outline">
        <Slider aria-label="Outline" variant="outline" defaultValue={45} />
      </div>
      <div data-testid="minimal">
        <Slider aria-label="Minimal" variant="minimal" defaultValue={80} />
      </div>
      <div data-testid="enclosed">
        <Slider aria-label="Enclosed" variant="enclosed" defaultValue={75} />
      </div>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const track = (id: string) =>
      canvasElement.querySelector(
        `[data-testid="${id}"] [data-slot="track"]`
      ) as HTMLElement;
    const trackH = (id: string) =>
      parseFloat(getComputedStyle(track(id)).height);

    await step("renders one slider per variant", async () => {
      await expect(
        canvasElement.querySelectorAll('[role="slider"]')
      ).toHaveLength(4);
    });

    await step(
      "outline track is transparent (bordered, not filled)",
      async () => {
        await expect(getComputedStyle(track("outline")).backgroundColor).toBe(
          "rgba(0, 0, 0, 0)"
        );
      }
    );

    await step("minimal track is a hairline, thinner than solid", async () => {
      await expect(trackH("minimal")).toBeLessThan(trackH("solid"));
    });

    await step(
      "enclosed track is a thick bar, thicker than solid",
      async () => {
        await expect(trackH("enclosed")).toBeGreaterThan(trackH("solid"));
      }
    );
  },
};
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
`pnpm test:dev packages/nimbus/src/components/slider/slider.stories.tsx -t "Variants"`
Expected: FAIL — the recipe has no `variant` group yet, so `variant="outline"`
has no effect (track stays `neutral.6`, not transparent) and all track heights
are equal.

- [ ] **Step 3: Add the `variant` variant group to the recipe**

In `slider.recipe.ts`, add a `variant` key inside `variants` (alongside `size`).
Insert it after the `size` block. `solid` is empty (base look); the others
override only appearance/dimension:

```ts
    variant: {
      // Base look — no overrides. Declared so `solid` is a valid, default value.
      solid: {},

      // Transparent, bordered track and hollow (bordered) progress; thumb keeps
      // the base white-with-colored-border treatment.
      outline: {
        track: {
          backgroundColor: "transparent",
          border: "solid-25",
          borderColor: "colorPalette.7",
        },
        fill: {
          backgroundColor: "transparent",
          border: "solid-25",
          borderColor: "colorPalette.9",
        },
      },

      // Ultra-thin hairline track with a small solid colored thumb dot.
      // Track/fill thickness is set directly on the slot (not via the shared
      // size var) so it does not race with the `size` variant group.
      minimal: {
        track: {
          height: "2px",
          '&[data-orientation="vertical"]': { width: "2px", height: "100%" },
        },
        fill: {
          height: "2px",
          '&[data-orientation="vertical"]': { width: "2px", height: "auto" },
        },
        thumb: {
          boxSize: "calc(var(--slider-thumb-size) * 0.6)",
          backgroundColor: "colorPalette.9",
          border: "none",
        },
      },

      // Thick, contained "bar" (iOS-style): track as tall as the thumb, and a
      // shadowed white thumb inset so it sits inside the bar. Sizing keys off
      // the existing --slider-thumb-size var so it still scales with `size`.
      enclosed: {
        track: {
          height: "var(--slider-thumb-size)",
          '&[data-orientation="vertical"]': {
            width: "var(--slider-thumb-size)",
            height: "100%",
          },
        },
        fill: {
          height: "var(--slider-thumb-size)",
          '&[data-orientation="vertical"]': {
            width: "var(--slider-thumb-size)",
            height: "auto",
          },
        },
        thumb: {
          boxSize: "calc(var(--slider-thumb-size) - {spacing.100})",
          border: "none",
          shadow: "1",
        },
      },
    },
```

- [ ] **Step 4: Make the invalid thumb border robust across variants**

`minimal` and `enclosed` set `border: "none"` on the thumb, which would swallow
the invalid state (borderColor alone can't show without a width). In
`base.thumb`, update the invalid selector to also restore a border width.
Change:

```ts
      "[data-invalid='true'] &": {
        borderColor: "critical.7",
      },
```

to:

```ts
      // Re-assert the border width too (not just color): the `minimal` and
      // `enclosed` variants drop the thumb border, and borderColor alone would
      // be invisible without a width to paint.
      "[data-invalid='true'] &": {
        border: "solid-50",
        borderColor: "critical.7",
      },
```

(`solid` already uses `border: "solid-50"`, so this is a no-op for it.)

- [ ] **Step 5: Add `variant` to `defaultVariants`**

In `slider.recipe.ts`, change:

```ts
  defaultVariants: {
    size: "md",
  },
```

to:

```ts
  defaultVariants: {
    size: "md",
    variant: "solid",
  },
```

- [ ] **Step 6: Regenerate recipe theme typings**

Run: `pnpm --filter @commercetools/nimbus build-theme-typings` Expected:
completes without error; `NimbusSliderVariant` now includes
`variant?: "solid" | "outline" | "minimal" | "enclosed"` so the `variant` prop
type-checks.

- [ ] **Step 7: Run the Variants test to verify it passes**

Run:
`pnpm test:dev packages/nimbus/src/components/slider/slider.stories.tsx -t "Variants"`
Expected: PASS (all four steps).

- [ ] **Step 8: Verify dev typecheck is clean**

Run: `pnpm --filter @commercetools/nimbus typecheck:dev` Expected: PASS —
`variant="outline"` etc. are now valid props.

- [ ] **Step 9: Commit**

```bash
git add packages/nimbus/src/components/slider/slider.recipe.ts packages/nimbus/src/components/slider/slider.stories.tsx
git commit -m "feat(slider): add solid/outline/minimal/enclosed visual variants"
```

---

### Task 3: RangeSlider variant story, docs, and changeset

**Files:**

- Test: `packages/nimbus/src/components/slider/range-slider.stories.tsx` (new
  `Variants` story)
- Modify: `packages/nimbus/src/components/slider/slider.dev.mdx` (new "Visual
  variants" section)
- Modify: `packages/nimbus/src/components/slider/slider.docs.spec.tsx` (new
  variant-rendering test)
- Create: `.changeset/slider-visual-variants.md`

**Interfaces:**

- Consumes: the `variant` prop from Task 2 (shared recipe → available on
  `RangeSlider` too).
- Produces: proof that `variant` applies to `RangeSlider`, plus consumer-facing
  docs and a release note.

- [ ] **Step 1: Write the failing RangeSlider variant test**

Add to `range-slider.stories.tsx` (append after `Base`):

```tsx
/** The shared slot recipe means every visual variant applies to RangeSlider too. */
export const Variants: Story = {
  render: () => (
    <>
      <div data-testid="rs-outline">
        <RangeSlider
          aria-label="Outline range"
          variant="outline"
          defaultValue={[20, 60]}
        />
      </div>
      <div data-testid="rs-enclosed">
        <RangeSlider
          aria-label="Enclosed range"
          variant="enclosed"
          defaultValue={[30, 70]}
        />
      </div>
    </>
  ),
  play: async ({ canvasElement, step }) => {
    const track = (id: string) =>
      canvasElement.querySelector(
        `[data-testid="${id}"] [data-slot="track"]`
      ) as HTMLElement;

    await step("each range slider still renders two thumbs", async () => {
      await expect(
        canvasElement.querySelectorAll('[role="slider"]')
      ).toHaveLength(4);
    });

    await step(
      "outline variant applies to RangeSlider (transparent track)",
      async () => {
        await expect(
          getComputedStyle(track("rs-outline")).backgroundColor
        ).toBe("rgba(0, 0, 0, 0)");
      }
    );

    await step(
      "enclosed variant applies to RangeSlider (thick bar)",
      async () => {
        const enclosedH = parseFloat(
          getComputedStyle(track("rs-enclosed")).height
        );
        const outlineH = parseFloat(
          getComputedStyle(track("rs-outline")).height
        );
        await expect(enclosedH).toBeGreaterThan(outlineH);
      }
    );
  },
};
```

- [ ] **Step 2: Run to verify it passes (recipe already implemented in Task 2)**

Run:
`pnpm test:dev packages/nimbus/src/components/slider/range-slider.stories.tsx -t "Variants"`
Expected: PASS — because `RangeSlider` shares `slider.recipe.ts`, the variant
already works. (This is a coverage/regression story, not a new red; if it fails,
the recipe change from Task 2 did not reach the shared slots and must be
revisited.)

- [ ] **Step 3: Add the docs "Visual variants" section**

In `slider.dev.mdx`, insert this section immediately after the
`### Size options` block (before `### Orientation`):

````mdx
### Visual variants

`variant` changes the track/progress/thumb treatment. `solid` (default) is the
standard filled track; `outline` uses a transparent, bordered track; `minimal`
is an ultra-thin hairline with a small dot thumb; `enclosed` is a thick,
contained bar with the thumb inset inside it.

```jsx live-dev
<Stack>
  <Slider aria-label="Solid" variant="solid" defaultValue={60} />
  <Slider aria-label="Outline" variant="outline" defaultValue={45} />
  <Slider aria-label="Minimal" variant="minimal" defaultValue={80} />
  <Slider aria-label="Enclosed" variant="enclosed" defaultValue={75} />
</Stack>
```
````

If `Stack` is not already imported in the doc's `### Import` block, use whatever
wrapping element the neighboring `live-dev` examples use (check the
`### Size options` example and match it — e.g. a fragment with block-level
`<Slider>`s). Do not introduce a new import solely for this example.

- [ ] **Step 4: Add a consumer variant-rendering test to
      `slider.docs.spec.tsx`**

Append this `describe` block at the end of `slider.docs.spec.tsx` (match the
existing import style — `Slider` is already imported at the top of the file):

```tsx
/**
 * @docs-section visual-variants
 * @docs-description Each visual variant renders an operable slider.
 */
describe("Slider - Visual variants", () => {
  it.each(["solid", "outline", "minimal", "enclosed"] as const)(
    "renders an operable slider for the %s variant",
    (variant) => {
      render(
        <Slider
          aria-label={`${variant} slider`}
          variant={variant}
          defaultValue={50}
        />
      );
      expect(screen.getByRole("slider")).toHaveValue("50");
    }
  );
});
```

- [ ] **Step 5: Run the docs.spec unit test to verify it passes**

Run: `pnpm test:dev packages/nimbus/src/components/slider/slider.docs.spec.tsx`
Expected: PASS — including the new "Visual variants" block (4 cases) alongside
the existing describes.

- [ ] **Step 6: Create the changeset**

Create `.changeset/slider-visual-variants.md`:

```md
---
"@commercetools/nimbus": minor
---

**Slider / RangeSlider**: add a `variant` prop with four visual treatments —
`solid` (default, the existing look), `outline` (transparent bordered track and
hollow progress), `minimal` (ultra-thin hairline track with a small dot thumb),
and `enclosed` (a thick, contained bar with the thumb inset inside it, iOS
style). Applies to both `Slider` and `RangeSlider`.

Also fixes the thumb rendering slightly off-center on the track — it now centers
correctly on the cross-axis in both horizontal and vertical orientations.
```

- [ ] **Step 7: Full slider verification**

Run both story suites against source and the dev typecheck:

```bash
pnpm test:dev packages/nimbus/src/components/slider/slider.stories.tsx
pnpm test:dev packages/nimbus/src/components/slider/range-slider.stories.tsx
pnpm test:dev packages/nimbus/src/components/slider/slider.docs.spec.tsx
pnpm --filter @commercetools/nimbus typecheck:dev
```

Expected: all PASS.

- [ ] **Step 8: Commit**

```bash
git add packages/nimbus/src/components/slider/range-slider.stories.tsx \
        packages/nimbus/src/components/slider/slider.dev.mdx \
        packages/nimbus/src/components/slider/slider.docs.spec.tsx \
        .changeset/slider-visual-variants.md
git commit -m "docs(slider): document visual variants + add RangeSlider/consumer coverage"
```

---

## Self-Review

**Spec coverage:**

- New `variant` prop on shared recipe → Task 2. ✅
- Applies to both Slider and RangeSlider → Task 2 (recipe) + Task 3 (RangeSlider
  story proves it). ✅
- Verbatim names `solid`/`outline`/`minimal`/`enclosed`, default `solid` → Task
  2 Steps 3 & 5. ✅
- Per-variant styling table (track/fill/thumb) → Task 2 Step 3. ✅
- Dimensional deltas via slot-level `calc()` against size var, no root-var race
  → Task 2 Step 3 (`minimal`/`enclosed` set `height`/`boxSize` on slots). ✅
- `disabled`/`invalid` keep working; invalid border must win even when a variant
  drops the border → Task 2 Step 4. ✅
- Thumb centering fix, orientation-scoped, RTL-safe → Task 1. ✅
- No `slider.types.ts` change; typings regenerated → Task 2 Step 6 + File
  Structure note. ✅
- Stories/tests per variant across the two components → Tasks 1–3. ✅
- Docs updated → Task 3 (dev.mdx + docs.spec). ✅
- Changeset → Task 3 Step 6. ✅

**Placeholder scan:** No TBD/TODO; every code step shows full code. Step 3 of
Task 3 gives an explicit fallback rule for the wrapper element rather than
leaving it open. ✅

**Type consistency:** `variant` union is identical everywhere
(`"solid" | "outline" | "minimal" | "enclosed"`). Slot names
(`track`/`fill`/`thumb`) and `data-slot` query selectors
(`root`/`track`/`fill`/`thumb`/`tick`) match `slider.slots.tsx` and
`slider-base.tsx`. Test command (`pnpm test:dev <stories>`), typegen command,
and typecheck command match CLAUDE.md. ✅
