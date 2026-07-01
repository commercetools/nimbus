## Why

Nimbus has no drop target for file/data uploads. Consumers building upload
experiences (asset managers, CSV importers, avatar pickers) currently either
hand-roll drag-and-drop with raw DOM events — which is easy to get wrong for
keyboard and screen-reader users — or fall back to a bare `FileTrigger` button
with no drag affordance. React Aria ships an accessible, headless `DropZone`
primitive; Nimbus should wrap it with design-system styling and a built-in
click-to-upload fallback so teams get an accessible, on-brand drop target for
free.

## What Changes

- Add a new **DropZone** component to `@commercetools/nimbus` at
  `packages/nimbus/src/components/drop-zone/`, wrapping `DropZone` from
  `react-aria-components`.
This is a deliberately minimal (MVP) wrapper: it adds **only** the drag-and-drop
and accessibility mechanics on top of React Aria's primitive. Content, layout,
and any upload affordance are the consumer's to provide.

- Styled via a standard Chakra recipe (`nimbusDropZone`) that styles only the
  interaction states React Aria exposes out of the box on the single container:
  **idle** (dashed border), **hover** (`data-hovered`), **dragOver**
  (`data-drop-target` highlight), **focus** (`data-focus-visible` ring), and
  **disabled** (`data-disabled`). No custom error/loading/invalid states — a drag
  rejected by `getDropOperation` simply does not highlight (RAC default).
- Renders a minimal **default state** when given no children — a centered upload
  icon + one localized instruction line ("Drag and drop files here") — so a bare
  `<DropZone />` communicates its purpose. Passing children replaces the default
  entirely (all-or-nothing; no icon/title/description slots, no slot detection).
  No `size` variant — sizing is done with Nimbus style props (`minH`, `w`, `p`, …).
- Forwards React Aria drop handlers faithfully (`onDrop`, `getDropOperation`,
  `onDropEnter/Exit/Move/Activate`, `isDisabled`) and re-exports the `DropEvent`,
  `DropOperation`, and `DragTypes` types.
- Accessible name comes from React Aria's native labelling: the default
  instruction renders as a `<Text slot="label">`, so a bare `<DropZone />` is
  labelled for free; an explicit `aria-label`/`aria-labelledby` takes precedence.
  The zone is keyboard- and screen-reader-accessible by default (RAC).
- Adds one i18n message for the default label (`Nimbus.DropZone.defaultLabel`).
- Does **not** re-implement click-to-upload. For the file-upload path (which
  keyboard/SR drag cannot cover), consumers compose the existing Nimbus
  `FileTrigger` inside DropZone's children. Demonstrated in the stories and docs.
- Registers the recipe in `theme/recipes/index.ts` and exports the component
  from the `packages/nimbus` barrel.
- Ships the docs-site tab set (Overview, Guidelines, Implementation,
  Accessibility) and Figma Code Connect.

No breaking changes — this is purely additive.

## Capabilities

### New Capabilities

- `drop-zone`: An accessible, styled drop target for file/data drag-and-drop —
  a thin React Aria `DropZone` wrapper that adds design-system styling for the
  idle/hover/dragOver/focus/disabled states, forwards the RAC drop handlers, and
  renders consumer-provided children. Full keyboard + screen-reader support; the
  file-upload path is added by composing `FileTrigger`.

### Modified Capabilities

<!-- None — this change is purely additive. -->

## Impact

- **New files**: `packages/nimbus/src/components/drop-zone/` (component, types,
  recipe, slots, stories, drop-event test helper, docs tabs, Figma Code Connect,
  barrel).
- **Modified files**:
  - `packages/nimbus/src/components/index.ts` — export DropZone.
  - `packages/nimbus/src/theme/recipes/index.ts` — register the `nimbusDropZone`
    standard recipe.
  - `@commercetools/nimbus-i18n` — one new `Nimbus.DropZone.defaultLabel` message.
- **Dependencies**: reuses existing `react-aria-components`, the Nimbus `Icon`,
  and `@commercetools/nimbus-icons` (`UploadFile`) for the default state.
  `FileTrigger` is used for composition in examples/docs, not internally. No new
  runtime dependencies.
- **Consumers**: none affected until they adopt the new component.
