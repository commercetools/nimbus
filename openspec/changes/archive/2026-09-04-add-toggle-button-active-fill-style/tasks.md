# Tasks

> Implementation shipped on branch `FEC-1170-toggle-button-group-variant`
> (PR #1950); this change reconciles the specs and docs against it.

## 1. ToggleButton

- [x] 1.1 Make the resting chrome neutral for `outline`, `ghost` (recipe)
- [x] 1.2 Add the `subtle` variant (filled neutral chip at rest)
- [x] 1.3 Add the `activeFillStyle` variant (`tint` default, `solid`) with
      compound variants for the `outline` selected border
- [x] 1.4 Add `activeFillStyle` to the public props type with JSDoc
- [x] 1.5 Add `ToggleButtonContext` and consume it (child prop wins)

## 2. ToggleButtonGroup

- [x] 2.1 Render `ToggleButton` as the group `Button` slot (`withContext`)
- [x] 2.2 Provide `ToggleButtonContext` from the Root (variant / activeFillStyle
      / size / colorPalette) and resolve the `activeFillStyle` default from
      `selectionMode`
- [x] 2.3 Reduce the group recipe to segmentation only (root child-selector +
      selected-segment divider), no `!important`
- [x] 2.4 Set `ToggleButtonGroupButtonProps = ToggleButtonProps`

## 3. Button

- [x] 3.1 Add base `_pressed` `translateY(1px)` tactile feedback
- [x] 3.2 Add pressed fill/text to `subtle` / `outline` / `ghost`
- [x] 3.3 Remove the unwired `_expanded` variant styling

## 4. Theme

- [x] 4.1 Add `_pressed` / `_selected` conditions and use them in the recipes

## 5. Toolbar

- [x] 5.1 Render a segmented `ToggleButtonGroup` flush inside a `Toolbar`

## 6. Documentation, stories, and tests

- [x] 6.1 ToggleButton `.mdx` / `.dev.mdx`: `subtle`, `activeFillStyle`,
      neutral-resting semantics
- [x] 6.2 ToggleButton stories: `subtle` axis + `ActiveFillStyles` VRT story
- [x] 6.3 ToggleButton consumer tests: `subtle` + `activeFillStyle` coverage
- [x] 6.4 ToggleButtonGroup `.mdx` / `.dev.mdx`: `variant`, `activeFillStyle`,
      `.Button` = `ToggleButton` inheritance + per-button override
- [x] 6.5 ToggleButtonGroup stories: `Variants`, `ActiveFillStyles`,
      `PerButtonOverride`
- [x] 6.6 Toolbar `.dev.mdx`: segmented (flush) group example
- [x] 6.7 Regenerate Chakra theme typings
- [x] 6.8 `typecheck:dev` clean

## 7. OpenSpec

- [x] 7.1 Write delta specs for `nimbus-toggle-button`,
      `nimbus-toggle-button-group`, `nimbus-button`
- [x] 7.2 `openspec validate --strict`
- [x] 7.3 Archive (sync deltas into main specs)
