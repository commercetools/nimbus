# Tasks

> This change formalizes the already-shipped Slider/RangeSlider implementation on
> `feat/slider-component` into OpenSpec. Tasks are recorded as completed to
> reflect the delivered work; any box left unchecked is remaining follow-up.

## 1. Foundation — recipe, slots, types, registration

- [x] 1.1 Create `slider.recipe.ts` — `nimbusSlider` slot recipe (slots: `root`,
      `track`, `fill`, `thumb`, `tick`, `tickLabel`) with `size` (`sm`/`md`),
      `orientation`, and `variant` (`filled`/`minimal`/`enclosed`) variants
- [x] 1.2 Create `slider.types.ts` — four-layer types: recipe → slot →
      `SliderBaseProps` (union) → public `SliderProps` (`number`) /
      `RangeSliderProps` (`[number, number]`)
- [x] 1.3 Create `slider.slots.tsx` — slot components grafting React Aria
      primitives via `asChild`
- [x] 1.4 Register `nimbusSlider` in `src/theme/slot-recipes/index.ts` (missing
      registration = no runtime styles)
- [x] 1.5 Create `slider/index.ts` barrel and export from
      `src/components/index.ts`

## 2. Slider (single value)

- [x] 2.1 Implement shared internal `slider-base.tsx` (React Aria `Slider`
      wiring, one thumb per `state.values`, orientation, clamping/stepping)
- [x] 2.2 Implement public `slider.tsx` wrapper (`number` value type)
- [x] 2.3 Add per-thumb controlled value `Tooltip` (open on hover/focus/drag,
      Escape-dismissible, `formatOptions`-aware)
- [x] 2.4 Story play-function tests: render, hover/focus tooltip, arrow
      stepping, Home/End clamping

## 3. RangeSlider (two thumbs)

- [x] 3.1 Implement public `range-slider.tsx` wrapper (`[number, number]` value
      type)
- [x] 3.2 Story play-function tests: two thumbs, independent tooltips, thumbs
      cannot cross, array `onChange`

## 4. Orientation, sizes, and variants

- [x] 4.1 Vertical orientation (recipe branches + cross-axis thumb centering fix)
- [x] 4.2 `sm` / `md` size variants (token-driven track thickness + thumb size,
      aligned to the Switch size grid)
- [x] 4.3 `variant="enclosed"` (iOS-style thick bar, contained thumb) alongside
      `filled` default; stories per variant/size/orientation
- [x] 4.4 `variant="minimal"` (understated thin neutral track that grows to full
      thickness on engage; single-color handle `colorPalette.9` → `.10`;
      RangeSlider range segment colored the same, single `Slider` left fill-free)
      for low-emphasis controls like a thumbnail-size picker; renamed the interim
      `plain` default to `filled`; smoke stories cover the ticks/no-ticks axis
      across every variant

## 5. Tick marks

- [x] 5.1 Opt-in ticks (`showTicks` / `tickStep`), always a tick at `maxValue`
- [x] 5.2 Region-aware tick coloring (`data-filled` / `data-on-thumb`)
- [x] 5.3 Story asserting tick count and max-value tick placement

## 6. FormField integration + i18n + a11y

- [x] 6.1 `isInvalid` → `data-invalid` seam on root (not forwarded to RaSlider);
      invalid thumb border overrides every variant
- [x] 6.2 FormField integration (label association via `aria-labelledby`,
      description, invalid) with story
- [x] 6.3 Author `slider.i18n.ts` (`Nimbus.Slider.minimumThumb` /
      `maximumThumb`) and apply localized default thumb labels for `RangeSlider`
- [x] 6.4 Accessibility docs (`slider.a11y.mdx`) and keyboard/ARIA coverage in
      stories (WCAG 2.1 AA)

## 7. Documentation

- [x] 7.1 `slider.mdx` (designer) + `slider.dev.mdx` (engineering) +
      `slider.guidelines.mdx`
- [x] 7.2 `slider.docs.spec.tsx` consumer examples

## 8. OpenSpec housekeeping

- [x] 8.1 Consolidate the two `docs/superpowers/` slider plan/spec docs into this
      OpenSpec change and remove the superseded files
