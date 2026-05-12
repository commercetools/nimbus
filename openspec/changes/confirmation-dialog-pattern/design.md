## Context

The Merchant Center Application Kit's `ConfirmationDialog` is the
canonical "are you sure?" UI in the MC codebase: ~145 production
usages across six MC repositories, dominated by destructive flows
(delete / remove / discard / unpublish). Like its `InfoDialog`
sibling, it has accrued configuration props over time (`size`,
`zIndex`, `aria-label`, `getParentSelector`, `dataAttributesPrimaryButton`,
`dataAttributesSecondaryButton`, a `TextTitle` sub-component, an
`Intl` proxy export). A usage audit across every MC repository shows
that most of the configurable surface is unused or used inconsistently:

| Prop / surface | Usage across ~145 production instances (152 files) |
| --- | --- |
| `size` (default) | 61% (93 files) |
| `size` (any explicit value) | 39% (59 files; values include `"small"`, `"medium"`, `"l"`, `"big"`, `"scale"`, numeric strings — many outside the documented type union) |
| `labelPrimary` (custom Confirm label) | 52% (79 files) |
| `labelSecondary` (custom Cancel label) | 14% (21 files) |
| `isPrimaryButtonDisabled` | 17% (26 files) |
| `aria-label` | 4% (6 files) |
| `zIndex` | 5% (7 files) |
| `dataAttributesPrimaryButton` | 9% (13 files) |
| `dataAttributesSecondaryButton` | 5% (7 files) |
| `getParentSelector` | 0% |
| `ConfirmationDialog.TextTitle` | 0% |
| `onClose` and `onCancel` bound to the same handler | 55% (83 of 152 files) |
| `ConfirmationDialog.Intl` (proxy to `sharedMessages`) | 4% (6 files) |

The app-kit component does **not** expose an `intent="destructive"`
variant or a loading state, even though the surrounding usage is
overwhelmingly destructive (delete / remove / discard / unpublish
appear in the surrounding code of the majority of the audited call
sites) and many `onConfirm` handlers are async. The Nimbus pattern is
therefore an opinionated upgrade rather than a 1:1 port.

Nimbus's `Dialog` primitive already solves the cross-cutting modal
concerns via its recipe (z-index stacking with
`calc(var(--dialog-z-index) + var(--layer-index, 0))`), React Aria's
`Modal` + `ModalOverlay` (portaling), and `Dialog.CloseTrigger`
(localized close-button accessible name). The pattern layer can stay
thin and delegate.

The `FormActionBar` pattern
(`packages/nimbus/src/patterns/actions/form-action-bar/`) is the
nearest existing precedent for an action-bearing pattern with a
loading state: it uses `useLocalizedStringFormatter` from `@/hooks`,
defines pattern-owned messages in `.i18n.ts` keyed
`Nimbus.FormActionBar.*`, maps a destructive button to
`<Button variant="solid" colorPalette="critical">`, and disables both
buttons whenever any action is in flight. The ConfirmationDialog
pattern adopts these conventions verbatim where they apply.

## Goals / Non-Goals

### Goals

- Ship a low-friction API for the overwhelmingly common
  confirm/cancel dialog shape (>95% of audited usages)
- Default-localize the Confirm and Cancel labels so consumers don't
  have to wire `useIntl` boilerplate for the common case
- Provide a first-class `intent="destructive"` variant so the
  ubiquitous delete-confirmation pattern doesn't require manual
  Button styling at every call site
- Provide a first-class `isConfirmLoading` state so async confirm
  handlers can show a spinner and lock out further interaction without
  consumers re-implementing the spinner-and-disable boilerplate
- Delegate all modal mechanics (z-index, portal target, focus trap,
  dismissal wiring, `Escape` handling) to the underlying `Dialog`

### Non-Goals

- Configurable sizing at the pattern layer — consumers needing a
  non-default size drop down to `Dialog` directly (documented escape
  hatch)
- Per-button `data-*` attributes via dedicated props — Nimbus `Button`
  already accepts arbitrary `data-*` attributes via
  `[key: \`data-\${string}\`]: unknown` index signature; consumers
  needing per-button test IDs drop down to `Dialog`
- A proxy `ConfirmationDialog.Intl` for default messages — consumers
  override via `confirmLabel` / `cancelLabel` props, which already
  accept `ReactNode` (so an `intl.formatMessage(...)` call works
  unchanged)
- Auto-toggling `isConfirmLoading` from an awaited `onConfirm` return
  value — see Open Questions
- A `TextTitle` sub-component — zero consumer uptake, drop entirely

## Decisions

### Decision: Location under `patterns/dialogs/`

Place the component at
`packages/nimbus/src/patterns/dialogs/confirmation-dialog/`, alongside
the existing `info-dialog/`.

