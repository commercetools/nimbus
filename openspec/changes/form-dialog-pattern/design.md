## Context

The Merchant Center Application Kit's `FormDialog` is the canonical
"edit-this-thing-in-a-modal" UI in the MC codebase: it pairs a
dialog shell (title, body, footer) with a save / cancel action pair
and a save-loading state. It has accrued configuration props
(`size`, `zIndex`, `dataAttributesPrimaryButton`,
`dataAttributesSecondaryButton`, optional `Intl` proxy) that the
Nimbus replacement intentionally omits in favour of a flat API + a
`Dialog`-primitive escape hatch.

Nimbus's `Dialog` primitive already solves the cross-cutting modal
concerns via its recipe (z-index stacking with
`calc(var(--dialog-z-index) + var(--layer-index, 0))`), React Aria's
`Modal` + `ModalOverlay` (portaling), and `Dialog.CloseTrigger`
(localized close-button accessible name). The pattern layer can
stay thin and delegate.

## Goals / Non-Goals

### Goals

- Ship a low-friction API for the overwhelmingly common
  form-in-a-modal case
- Default-localize the Save and Cancel labels so consumers don't
  have to wire `useIntl` boilerplate for the common case
- Provide a first-class `isSaveLoading` state so async save handlers
  can show a spinner and lock out further interaction without
  consumers re-implementing the spinner-and-disable boilerplate
- Make the async save happy-path correct out of the box: keep the
  dialog open until the consumer's `Promise` settles, leave it open
  on rejection so consumers can surface validation errors
- Delegate all modal mechanics (z-index, portal target, focus trap,
  dismissal wiring, `Escape` handling) to the underlying `Dialog`

### Non-Goals

- Wrapping `children` in a native `<form>` element. The pattern
  treats `onSave` as the canonical submit hook; consumers wanting
  native-form `submit` semantics (Enter-to-submit, browser
  validation) compose a `<form onSubmit={handleSubmit}>` outside of
  or as the `children` of the FormDialog
- An `intent` discriminator — save is always non-destructive. A
  destructive flavor of an editable form is a different interaction
  shape and is out of scope for this pattern
- Configurable sizing at the pattern layer — consumers needing a
  non-default size drop down to `Dialog` directly (documented
  escape hatch)
- Per-button `data-*` attributes via dedicated props — Nimbus
  `Button` already accepts arbitrary `data-*` attributes via
  `[key: \`data-\${string}\`]: unknown` index signature; consumers
  needing per-button test IDs drop down to `Dialog`
- A `FormDialog.Title` / `TextTitle` sub-component — `title` is a
  `ReactNode`, so consumers compose freely
- Auto-toggling `isSaveLoading` from an awaited `onSave` return
  value — keep state explicit, no hidden state machine

## Decisions

### Decision: Location under `patterns/dialogs/`

Place the component at
`packages/nimbus/src/patterns/dialogs/form-dialog/`.

- **Alternatives considered**:
  - `components/form-dialog/` (alongside the `Dialog` primitive) —
    rejected because primitive vs. pattern is the key mental model:
    primitives expose the full mechanism, patterns are pre-composed
    opinionated arrangements of those primitives.
  - `patterns/form-dialog/` (flat) — rejected to keep dialog
    patterns grouped under `dialogs/` for browsability.
- **Rationale**: FormDialog is a canonical composition of `Dialog`
  parts plus two `Button`s. Grouping by domain (`dialogs/`) within
  the patterns tree keeps related arrangements colocated and
  discoverable.

### Decision: Unify `onClose` and `onCancel` onto a single `onCancel`

The Nimbus pattern exposes a single `onCancel` callback, invoked by
the cancel button **and** by ambient dismiss affordances (Escape
key, overlay click, X close button). Pair it with `onOpenChange`
for consumers wanting to react to the open-state transition
independently of cancel semantics.

