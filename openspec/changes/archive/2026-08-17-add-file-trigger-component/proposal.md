## Why

Tracked by [FEC-982](https://commercetools.atlassian.net/browse/FEC-982) under
the **Nimbus Chat Components** epic (FEC-979). Nimbus has no primitive for
letting users select files from their device — a prerequisite for chat
attachment flows. Today consumers must hand-roll a hidden `<input type="file">`
and wire up the click forwarding, accessibility, and `accept`/`multiple`
attributes themselves — error-prone and inconsistent with the rest of the
system. React Aria Components ships a battle-tested, accessible `FileTrigger`
that solves exactly this, so Nimbus should expose a thin, on-brand wrapper
around it. This component is also a **predecessor of the DropZone component**
(FEC-986), which builds on the same file-selection foundation.

## What Changes

- Add a new `FileTrigger` component to `@commercetools/nimbus` — a behavior-only
  wrapper around React Aria Components' `FileTrigger` that connects a pressable
  Nimbus child (e.g. `Button`, `IconButton`) to a visually-hidden file input and
  opens the OS file picker on activation.
- Faithful passthrough of `FileTriggerProps`: `onSelect(files: FileList | null)`,
  `acceptedFileTypes`, `allowsMultiple`, `acceptDirectory`, `defaultCamera`, and
  `children`. The RAC `onSelect` signature is preserved exactly (no `File[]`
  normalization).
- No recipe, no slots, no styling of its own — styling is fully delegated to the
  pressable child, following the existing `IconButton` "pure composition"
  precedent. Disabling is done by disabling the child.
- Register the component in the main package barrel export
  (`packages/nimbus/src/components/index.ts`).
- Ship Storybook play-function tests, consumer implementation tests
  (`.docs.spec.tsx`), designer docs (`.mdx`), developer docs (`.dev.mdx`), and
  accessibility docs (`.a11y.mdx`). At least one story/example demonstrates the
  component with the Nimbus `Button` as the child trigger (per FEC-982
  acceptance criteria).
  - Note: `.a11y.mdx` is not in the ticket's explicit file list but is added as
    a Nimbus standard for interactive components (precedent: `button.a11y.mdx`,
    `icon-button.a11y.mdx`).
- **Out of scope (deferred):** input reset for re-selecting the same file,
  `name`/native-`<form>` submission integration, and `File[]` normalization.
  Consumers remount via a `key` prop to reset, and call `Array.from()` to
  iterate the `FileList`. These can be added later via their own proposals if a
  concrete need appears.

## Capabilities

### New Capabilities

- `file-trigger`: A component that wraps a pressable child and a
  visually-hidden file input to open the device file picker, forwarding file
  selections to consumers via `onSelect` with configurable accepted types,
  multiple selection, directory selection, and camera capture.

### Modified Capabilities

<!-- None. No existing spec requirements change. -->

## Impact

- **New code:** `packages/nimbus/src/components/file-trigger/` (`file-trigger.tsx`,
  `file-trigger.types.ts`, `file-trigger.stories.tsx`, `file-trigger.docs.spec.tsx`,
  `file-trigger.mdx`, `file-trigger.dev.mdx`, `file-trigger.a11y.mdx`,
  `index.ts`).
- **Modified code:** `packages/nimbus/src/components/index.ts` (add barrel
  export in alphabetical order).
- **Dependencies:** none added — `react-aria-components` is already a Nimbus
  dependency.
- **Public API:** net-new `FileTrigger` export from `@commercetools/nimbus`. No
  breaking changes. No design-token, theme, or recipe-registry changes (the
  component has no recipe).
