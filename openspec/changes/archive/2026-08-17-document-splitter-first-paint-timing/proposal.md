# Change: Specify Splitter's before-paint layout timing

## Why

`Splitter` already guarantees that the configured size is applied before the
first paint — the initial layout is derived synchronously during render, and a
controlled `size` change is adopted in a layout effect rather than a passive one.
`splitter.reconcile-timing.spec.tsx` is a dedicated regression guard for it.

The spec never says so. "Initial size from `defaultSize`" promises the size will
be applied, but not _when_, and the controlled `size` requirement is silent on
timing. That gap matters because the failure it prevents is visible: paired with
`useResponsiveSplitterSizes`, adopting the size in a passive effect paints a
50/50 frame before snapping to the configured proportion.

Timing that is implemented and regression-tested but unspecified is free to be
refactored away. This makes the guarantee explicit so it is protected.

## What Changes

- Add a requirement to the `nimbus-splitter` capability covering before-paint
  layout timing, with scenarios for the uncontrolled, controlled, and
  collapsed-on-mount seeds plus the same-commit controlled reconcile.

## What does NOT change

- No runtime behavior. The implementation and its regression test already
  satisfy every scenario added here; this change only records the contract.
- No public API change, so no changeset is required.
- The existing "Uncontrolled state model" and "Optional controlled `size` prop"
  requirements are left intact. The guarantee is cross-cutting, so it is stated
  once in its own requirement instead of duplicating a clause into both.

## Impact

- Affected specs: `nimbus-splitter` (one ADDED requirement)
- Affected code: none
