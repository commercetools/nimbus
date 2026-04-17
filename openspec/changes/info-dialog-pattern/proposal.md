# Change: Add InfoDialog Pattern Component

## Why

Consumers migrating from Merchant Center Application Kit need a Nimbus
replacement for the `InfoDialog` component. It is the most common read-only
informational dialog pattern in the MC codebase (~131 production usages).
Rather than require each consumer to compose `Dialog.Root`, `Dialog.Content`,
`Dialog.Header`, `Dialog.Title`, `Dialog.Body`, and `Dialog.CloseTrigger`
every time, Nimbus provides `InfoDialog` as a pre-configured pattern with a
flat, minimal API.

A usage audit of the app-kit component across every MC repository informs the
scope: 83% of usages take the default size, 96% pass a string title, and the
`TextTitle` sub-component has zero consumer uptake — so the Nimbus pattern
can drop the app-kit `size`, `zIndex`, `aria-label`, `getParentSelector`,
and `TextTitle` props without regressing real-world usage.

## What Changes

- **NEW** `InfoDialog` pattern at
  `packages/nimbus/src/patterns/dialogs/info-dialog/` — introduces a new
  `dialogs/` sub-category under `patterns/` alongside the existing
  `fields/` sub-category
- **NEW** Flat props API:
  - `title: ReactNode`
  - `isOpen?: boolean`
  - `onOpenChange?: (isOpen: boolean) => void`
  - `children: ReactNode`
- **NEW** Internally composes `Dialog.Root`, `Dialog.Content`,
  `Dialog.Header`, `Dialog.Title`, `Dialog.Body`, `Dialog.CloseTrigger`;
  no footer actions
- **NEW** Close affordances: X button in header, Escape key, overlay click
- **NEW** Stacking, sizing defaults, and portaling delegated entirely to
  the underlying Dialog primitive — no `size`, `zIndex`, or portal props
- **NEW** `.dev.mdx` documentation includes an "escape hatch" section
  showing the equivalent manual Dialog composition for consumers needing
  custom size or dismiss behaviour
- **MODIFIED** `packages/nimbus/src/patterns/index.ts` adds new
  `./dialogs` export

## Impact

- Affected specs: none (new capability `nimbus-info-dialog`)
- Affected code:
  - `packages/nimbus/src/patterns/dialogs/info-dialog/` (new)
  - `packages/nimbus/src/patterns/dialogs/index.ts` (new)
  - `packages/nimbus/src/patterns/index.ts` (export added)

## Related

- Jira: FEC-437
- Parent epic: FEC-428 (Application-Components Migration to Nimbus)
- Replaces: `merchant-center-application-kit` `InfoDialog` component