- **Alternatives considered**:
  - `components/confirmation-dialog/` (alongside the `Dialog`
    primitive) — rejected for the same reason as `InfoDialog`:
    primitive vs. pattern is the key mental model.
  - `patterns/confirmation-dialog/` (flat) — rejected to keep dialog
    patterns grouped under `dialogs/` for browsability and
    consistency with `InfoDialog`.
- **Rationale**: ConfirmationDialog is a canonical composition of
  Dialog parts plus two Buttons. The `dialogs/` sub-category is
  established by `InfoDialog`, and a future `FormDialog` pattern will
  also live here.

### Decision: Unify `onClose` and `onCancel` onto a single `onCancel`

The Nimbus pattern exposes a single `onCancel` callback, invoked by
the cancel button **and** by ambient dismiss affordances (Escape key,
overlay click). Pair it with `onOpenChange` for the rare consumer who
wants to react to the open-state transition independently of cancel
semantics.

- **Alternatives considered**:
  - Mirror the app-kit pair `onClose` (Escape/overlay) +
    `onCancel` (Cancel button click) — rejected because 55% of
    audited usages (83/152 files) bind both to the same handler;
    the distinction is mostly nominal in practice and the cognitive
    overhead at every call site doesn't pay for itself.
  - Drop `onCancel` entirely and rely solely on `onOpenChange(false)`
    — rejected because consumers commonly want a semantic "the user
    cancelled" hook (e.g. analytics, reverting optimistic state)
    distinct from the generic open-state change.
- **Rationale**: A single `onCancel` is the simplest mental model
  consistent with the dominant usage. Consumers who genuinely need to
  distinguish "user pressed Escape" from "user clicked Cancel" can
  drop down to the `Dialog` primitive (escape hatch) — and based on
  the audit, they are the minority.

### Decision: `intent` discriminator with two values

`intent?: "default" | "destructive"` (default `"default"`). The
discriminator maps to the underlying confirm `Button` as follows:

| `intent` | Confirm Button props |
| --- | --- |
| `"default"` | `variant="solid"` `colorPalette="primary"` |
| `"destructive"` | `variant="solid"` `colorPalette="critical"` |

The cancel `Button` is `variant="outline"` (no `colorPalette`) for
both intents.

- **Alternatives considered**:
  - Expose the underlying Button `variant` / `colorPalette` directly —
    rejected because it leaks the styling system into the pattern API
    and lets consumers create incoherent combinations
    (e.g. `colorPalette="positive"` for a destructive action).
  - A boolean `isDestructive` — rejected because future intents
    (e.g. `"warning"`) become awkward; a string discriminator is
    forward-compatible.
- **Rationale**: This mapping mirrors `FormActionBar`'s save vs.
  delete buttons exactly (`variant="solid"` + `colorPalette="primary"`
  vs. `variant="solid"` + `colorPalette="critical"`), keeping the
  three pattern components — `FormActionBar`, `InfoDialog`,
  `ConfirmationDialog` — visually consistent.

### Decision: `isConfirmLoading` locks the entire dialog, not just the confirm button

When `isConfirmLoading` is `true`:

- The confirm `Button` shows a `LoadingSpinner` (`size="2xs"`,
  `ml="100"`) next to its label, matching `FormActionBar`'s
  pattern, and is `isDisabled`.
- The cancel `Button` is also `isDisabled` — preventing the user
  from cancelling mid-flight after the confirm action has been
  dispatched but before it has resolved.
- The dialog's dismiss affordances (Escape, overlay click) are
  **disabled**: `Dialog.Root` receives `isDismissable={false}` and
  `isKeyboardDismissDisabled={true}` for the duration. The X close
  button in the header is also visually disabled (or the
  `Dialog.CloseTrigger` is suppressed via the same
  `isDismissable={false}` Dialog wiring — pick whichever the
  primitive natively supports during implementation).

- **Alternatives considered**:
  - Disable only the confirm button — rejected because it leaves
    cancel + Escape + overlay click all wired, which can fire
    `onCancel` after `onConfirm` has already been dispatched. That
    forces every consumer to track their own in-flight flag.
  - Leave dismiss affordances enabled but route them through a
    consumer-defined "are you sure you want to cancel?" prompt —
    rejected as out of scope for v1.
- **Rationale**: The pattern owns the lifecycle of the in-flight
  action, so it owns the lock. Consumers wanting partial behaviour
  (e.g. cancellable async confirm) drop down to `Dialog`.

### Decision: Default focus follows the Dialog primitive (first focusable)

For both `intent="default"` and `intent="destructive"`, initial focus
follows `Dialog.Root`'s default React Aria behaviour: the first
focusable element in tab order receives focus when the dialog opens.
With cancel rendered before confirm in the DOM (cancel on the left,
confirm on the right — the conventional layout), this lands focus on
the cancel button by default — which is the safer default for
destructive intent and acceptable for the default intent.

