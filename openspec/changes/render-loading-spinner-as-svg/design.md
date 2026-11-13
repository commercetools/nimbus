# Design

## Context

See `proposal.md` for motivation and the impact on consumers.

On `main`, `LoadingSpinner` rendered `<div role="progressbar">` (recipe:
`display: inline-flex`, width and height from the `size` variant, default `sm`)
with a nested `<svg viewBox="0 0 24 24">` that was scaled by
`transform: scale(calc(1 - 2/12))`. A `Button` sizes every `svg` below it as an
icon. On `main`, that rule therefore sized the nested `svg`, while the `size`
variant sized only the outer `div`. Measured in Chromium (width in px):

| Button size | `div` for `size` 2xs / xs / lg | nested `svg` |
|---|---|---|
| 2xs | 14 / 20 / 40 | 13 |
| xs, sm | 14 / 20 / 40 | 17 |
| md | 14 / 20 / 40 | 20 |

So the visible ring in a button already followed the button, not `size`; only
the layout box followed `size`.

## Goals / Non-Goals

**Goals:**

- One element whose own box is the size the spinner is drawn at, so the size does
  not depend on how a browser sizes a nested `svg` from its wrapper.
- A spinner that behaves like an icon: it takes the size a parent gives to icons
  and falls back to 24px.
- Sharp rendering at 24px.

**Non-Goals:**

- Specifying the result of an explicit `size` inside a `Button` (see Risks).
- Fixing unrelated drift in the `nimbus-loading-spinner` spec, for example the
  registration key `"loadingSpinner"` that the spec names while the code uses
  `nimbusLoadingSpinner`.
- Crisp strokes at sizes other than 24px.

## Decisions

### 1. Render the spinner as a single `svg`

The root slot is `withContext<SVGSVGElement, ...>("svg")`; the `circle` and
`path` are its direct children, and the `scale` transform and
`overflow: visible` are gone.

The branch first tried to keep the wrapper: `af66e6a34` sized the `svg` from its
wrapper in Safari and `581592880` made the `svg` fill the outer element in every
context. The rewrite (`6c58094a5`) replaced both. A wrapper plus a nested `svg`
needs two boxes to agree in every browser; one element has no such dependency.

Cost: the root element and the `ref` type change (see Risks).

### 2. No default `size` variant; a 24px attribute fallback

`defaultVariants: { size: "sm" }` is removed. The component sets `width` and
`height` attributes of 24 on the `svg`; a CSS rule for width or height overrides
an attribute. A spinner without `size` therefore takes the size a parent gives
to icons, and is 24px elsewhere (the same as the old default `sm`, token `600`).

The commit message of `10c93c954` gives the reason: a default size class has the
same specificity as the icon size of a `Button`, so the winner depended on CSS
order and button size. An attribute has lower priority than any rule, so the
parent decides.

Alternative: keep the default class and raise its specificity with `&&`. The
branch had this in `e17cf6c0a` and removed it again, because a spinner in a
button should match its icon.

### 3. Whole-pixel ring geometry: radius 8.5, stroke 3

On the 24x24 grid, radius 8.5 and stroke 3 give an outer edge of 2 and 22 and an
inner edge of 5 and 19. The earlier values (radius 8.75, stroke 2.5) put the
inner edge at 4.5 and 19.5, which is blurred at 24px. Rounding the stroke up
(to 3) instead of down (to 2) keeps the ring close to the old look. The outer
diameter is unchanged (20 units), so the footprint and the 2px live area do not
change.

Alternative: radius 9 and stroke 2 (inner edge 4 and 20). It matches the usual
24px icon stroke, but it is thinner than the old ring (2.5px at 24px).

The ring is slightly thicker than before. At 16px a 3-unit stroke is 2px and at
20px it is 2.5px, so some blur remains at sizes that are not a multiple of 12px. The
pointer arc rotates, so it is anti-aliased while it moves.

### 4. Patterns drop `size` and margin

`FormActionBar`, `ConfirmationDialog` and `FormDialog` render
`<LoadingSpinner />`. The button sizes it as an icon and its `gap` spaces it from
the label, so `size="2xs"` and `ml="100"` are no longer needed.

### 5. `DataTable`: `right: 0` for the last resizer

The resizer of the last column reached past the table edge and added scrollable
width. `&:last-child .nimbus-data-table__columnResizer { right: 0 }` keeps it
inside, with the same width as the other handles. Covered by the story
`LastColumnResizerStaysInsideTable`.

## Risks / Trade-offs

- **`ref` type and root element** (`HTMLDivElement` to `SVGSVGElement`, `div` to
  `svg`) → Typed `ref` users get a TypeScript error; CSS or tests that select a
  `div` break. In Pulse (scan 89), no instance uses `ref`, spread props or
  children, and no selector on the spinner class or `div[role="progressbar"]` was
  found in the commercetools organization. This covers only indexed default
  branches; other selectors were not searched. The changeset names the `ref`
  change.
- **Layout box in buttons** → The box now equals the icon size. Buttons with
  `<LoadingSpinner size="2xs" />` in a `md` button grow by about 10px (box 14px to
  24px); a `lg` spinner there shrinks from 40px to 24px. 23 such sites exist in
  Pulse. The visible ring does not change.
- **Explicit `size` inside a `Button`** → With equal specificity, the result
  depends on the button size. Measured on the branch (width in px, spinner
  `size` 2xs / xs / lg): button 2xs gives 14 / 20 / 40; buttons xs, sm and md give
  20 / 20 / 20 and 24 / 24 / 24 (the button wins). The cause (CSS order or
  selector form) was not established. The spec therefore states only the case
  without `size`.
- **Safari** → The reason for the change, but the final version was tested only in
  headless Chromium. Needs a manual check in Safari.
- **Thicker stroke** → Visible in the Chromatic snapshot for `ColorPalettes`;
  needs a design check.

## Migration Plan

- Ship as a `patch` changeset (`.changeset/safari-spinner-table-overflow.md`),
  which lists the `ref` type, the 24px icon-size behavior in buttons, the
  patterns and the stroke.
- Rollback: revert the commits of PR #2165. No data or API migration exists.
- Consumers that pass a typed `ref` change its type to `SVGSVGElement`; consumers
  that select the spinner `div` select the `svg` (or `[role="progressbar"]`).
