## 1. Alignment

- [x] 1.1 Size the icon and dismiss slots at `1lh` and centre their contents,
      so both track the alert's line height
- [x] 1.2 Size the icon glyph at `1.25em` so it scales with the alert's text
- [x] 1.3 Unpin `Alert.Title` from its `Heading` size so the text row and the
      `1lh` boxes share one cascade
- [x] 1.4 Cover the contract with stories: icon and dismiss centred on the
      first text line for a title-first alert, a description-only alert and a
      wrapping description, at three font sizes

## 2. The accent-start variant

- [x] 2.1 Add `variant="accent-start"` — neutral surface, status-coloured bar
      on the leading edge drawn as an inset shadow, neutral title and
      description
- [x] 2.2 Let `Alert.Actions` keep the status `colorPalette` so buttons carry
      the accent; resolve only the dismiss slot to neutral, since it is chrome
- [x] 2.3 Mirror the bar under `dir="rtl"`
- [x] 2.4 Add a story asserting the containment contract: surface and text
      identical across palettes, icon different, bar present, bar mirrored

## 3. Announcement semantics

- [x] 3.1 Default `role` to `alert` on `critical` and `status` otherwise, and
      apply it before the prop spread so a consumer's `role` wins
- [x] 3.2 Cover `status` (default), `alert` (critical default and explicit),
      a polite critical override and `group` (silent) with stories

## 4. Slots and defaults

- [x] 4.1 Widen `colorPalette` to the full `SemanticPalettesOnly` set; the
      two non-severities render no icon and collapse the leading column
- [x] 4.2 Make `Alert.Icon` a public slot; add `hideIcon`, which wins over an
      explicit icon
- [x] 4.3 Render `Alert.Title` as a `Heading` and `Alert.Description` as a
      `Text`, both defaulting to a `div` and accepting `as`
- [x] 4.4 Make `outlined` the explicit default variant

## 5. Spacing

- [x] 5.1 Move horizontal padding to 12px, keep vertical at 8px, tighten the
      title and description, and lay `Alert.Actions` out as a spaced row
- [x] 5.2 Collapse the leading column entirely when no icon renders
- [x] 5.3 Keep the box identical across variants — grid, padding and radius in
      `base`, colour and border colour in the variants — with a story
      asserting it

## 6. Documentation

- [x] 6.1 Document the variants, the icon slot and the dismiss options in
      `alert.dev.mdx` and `alert.mdx`
- [x] 6.2 Update `alert.guidelines.mdx` with when to reach for each variant
- [x] 6.3 Correct the a11y guidance for the new politeness default
- [x] 6.4 Map Figma's `Outlined` and `Ghost` in `alert.figma.tsx`, and note
      that `accent-start` has no Figma representation yet
- [x] 6.5 Write the changeset

## 7. Verification

- [x] 7.1 Story tests pass against source and against the built bundle
- [x] 7.2 `typecheck:strict` clean
- [x] 7.3 `prettier` and `eslint` clean
- [x] 7.4 Confirm in Storybook that all three variants render distinctly on
      every palette, and that RTL mirrors the accent bar
- [ ] 7.5 Review the regenerated Chromatic baselines
- [ ] 7.6 Confirm the palette-based `role` default (`alert` on `critical`,
      `status` otherwise) with whoever owns the a11y guidance — it is the one
      change that requires consumers to act
