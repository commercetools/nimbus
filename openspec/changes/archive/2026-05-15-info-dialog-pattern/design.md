## Context

The Merchant Center Application Kit's `InfoDialog` has accrued configuration
props over time (`size`, `zIndex`, `aria-label`, `getParentSelector`, a
`TextTitle` sub-component). A usage audit across every MC repository shows
that most of this surface area is unused in practice:

| Prop / surface | Usage across ~131 production instances |
| --- | --- |
| `size` (default) | 83% (94 files) |
| `size` (any explicit value) | 17% (19 files, dominated by `size={16}`) |
| `title` as string | 96% (126 files) |
| `title` as ReactNode | 4% (5 files, mostly badge/icon + heading) |
| `TextTitle` sub-component | 0% (zero consumer usages across 10 repos) |
| `zIndex` | Rare; handled by Dialog primitive |
| `getParentSelector` | Rare; handled by React Aria portaling |

Nimbus's `Dialog` primitive already solves the cross-cutting concerns via
its recipe (z-index stacking with
`calc(var(--dialog-z-index) + var(--layer-index, 0))`) and React Aria's
`Modal` + `ModalOverlay` (portaling). That means the pattern layer can
stay thin.

## Goals / Non-Goals

### Goals

- Ship a low-friction API for the overwhelmingly common read-only
  informational dialog shape
- Maintain feature parity for the >95% case (string or composed-JSX title,
  default size, default dismiss behaviour)
- Delegate all modal mechanics (z-index, portal target, focus trap,
  dismissal wiring) to the underlying `Dialog`

### Non-Goals

- Configurable sizing at the pattern layer — consumers needing a
  non-default size drop down to `Dialog` directly (documented escape hatch)
- `TextTitle` sub-component — zero consumer uptake in app-kit, drop
  entirely
- Duplicating `aria-label` enforcement at the component boundary — a11y
  linting in consumer repositories is the intended layer for catching
  missing accessible names on non-string titles

## Decisions

### Decision: Location under `patterns/dialogs/`

Place the component at `packages/nimbus/src/patterns/dialogs/info-dialog/`,
introducing a new `dialogs/` sub-category next to the existing `fields/`
sub-category.

- **Alternatives considered**:
  - `components/info-dialog/` (alongside the `Dialog` primitive) —
    rejected because the primitive vs. pattern distinction is the key
    mental model: primitive = building block, pattern = pre-configured
    composition.
  - `patterns/info-dialog/` (flat, no sub-category) — rejected because
    future dialog patterns (`FormDialog`, `ConfirmationDialog`) will need
    a home, and grouping them under `dialogs/` mirrors the app-kit
    structure consumers are already familiar with.
- **Rationale**: InfoDialog is not a new primitive, it is a canonical
  composition of Dialog parts. The `patterns/` directory is the right
  home, and the `dialogs/` sub-category prepares for sibling patterns
  expected under the same migration epic.

### Decision: `title` is `ReactNode`, not `string`

Five concrete app-kit usages (identity SSO, discount-group info dialog,
risks-stepper, and two discount-description dialogs) pass composed JSX
(badge + heading, icon + heading). Keeping the prop as `ReactNode` avoids
a regression for these consumers and keeps the API symmetric with other
Nimbus components.

### Decision: No `aria-label` prop

`Dialog.Root` already accepts `aria-label` via its own API. Consumers
passing a non-string `title` who need an explicit accessible label can
compose `Dialog` directly (escape hatch). Avoiding duplication at the
pattern layer keeps the flat API flat; accessibility linting in consumer
repos catches missing labels when they matter.

### Decision: Dismiss behaviour defaults on

Forward `isDismissable` as enabled to `Dialog.Root` so clicking the
overlay or pressing Escape closes the dialog. This matches app-kit's
behaviour when `onClose` is provided and aligns with user expectations
for a read-only dialog with no forms to lose.

## Risks / Trade-offs

- **Risk**: The 19 app-kit consumers who set an explicit `size` will need
  to migrate to `Dialog` directly when the time comes.
  **Mitigation**: Document the escape hatch prominently with a runnable
  code sample in `.dev.mdx`; call it out in the migration notes when this
  pattern is rolled out.

- **Trade-off**: Dropping `TextTitle` means any consumer who later wants
  themed title styling must compose `Dialog` directly. Given zero current
  usage, the simplicity of the flat API wins. If demand emerges, we can
  revisit without breaking existing consumers.

## Open Questions

- **Does the pattern need a `.i18n.ts` file?** The only user-facing
  string the pattern itself owns is the close-button accessible name,
  which is already provided by `Dialog.CloseTrigger`'s default
  `aria-label="Close dialog"`. Existing patterns (e.g.
  `text-input-field`) ship without `.i18n.ts`. Current expectation:
  no `.i18n.ts` required; confirm during implementation.