- **Alternatives considered**:
  - An `onClose` (Escape/overlay/X) + `onCancel` (Cancel button
    click) split — rejected because the distinction is mostly
    nominal in practice; consumers either treat all four cancel
    paths identically or drop down to the `Dialog` primitive for
    fine-grained control. The cognitive overhead at every call
    site doesn't pay for itself.
  - Drop `onCancel` entirely and rely solely on
    `onOpenChange(false)` — rejected because consumers commonly
    want a semantic "the user discarded this form" hook (e.g.
    analytics, reverting optimistic state, dirty-state reset)
    distinct from the generic open-state change.
- **Rationale**: A single `onCancel` is the simplest mental model
  consistent with the dominant usage. The `onOpenChange` pair
  gives consumers an open-state-only hook when they need it.

### Decision: Internalize open state via `useControlledState`

The pattern internalizes its open state with
`useControlledState(isOpen, defaultOpen ?? false, onOpenChange)`
from `react-stately/useControlledState`. The save and cancel
buttons close the dialog by calling the internal `setOpen(false)`
directly, NOT by routing through `slot="close"` on the underlying
`Button`. Ambient dismiss paths (Escape, overlay, X) flow through
`Dialog.Root`'s `onOpenChange`, which is wired to invoke `onCancel`
followed by `setOpen(false)`.

- **Alternatives considered**:
  - Use `slot="close"` on the cancel button (the natural React
    Aria composition) — rejected because the slot's `onOpenChange`
    notification races against the cancel button's `onPress`
    handler. The pattern's own `setOpen(false)` plus the slot's
    auto-close both fire `onOpenChange`, double-firing the
    consumer's `onCancel` handler.
- **Rationale**: A single canonical owner of the open state and a
  single canonical cancel-callback fire path. Internalising the
  state via `useControlledState` keeps the pattern in control of
  when `onCancel` fires and avoids the slot/`onPress` race
  entirely.

### Decision: Save button is solid+primary, cancel is outline

The save `Button` uses `variant="solid"` `colorPalette="primary"`,
and the cancel `Button` uses `variant="outline"` (no
`colorPalette`). No discriminator prop is exposed.