- **Alternatives considered**:
  - Explicitly autofocus the confirm button for `intent="default"`
    and the cancel button for `intent="destructive"` — rejected
    because it adds an `autoFocus` prop wiring at the pattern layer
    while the natural DOM order already produces the desired
    behaviour for the more important (destructive) case.
  - Always autofocus the cancel button — rejected as redundant
    given the natural DOM order achieves the same result.
- **Rationale**: No code is the simplest code. Document the focus
  order in `.dev.mdx` so the implicit contract is explicit.

### Decision: Pattern-owned i18n via `.i18n.ts` and `useLocalizedStringFormatter`

The pattern owns two strings — the default Confirm and Cancel button
labels. Author them in `confirmation-dialog.i18n.ts` as a `messages`
object with `id`, `description`, `defaultMessage` per entry; consume
via `useLocalizedStringFormatter(messages)` from `@/hooks`. Message
IDs follow the `Nimbus.ConfirmationDialog.*` namespace convention.

```ts
// confirmation-dialog.i18n.ts
export const messages = {
  confirm: {
    id: "Nimbus.ConfirmationDialog.confirm",
    description: "default label for the confirm button in a confirmation dialog",
    defaultMessage: "Confirm",
  },
  cancel: {
    id: "Nimbus.ConfirmationDialog.cancel",
    description: "default label for the cancel button in a confirmation dialog",
    defaultMessage: "Cancel",
  },
};
```

- **Alternatives considered**:
  - Reuse the `Nimbus.FormActionBar.cancel` message — rejected
    because cross-pattern message-key sharing creates implicit
    coupling that breaks if either pattern's wording diverges in
    future translations. Per-pattern keys keep ownership clean.
  - Skip i18n and require consumers to always pass `confirmLabel` /
    `cancelLabel` — rejected because 48% of audited usages take the
    default `Confirm` label and 86% take the default `Cancel`
    label; making consumers wire `useIntl` for those cases is a
    regression.
- **Rationale**: Mirrors `FormActionBar` (the only existing pattern
  that owns localized strings) for consistency.

### Decision: Drop `size`, `zIndex`, `getParentSelector`, `dataAttributesPrimaryButton`, `dataAttributesSecondaryButton`, `TextTitle`

These props are explicitly not part of the Nimbus surface area. The
escape hatch (drop down to the `Dialog` primitive) handles all of
them.

