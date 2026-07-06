## Context

Nimbus lacks any file-selection primitive, forcing consumers to hand-roll hidden
`<input type="file">` elements with manual click-forwarding and accessibility.
React Aria Components already provides an accessible `FileTrigger` that wraps a
pressable child and a visually-hidden input. This change wraps that RAC component
as a Nimbus export.

This work is tracked by FEC-982 within the **Nimbus Chat Components** epic
(FEC-979) and is a predecessor of the DropZone component (FEC-986), which reuses
the same file-selection foundation. Keeping `FileTrigger` a faithful, minimal
wrapper keeps that downstream composition clean.

The component is a **Tier 1 behavior wrapper with no styling of its own** — the
closest existing precedent is `IconButton`, which delegates all styling to
`Button` and ships no `.recipe.ts` / `.slots.tsx`. `FileTrigger` goes one step
further: it has no visual output at all (it renders its child plus a hidden
input), so it needs neither a recipe nor slots.

Constraints carried from the brainstorm decisions: faithful passthrough of the
RAC API, no reset mechanism, and no native-form (`name`) integration.

## Goals / Non-Goals

**Goals:**

- Expose `FileTrigger` from `@commercetools/nimbus` as a thin, accessible
  wrapper around RAC `FileTrigger`.
- Preserve the RAC `FileTriggerProps` API verbatim, including the
  `onSelect(files: FileList | null)` signature.
- Delegate all styling and disabled-state handling to the pressable child.
- Document and test selection, accepted types, multiple, directory, camera
  hint, disabled child, keyboard activation, and accessibility.
- Ship consumer implementation tests (`.docs.spec.tsx`) with copy-pasteable
  examples, including usage with the Nimbus `Button` as the child trigger.

**Non-Goals:**

- No input reset API (re-selecting the same file). Consumers remount via `key`.
- No `name` prop / native `<form>` submission (would require dropping to the
  `useFileTrigger` hook and rebuilding the component).
- No `File[]` normalization of `onSelect`.
- No recipe, slots, theme registration, design tokens, or i18n messages — the
  component produces no text or styled markup of its own.

## Decisions

**Decision: Re-export/wrap RAC `FileTrigger` faithfully rather than re-implement.**
Rationale: RAC already solves the hidden-input, click-forwarding, and
VisuallyHidden accessibility concerns and is the accessibility foundation across
Nimbus. Re-implementing would duplicate that surface with no benefit.
Alternative considered: building on the lower-level `useFileTrigger` hook to gain
a `name` prop and reset control — rejected as out of scope; it multiplies
implementation and test surface for needs that aren't yet concrete.

**Decision: No recipe and no slots files.**
Rationale: the component renders its child plus a visually-hidden input — there
is nothing to style. Adding an empty recipe would violate the "recipe only when
there is styling" architecture decision and the `IconButton`/`Box` precedent.
Alternative considered: a pass-through recipe for future-proofing — rejected as
speculative (YAGNI); a recipe can be added later via proposal if styling needs
emerge.

**Decision: Keep the public type as RAC `FileTriggerProps` with Nimbus JSDoc.**
Rationale: matches the "faithful passthrough" brainstorm decision and the
convention of importing RAC types with an `Ra` prefix. We add JSDoc on each prop
for IDE tooltips but do not alter shapes. Alternative considered: a normalized
`File[]` callback — rejected because it diverges from documented RAC behavior and
confuses anyone cross-referencing RAC docs.

**Decision: Disabled state is delegated to the child.**
Rationale: RAC `FileTrigger` has no `isDisabled`; disabling the child Button
suppresses press events and therefore the picker. This matches how RAC intends
the component to be used and keeps our surface minimal.

**Decision: TDD via Storybook play functions, tested against the built bundle.**
Rationale: Nimbus tests components only through Storybook stories run in
Playwright against `dist/`. Play functions assert on the hidden input's
attributes (`accept`, `multiple`, directory, `capture`), `onSelect` firing, the
disabled-child path, and keyboard activation.

## Risks / Trade-offs

- [File-picker dialogs cannot be driven by Playwright] → Tests assert on the
  hidden input's rendered attributes and on `onSelect` via simulated `change`
  events / `userEvent.upload`, rather than driving the native OS dialog.
- [No reset means re-selecting the identical file won't re-fire `onSelect`] →
  Documented explicitly in dev docs with the `key`-remount workaround; revisit
  via proposal if consumers report friction.
- [No `name` prop blocks native multipart form submission] → Documented as a
  known limitation; the `onSelect` + controlled-state path covers the common
  case. Revisit via proposal if needed.
- [`acceptDirectory` + `allowsMultiple` interaction is browser-defined] →
  Documented; we forward both faithfully and do not attempt to reconcile them.

## Migration Plan

Net-new additive component. No migration required, no breaking changes, no
rollback complexity — reverting is removing the new directory and the single
barrel-export line.

## Open Questions

None. The three potential ambiguities (API fidelity, reset, form integration)
were resolved during brainstorming in favor of the thin, faithful wrapper.
