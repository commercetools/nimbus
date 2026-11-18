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
- An explicit `size` always wins over a parent that sizes its `svg` children,
  for every button size.
- Sharp rendering at 24px.

**Non-Goals:**

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
button should match its icon. The `&&` selector is kept for the explicit `size`
variants only (decision 6).

### 6. An explicit `size` wins over the parent

A parent that sizes every `svg` (`Button`, `Badge`) has the same specificity as
the class of a `size` variant, so the winner depended on CSS order: in an
accordion header a spinner with `size="2xs"` rendered at 24px. The size variants
use `&&`, which raises their specificity by one class, so an explicit `size`
wins. Covered by the stories `RendersAtRequestedSize` (a `2xs` spinner in a `md`
button is 14px; a `lg` spinner in a `2xs` button is 40px) and
`WithSvgInHeader`.

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
width. `&:last-of-type .nimbus-data-table__columnResizer { right: 0 }` keeps it
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
- **Layout box of a spinner without `size` in a parent that sizes `svg`s** → The
  box now equals the icon size the parent gives (on `main` it stayed at 24px
  while only the nested `svg` followed the parent). In a `2xs` button the box
  shrinks from 24px to 16px. Pulse (scan 89) has 47 spinners without `size`; the
  parent of each was not checked.
- **Explicit `size` inside a `Button`** → The explicit `size` wins (decision 6),
  so the 23 such sites in Pulse keep their box. Their visible ring changes: on
  `main` it followed the button icon size, now it follows `size` (a `2xs`
  spinner in a `md` button: 20px to 14px).
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