- **Alternatives considered**:
  - Expose the underlying Button `variant` / `colorPalette`
    directly — rejected because it leaks the styling system into
    the pattern API.
  - Add an `intent` prop (e.g. `"primary"` vs `"destructive"`) —
    rejected because the save action in a form dialog is by
    definition non-destructive. Destructive flavor (e.g. "Delete
    this item?") is a different interaction shape and is out of
    scope.
- **Rationale**: Visual hierarchy between primary and secondary
  actions: the affirmative action is solid + colored, the cancel
  is outlined. The styling system's defaults already encode this
  hierarchy via `variant="solid"` `colorPalette="primary"` vs
  `variant="outline"`.

### Decision: `isSaveLoading` locks the entire dialog, not just the save button

When `isSaveLoading` is `true`:

- The save `Button` shows a `LoadingSpinner` (`size="2xs"`,
  `ml="100"`) next to its label and is `isDisabled`.
- The cancel `Button` is also `isDisabled` — preventing the user
  from cancelling mid-flight after the save action has been
  dispatched but before it has resolved.
- The dialog's dismiss affordances (Escape, overlay click) are
  **disabled**: `Dialog.Root` receives `isDismissable={false}` and
  `isKeyboardDismissDisabled={true}` for the duration. The X close
  button in the header is disabled via
  `Dialog.CloseTrigger isDisabled={isSaveLoading}`.

- **Alternatives considered**:
  - Disable only the save button — rejected because it leaves
    cancel + Escape + overlay click + X all wired, which can fire
    `onCancel` after `onSave` has been dispatched. That forces
    every consumer to track their own in-flight flag.
  - Leave dismiss affordances enabled but route them through a
    consumer-defined "are you sure you want to discard your
    changes?" prompt — rejected as out of scope for v1; consumers
    wanting that flow compose the appropriate confirmation
    themselves.
- **Rationale**: The pattern owns the lifecycle of the in-flight
  action, so it owns the lock. Dirty-form data loss while a save
  is in flight is a particularly painful failure mode that the
  lock prevents by construction.

### Decision: Default focus follows the Dialog primitive (first focusable)

Initial focus follows `Dialog.Root`'s default React Aria
behaviour: the first focusable element in tab order receives focus
when the dialog opens. For a typical form, that's the first form
field — which is the desired behaviour. With cancel rendered
before save in the footer DOM order, the footer focus order is
cancel → save.

- **Alternatives considered**:
  - Auto-focus the save button — rejected because it skips the
    form fields and is the wrong default for a form dialog.
  - Auto-focus the cancel button — rejected for the same reason.
  - Expose an `initialFocus` prop — rejected as out of scope for
    v1; consumers needing this drop down to `Dialog`.
- **Rationale**: No code is the simplest code. The "first
  focusable in DOM order is the first form field" behaviour is
  what consumers expect from a form dialog. Document the
  behaviour in `.dev.mdx` so the implicit contract is explicit.

### Decision: Pattern-owned i18n via `.i18n.ts` and `useLocalizedStringFormatter`

The pattern owns two strings — the default Save and Cancel button
labels. Author them in `form-dialog.i18n.ts` as a `messages`
object with `id`, `description`, `defaultMessage` per entry;
consume via `useLocalizedStringFormatter(messages)` from
`@/hooks`. Message IDs follow the `Nimbus.FormDialog.*` namespace
convention.

```ts
// form-dialog.i18n.ts
export const messages = {
  save: {
    id: "Nimbus.FormDialog.save",
    description: "default label for the save button in a form dialog",
    defaultMessage: "Save",
  },
  cancel: {
    id: "Nimbus.FormDialog.cancel",
    description: "default label for the cancel button in a form dialog",
    defaultMessage: "Cancel",
  },
};
```

- **Alternatives considered**:
  - Reuse another pattern's message keys — rejected because
    cross-pattern message-key sharing creates implicit coupling
    that breaks if either pattern's wording diverges in future
    translations. Per-pattern keys keep ownership clean.
  - Skip i18n and require consumers to always pass `saveLabel` /
    `cancelLabel` — rejected because the dominant usage takes the
    default labels; making consumers wire `useIntl` for those
    cases is a regression.
- **Rationale**: Per-pattern message keys give each pattern
  independent ownership of its translated strings, and the
  `useLocalizedStringFormatter` integration is the project's
  standard pattern for resolving them at runtime.

### Decision: Drop `size`, `zIndex`, `getParentSelector`, per-button `data-*` props, sub-components

These props are explicitly not part of the Nimbus surface area.
The escape hatch (drop down to the `Dialog` primitive) handles all
of them. Document the escape hatch prominently with a runnable
code sample.

### Decision: `saveLabel` and `cancelLabel` are `ReactNode`, not `string`

Symmetric with `title` (which is `ReactNode`) and consistent with
the Nimbus `Button` accepting `ReactNode` children. Lets consumers
pass `intl.formatMessage(...)` results, an icon-plus-text
composition, or just a localized string directly without coercion.

### Decision: `onSave` is Promise-aware; close defers to fulfillment

`onSave` is typed `() => void | Promise<void>`. When the consumer
returns a `Promise`, the pattern keeps the dialog open until the
promise settles: on fulfillment the pattern calls `setOpen(false)`
(which propagates to `onOpenChange(false)`); on rejection the
dialog stays open so the consumer can surface validation errors
(e.g. server-side field errors) and let the user correct and
retry. Synchronous (`void`) handlers continue to close the dialog
immediately.

A naive synchronous close before async work means the
`isSaveLoading` lockout never paints for async saves: the dialog
unmounts before the consumer has a chance to flip `isSaveLoading`
to `true`. The fix is to keep `isSaveLoading` consumer-controlled
and only delay the pattern's own close call until the returned
promise settles.

- **Rationale**: Promise-aware close is strictly additive at the
  type level (`void` widens to `void | Promise<void>`), preserves
  sync-save semantics unchanged, and makes the existing
  `isSaveLoading` prop work correctly for the dominant async case
  without introducing any new public API or hidden state.

### Decision: Pattern does not wrap children in a `<form>` element

The pattern's `Dialog.Body` renders `children` directly. The
pattern does NOT wrap them in a `<form>` element, and `onSave` is
not wired to a native form `submit` event. Consumers wanting
Enter-to-submit semantics or browser-native validation can place
their own `<form onSubmit={...}>` around the form fields inside
`children`, or wrap the entire FormDialog with a `<form>` (rare).

- **Alternatives considered**:
  - Auto-wrap `children` in a `<form onSubmit={onSave}>` —
    rejected because it forces every consumer onto a single
    submit model and breaks the React Hook Form / Formik /
    vanilla controlled-state parity. The flat callback is more
    flexible.
- **Rationale**: Form mechanics are the consumer's domain. The
  pattern owns the dialog shell and the action buttons; the
  consumer owns the field layout and the submit semantics.

### Decision: `aria-label` retained as an escape valve

By default the dialog's accessible name is derived from `title`.
When `title` is a composed `ReactNode` whose text content would
produce a confusing accessible name, consumers pass `aria-label`
to override. This is the same `aria-label` escape valve exposed
by the underlying `Dialog.Root`, surfaced at the pattern boundary
so consumers don't need to drop down for the common
composed-title case.

## Risks / Trade-offs

- **Risk**: Consumers used to wiring native form submit (Enter
  key triggers submit) may be surprised that pressing Enter in a
  form field doesn't auto-invoke `onSave`.
  **Mitigation**: Document in `.dev.mdx` that the pattern relies
  on the explicit Save button click; consumers wanting
  Enter-to-submit should wrap their form fields in
  `<form onSubmit={handleSubmit}>` inside `children` and call
  `onSave` from `handleSubmit`.

- **Risk**: Unifying `onClose` + `onCancel` onto a single
  `onCancel` is a semantic change for consumers migrating from
  app-kit who wire them to different handlers. A consumer relying
  on "fire X only when the Cancel button is clicked, not when
  Escape is pressed" will see X fire on Escape under the new
  pattern.
  **Mitigation**: Document the unification explicitly in
  `.dev.mdx` with a "migrating from app-kit" note. Consumers
  needing the distinction drop down to `Dialog` (escape hatch).

- **Trade-off**: Locking the entire dialog while `isSaveLoading`
  is `true` removes the user's ability to cancel an in-flight
  save. For long-running saves this can feel unresponsive.
  **Mitigation**: For genuinely long operations, consumers
  should close the dialog optimistically and show a Toast or
  progress indicator outside the dialog, rather than holding
  the dialog open with a spinner. Document this guidance in
  `.dev.mdx`.

- **Trade-off**: Dropping `size` means consumers needing a wider
  dialog (e.g. for two-column form layouts) compose `Dialog`
  directly. The escape hatch covers the case but loses the
  pattern-level i18n.
  **Mitigation**: The escape-hatch sample in `.dev.mdx` shows
  the exact button + i18n boilerplate so the migration is
  mechanical; consider exposing the localized message strings
  under `@commercetools/nimbus` in a follow-up if the pattern
  of "escape hatch + reuse pattern labels" becomes common.

## Open Questions

- **Should the pattern expose its localized labels for reuse in
  the escape-hatch path?** Consumers dropping down to `Dialog`
  directly to get a custom size still want "Save" / "Cancel"
  localized. Decision deferred: ship without exporting the
  messages strings; revisit if the escape-hatch pattern becomes
  the dominant migration path.

- **Should `Dialog.CloseTrigger` be retained or suppressed?** The
  app-kit `FormDialog` renders an X close button in the header.
  Decision implied by the rest of the design: keep the X visible
  to give users a familiar dismiss affordance and treat its
  click as an `onCancel` invocation. Confirm during
  implementation that `Dialog.CloseTrigger` honours
  `isDisabled={isSaveLoading}` so the loading lockout extends to
  it.