- **Rationale per surface**:
  - `size`: 39% of audited usages set it, but the values are wildly
    inconsistent (the audit uncovered values like `"big"`, `"30"`,
    `"40"` that aren't in the app-kit type union). Forcing
    consumers to migrate via the escape hatch is preferable to
    importing the inconsistency into Nimbus.
  - `zIndex`: 5% usage, and the `Dialog` recipe's
    `calc(var(--dialog-z-index) + var(--layer-index, 0))` z-index
    stacking already covers the vast majority of cases. Drop.
  - `getParentSelector`: 0% usage. Drop.
  - `dataAttributesPrimaryButton` / `dataAttributesSecondaryButton`:
    14% combined usage, all for `data-test-id` test selectors.
    Nimbus `Button` already accepts arbitrary `data-*` attributes,
    so the natural escape-hatch composition picks this up without a
    dedicated prop.
  - `TextTitle`: 0% usage. Drop.

### Decision: `confirmLabel` and `cancelLabel` are `ReactNode`, not `string`

Symmetric with `title` (which is `ReactNode`) and consistent with the
Nimbus `Button` accepting `ReactNode` children. Lets consumers pass
`intl.formatMessage(...)` results directly without coercion.

### Decision: `onConfirm` is Promise-aware; close defers to fulfillment

`onConfirm` is typed `() => void | Promise<void>`. When the consumer
returns a `Promise`, the pattern keeps the dialog open until the
promise settles: on fulfillment the pattern calls
`onOpenChange(false)`; on rejection the dialog stays open so the
consumer can surface the error and let the user retry. Synchronous
(`void`) handlers continue to close the dialog immediately, as
before.

This decision closes a defect surfaced in code review: the original
implementation called `onOpenChange(false)` synchronously after
`onConfirm()`, which meant the dialog vanished before any async work
could run — so a consumer-managed `isConfirmLoading` lockout would
never paint for the very async-confirm case the prop was designed
for. The fix is the minimal one consistent with the rest of the
design: keep `isConfirmLoading` consumer-controlled (no auto-toggle
— see the now-resolved Open Question below) and only delay the
pattern's own close call.

- **Alternatives considered**:
  - **Document a guard pattern.** Tell consumers to suppress
    `onOpenChange(false)` while a `useRef` mirror of their loading
    flag is true. Rejected — the required `useRef` workaround for
    stale closures is exactly the React-internals trap a flat
    pattern is supposed to absorb, and the failure mode (spinner
    silently doesn't render) is hard to diagnose.
  - **Stop calling `setOpen(false)` in `handleConfirm` entirely.**
    Push close-on-confirm onto every consumer. Rejected — breaks
    the flat-API promise the proposal sells (~95% of audited usages
    are simple confirm/cancel where the pattern handles dismissal),
    and the asymmetry with `handleCancelButton` (which still
    auto-closes) is actively confusing.
  - **Auto-toggle `isConfirmLoading` from the returned Promise.**
    Rejected — see the resolved Open Question below; this would
    introduce a hidden state machine and diverge from
    `FormActionBar`'s `isSaveLoading` precedent.
- **Rationale**: Promise-aware close is strictly additive at the
  type level (`void` widens to `void | Promise<void>`), preserves
  sync-confirm semantics unchanged, and makes the existing
  `isConfirmLoading` prop work correctly for the async case without
  introducing any new public API or hidden state.

### Decision: `aria-label` retained as an escape valve

By default the dialog's accessible name is derived from `title`. When
`title` is a composed `ReactNode` whose text content would produce a
confusing accessible name, consumers pass `aria-label`. Mirrors the
`InfoDialog` pattern exactly.

## Risks / Trade-offs

- **Risk**: 39% of app-kit consumers set an explicit `size` and 14%
  set per-button `data-*` test attributes. They will need to migrate
  to `Dialog` directly when this pattern rolls out.
  **Mitigation**: Document the escape hatch prominently with a
  runnable code sample in `.dev.mdx`; call it out in the migration
  notes when this pattern is rolled out under the FEC-428 epic; on
  the consumer side the migration tool / codemod can flag these
  cases and emit the escape-hatch composition automatically.

- **Risk**: Unifying `onClose` + `onCancel` onto a single `onCancel`
  is a semantic change for the 45% of consumers who wire them to
  different handlers. A consumer relying on "fire X only when the
  Cancel button is clicked, not when Escape is pressed" will see
  X fire on Escape under the new pattern.
  **Mitigation**: Document the unification explicitly in `.dev.mdx`
  with a "migrating from app-kit" note. Consumers needing the
  distinction drop down to `Dialog` (escape hatch).

- **Trade-off**: Locking the entire dialog while
  `isConfirmLoading` is `true` removes the user's ability to cancel
  an in-flight async confirm. For long-running operations this can
  feel unresponsive.
  **Mitigation**: For genuinely long operations, the consumer should
  close the dialog optimistically and show a Toast or progress
  indicator outside the dialog, rather than holding the dialog open
  with a spinner. Document this guidance in `.dev.mdx`.

- **Trade-off**: Dropping `TextTitle` means any consumer who later
  wants themed title styling must compose `Dialog` directly. Given
  zero current usage (matching the InfoDialog audit), the simplicity
  of the flat API wins.

## Open Questions

- **~~Should `onConfirm` support async (auto-toggle `isConfirmLoading`)?~~ Resolved.**
  The natural ergonomic improvement is for the pattern to detect
  that `onConfirm` returned a `Promise` and flip
  `isConfirmLoading` to `true` for the duration. We **do not** ship
  auto-toggle: keeping `isConfirmLoading` consumer-controlled is
  more explicit (no hidden state machine) and consistent with
  `FormActionBar`'s `isSaveLoading`. We **do** ship a related but
  smaller change — see the "`onConfirm` is Promise-aware; close
  defers to fulfillment" decision above. Revisit auto-toggle once
  the v1 surface has been in use for a release cycle and consumer
  demand is measurable.

- **Should the `Dialog.CloseTrigger` X button be retained or
  suppressed?** The app-kit ConfirmationDialog renders an X close
  button in the header that fires `onClose` (now unified onto
  `onCancel`). Decision implied by the rest of the design: keep
  the X visible for visual consistency with `InfoDialog` and treat
  its click as an `onCancel` invocation. Confirm during
  implementation that `Dialog.CloseTrigger` naturally routes
  through `onOpenChange(false)`, and that the pattern wires
  `onOpenChange` to also invoke `onCancel`.

- **Is the close-button accessible name "Close dialog" or "Cancel"?**
  `Dialog.CloseTrigger` ships with a localized "Close dialog"
  default. For ConfirmationDialog the X arguably means "Cancel" —
  but overriding the accessible name on a per-pattern basis breaks
  the consistency with `InfoDialog`. Default: leave the
  `Dialog.CloseTrigger` accessible name unchanged. Confirm during
  implementation.
