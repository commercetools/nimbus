# Design: Toast Notification System

## Context

Nimbus needs transient notifications. The Alert component is persistent and
inline, covering a different use case.

## Goals / Non-Goals

- **Goals:**
  - Zero-setup consumer experience (just call `toast()`)
  - Per-toast placement without consumer-managed toasters
  - WCAG 2.1 AA compliance with ARIA role differentiation
  - 4 types: info, success, warning, error (plus loading for promise pattern)
  - 3 visual variants: solid, subtle, accent-start
  - Action buttons and promise/loading pattern
  - i18n support for library strings (deferred — hardcoded label for now)

- **Non-Goals:**
  - Notification center / persistent history
  - Swipe-to-dismiss on mobile
  - Toast grouping/collapsing for high-volume scenarios

## Decisions

### Foundation: Chakra UI Toast System

Use Chakra UI's `createToaster` API. Handles timers, queuing, pause/resume,
stacking, z-index, and animations out of the box.

Rendering uses Chakra's built-in `Toast.Root`, `Toast.Title`,
`Toast.Description`, `Toast.ActionTrigger` subcomponents — styled via a Nimbus
slot recipe registered under the `toast` key to override Chakra's defaults.

### Per-Toast Placement: Lazily-Initialized Toasters

All 4 toaster instances (one per corner placement) are lazily initialized on
first access in `toast.toasters.ts`. Only corner placements are supported
(`top-start`, `top-end`, `bottom-start`, `bottom-end`) to minimize persistent DOM
elements. Center placements (`top`, `bottom`) were removed since on-demand
rendering is not feasible. A `ToastManager` singleton routes toast IDs to the
correct toaster via an `idToPlacement` map. Consumers just pass `placement` to
`toast()`.

Lazy initialization avoids module-level side effects, improving tree-shaking,
SSR safety (no state machines created during server rendering), and test
isolation. The underlying Zag.js store is SSR-safe (no DOM access at creation
time), but lazy init is preferred as a general best practice.

The `idToPlacement` map entry for a toast is cleaned up when the toast is
dismissed (`dismiss()`) or removed (`remove()`). Both single-ID and
dismiss/remove-all paths clear their respective entries to prevent unbounded map
growth in long-lived SPAs.

### Mounting: Inside NimbusProvider

`<ToastOutlet />` renders inside NimbusProvider. The Chakra `<Toaster>`
components always render their container elements (`<div role="region">`), but
these are empty until toasts are triggered.

A `ToastOutletMountedContext` (React context) prevents duplicate outlets when
NimbusProviders are nested. Only the outermost provider renders the outlet.
Without this guard, nested providers produce duplicate landmark regions that
violate WCAG's landmark-unique rule.

**On-demand rendering was considered and rejected.** Lazily mounting `<Toaster>`
on first toast creation fails because the underlying Zag.js state machine starts
asynchronously (via `queueMicrotask` in `useSafeLayoutEffect`) and the
`subscribeToStore` effect only receives future events — meaning the machine
misses the initial toast that triggered the mount.

### ARIA Roles

`role="status"` (polite) for info/success, `role="alert"` (assertive) for
warning/error. Chakra defaults all toasts to `role="status"` — the `ToastOutlet`
overrides role and `aria-live` on `Toast.Root` based on toast type.

### Auto-Dismiss: 6 Seconds Default

Managed by `ToastManager.create()` which sets `duration: 6000` by default.
Pause on hover/focus is Chakra's built-in behavior (`pauseOnInteraction: true`).
Pause on page idle enabled via `pauseOnPageIdle: true`.

Action buttons do not override the toast duration. Consumers control duration
independently — an action toast auto-dismisses at the default 6s unless the
consumer explicitly sets `duration: Infinity`.

### Visual Variants

Three visual variants control toast appearance:

- **accent-start** (default): Neutral background with a 3px colored accent line
  on the inline-start edge. Appropriate for most use cases.
- **solid**: Bold colored background with contrast text. High visual prominence.
- **subtle**: Subtle colored background with an inset border.

Consumers set the variant via the top-level `variant` option on `ToastOptions`.
Internally, `ToastManager` tunnels it through Chakra's `meta` bag (since Chakra's
toaster API has no native variant field). The `ToastOutlet` reads `meta.variant`
to set the recipe variant on `ChakraToast.Root`. The `meta` property is not
exposed to consumers.

### Hotkeys: Per-Placement Numpad Mapping

Each toaster gets a unique hotkey based on numpad corner positions:
`Alt+Shift+7` (top-start), `Alt+Shift+9` (top-end), `Alt+Shift+1`
(bottom-start), `Alt+Shift+3` (bottom-end). Pressing the hotkey focuses the
corresponding toast region.

### Modal Interaction: React Aria Top-Layer

When a React Aria modal (Dialog) opens, it calls `ariaHideOutside` which sets
`inert` on all sibling DOM elements to enforce focus trapping. Because Zag.js
toast regions render as top-level `<div>` elements (siblings of the modal),
they would become inert — blocking all pointer events on close buttons and
action buttons, even though the toast visually renders above the modal via
z-index.

The fix uses React Aria's built-in escape hatch: adding
`data-react-aria-top-layer="true"` to each `<Toaster>` component. React Aria's
`ariaHideOutside` explicitly skips elements with this attribute during both the
initial walk and the MutationObserver callback for dynamically added nodes. Ark
UI's `<Toaster>` merges extra props onto the group container via
`mergeProps(api.getGroupProps(), localProps)`, so the attribute propagates to
the rendered `<div>`.

### Closable Property

Consumers set the `closable` option on `ToastOptions`. Internally, `ToastManager`
tunnels it through Chakra's `meta` bag. The `ToastOutlet` reads `meta.closable`
to show/hide the close button. Defaults to `false` for timed toasts and
`true` for persistent toasts (`duration: Infinity`). Note: for
`toast.promise()`, options are passed directly to Chakra's `toaster.promise()` —
the `closable` property follows Chakra's native handling in that path.

## Risks / Trade-offs

- **Lazily-initialized toasters** → 4 empty container divs in DOM once
  initialized (one per corner). Reduced from 6 by removing center placements.
  Toasters are created on first access (not at import time), avoiding
  module-level side effects for SSR safety and tree-shaking. On-demand
  per-toast rendering not feasible due to Zag.js machine timing.
- **NimbusProvider modification** → Low risk; single child component with
  context guard for nested provider safety.
- **ARIA role override** → Low risk; props spread after Chakra's base props.
- **Recipe key override** → Registering as `toast` (not `nimbusToast`) to
  override Chakra's default styling. Works because Chakra's Toast components
  look up the `toast` recipe key.
