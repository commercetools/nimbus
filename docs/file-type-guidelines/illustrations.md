# Illustration Guidelines

Every component, derivative and pattern that has a main doc page
(`<dir>/<dir-name>.mdx`) has one illustration. Docs pages that are not a
component, such as Design Tokens, can have one too. The docs show illustrations
in page headers, on overview cards, in search results and on the start page.

[← Back to File Type Guidelines](./index.md)

## Files

| File                                            | Role                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------------- |
| `{name}.illustration.ts`                        | Source of a component or pattern, in its folder. Written by hand.           |
| `src/docs/illustrations/{name}.illustration.ts` | Source for a docs page that is not a component or pattern. Written by hand. |
| `src/illustration-kit/`                         | The drawing kit. Not published.                                             |

For a component or pattern, `{name}` is the folder name, for example `button` or
`date-range-picker`. For a docs page, it is the file name, for example
`design-tokens`. A page picks a docs page illustration with the `illustration`
front matter field (see [Documentation Guidelines](./documentation.md)). Names
are unique across all sources: the generator stops when two sources share a
name, because both would render to the same `<name>.svg`.

## Source Template

```ts
import { defineIllustration } from "@/illustration-kit";

export default defineIllustration({
  name: "button",
  draw: ({ panel, pill, cursor }) => [
    panel({ x: 24, y: 40, w: 48, h: 16, radius: "200", tone: "strong" }),
    pill({ x: 36, y: 46.5, w: 24, fill: "onStrong" }),
    cursor({ x: 62, y: 52 }),
  ],
});
```

Source rules:

- The file has exactly one import, `defineIllustration` from
  `@/illustration-kit`, and one `export default defineIllustration(...)`.
- Colors are role names (`strong`, `text`, `icon`, ...). Shapes come from the
  kit primitives.
- The text of the file contains none of: hex colors, `rgb(`, `hsl(`, `oklch(`,
  `var(`, `light-dark(`, `color-mix(`, `<`, the word `style`, `id=`, `url(#`. A
  kebab-case name such as `style-props` may contain `style-`. Use `.map` and
  `.flatMap` for repeated shapes.
- Illustrations never import each other. Shared building blocks (`field`,
  `listRow`, `checkbox`, ...) live in the kit.

## Visual Spec

| Rule       | Value                                                                                                                                                                                                             |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Canvas     | `viewBox="0 0 96 96"`. 4-unit grid, 2 for small details. Content centered with an 8-unit margin.                                                                                                                  |
| Corners    | The Nimbus recipe `borderRadius` token of the component, in px divided by 4: `50` → 0.5, `100` → 1, `200` → 2, `300` → 3. `"full"` is a capsule. Docs page illustrations have no recipe and use `200` by default. |
| Shadow     | Nimbus `shadow.3`, drawn by the kit. Panels have it by default.                                                                                                                                                   |
| Text       | Round-ended bars (`pill`, height 3). No real letters, no `<text>`.                                                                                                                                                |
| Cursor     | Allowed when it explains the idea (press, hover). It is not part of the geometry checks.                                                                                                                          |
| Colors     | Roles only. Each role is a Nimbus palette variable with a ctviolet fallback, so the SVG follows `colorPalette` and dark mode.                                                                                     |
| Background | Gradient from `--illustration-gradient-start` to `--illustration-gradient-end`.                                                                                                                                   |
| Dark mode  | Works when an ancestor has `color-scheme: dark`. NimbusProvider sets this.                                                                                                                                        |
| Palette    | Follows `colorPalette`. The place that shows an illustration sets `colorPalette="primary"`.                                                                                                                       |

Roles: `surface`, `surfaceStroke`, `strong`, `onStrong`, `text`, `textStrong`,
`onBg`, `muted`, `line`, `icon`, `tint`, `track`, `knob`, `cursor`,
`cursorStroke`. See `src/illustration-kit/roles.ts`.

## Composition and Metaphor

- Show the one idea that tells this component apart from its neighbors.
- Use few shapes. Aim for 5 to 12.
- Draw the real structure: a button is a strong panel with a text bar, a switch
  has a track and a knob.
- Abstract components (layout, providers) use a diagram: guides, gap ticks,
  frames. See the metaphor table in
  `openspec/changes/add-component-illustrations/design.md`.
- Look-alike families each need one distinguishing glyph: eye for password,
  magnifier for search, coin for money, ± stepper for number, clock for time,
  calendar for date, resize corner for multiline, toolbar for rich text; dialog
  vs drawer vs modal-page; the skeleton trio. Check them side by side on the
  contact sheet.

## Workflow

1. Write `{name}.illustration.ts`.
2. Run `pnpm illustrations:sheet --only {name}` (or `--category "<Category>"`).
3. Open the PNGs in `packages/nimbus/.illustration-sheets/` (light and dark) and
   look at them. Fix and repeat.
4. Run `pnpm --filter @commercetools/nimbus test:unit` (or
   `pnpm test:dev packages/nimbus/src/illustration-kit`).

The unit test (`illustrations.spec.ts`) checks coverage, source purity, output
structure, sanitizer parity and geometry (inside 8–88, centered within 2 units
of 48, panel sizes in multiples of 2, at most 8 KB).

## Validation Checklist

- [ ] `{name}.illustration.ts` exists in the component folder (or in
      `src/docs/illustrations/` for a docs page) and no `.illustration.svg` is
      committed
- [ ] `name` equals the folder name (or the file name for a docs page)
- [ ] The source has one import from `@/illustration-kit` and one
      `export default defineIllustration(`
- [ ] No raw colors, CSS functions, markup, `style` or `id=` in the source
- [ ] Radius token taken from the component's recipe (`200` by default for a
      docs page)
- [ ] Text is drawn as round-ended bars
- [ ] The contact sheet was rendered and looked at in light and dark mode
- [ ] The illustration is distinct from its look-alikes
- [ ] `pnpm --filter @commercetools/nimbus test:unit` passes

## Where the SVG Comes From

The SVG is build output, not a committed file. `pnpm illustrations:generate`
renders every source into `apps/docs/src/data/illustrations/<name>.svg`
(gitignored). The docs build and the docs dev server run it, and the dev server
renders again when a source or a kit file changes.

## Using the SVG

In the docs app, show an illustration with the `Illustration` component from
`@/components/illustration`:

```tsx
<Illustration name="date-picker" boxSize="64px" borderRadius="200" />
```

- `name` is the illustration name. `hasIllustration(name)` tells whether its SVG
  exists, for example before you choose between an illustration and an icon.
- It fills its parent unless you set size props. It takes all `Box` props.
- It is decorative and hidden from assistive technology by default. Set `alt`
  only when the picture carries information that the text around it does not
  give; it then gets `role="img"` and `alt` as its name.
- `IllustrationCollage` shows several illustrations as a stack that spreads out
  when its link is hovered or focused. With `open`, it is always spread.

The component already inlines the SVG and scopes its ids. Outside of it:

- Inline it (for example with `InlineSvg`) inside an element with
  `colorPalette="primary"`. Through `<img src>` the variables cannot reach the
  SVG and it shows the ctviolet light fallback.
- Ids are `il-<name>-...`. When the same illustration appears twice on one page,
  replace the prefix with a unique one per copy, because `url(#id)` points to
  the first match.
