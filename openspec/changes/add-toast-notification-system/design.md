# Design: Toast Notification System

## Context

Nimbus needs transient notifications. No toast component exists today — the
Alert component is persistent and inline, covering a different use case.

## Goals / Non-Goals

- **Goals:**
  - Zero-setup consumer experience (just call `toast()`)
  - Per-toast placement without consumer-managed toasters
  - WCAG 2.1 AA compliance with ARIA role differentiation
  - 4 variants: info, success, warning, error
  - Action buttons and promise/loading pattern in v1
  - i18n support for library strings

- **Non-Goals:**
  - Notification center / persistent history
  - Swipe-to-dismiss on mobile
  - Toast grouping/collapsing for high-volume scenarios

## Decisions

### Foundation: Chakra UI Toast System

Use Chakra UI's `createToaster` API. Handles timers, queuing, pause/resume,
stacking, z-index, and animations out of the box.

### Per-Toast Placement: Multi-Toaster Facade

A `ToastManager` singleton lazily creates toaster instances per unique placement.
Chakra's toast system requires this because one toaster = one fixed-position
container = one placement (stacking, ARIA regions, and keyboard nav all depend
on it).

Apps using a single placement still only create one toaster.

### Mounting: Inside NimbusProvider

`<ToastOutlet />` renders inside NimbusProvider. Lazy creation means zero DOM
nodes until the first toast is triggered.

### ARIA Roles

`role="status"` (polite) for info/success, `role="alert"` (assertive) for
warning/error. Chakra defaults to `role="status"` on all toasts — Nimbus
`Toast.Root` must override the role and `aria-live` attributes based on type.

### Auto-Dismiss: 6 Seconds Default

Pause on hover, focus, and page idle. Toasts with actions don't auto-dismiss
(`ToastManager.create()` enforces `duration: 0` — Chakra does not do this
automatically).

### Z-Index: Popover Level (1500)

Above modals (1400), below skipNav (1600).

### Hotkeys: Per-Placement Numpad Mapping

Each store gets a unique hotkey based on numpad positions (Alt+Shift+1–9). Since
stores are lazily created, only active placements register keyboard listeners.

### Closable Property

Exposed via `closable` prop on toast options. Useful for hiding the close button
during loading states.

## Risks / Trade-offs

- **Multi-toaster complexity** → Encapsulated in ToastManager; consumers never
  see it
- **NimbusProvider modification** → Low risk; single lazy child component
- **ARIA role override** → Chakra defaults to `role="status"`, so Nimbus must
  override for warning/error. Low risk; props are spread after base props.
- **Toaster render pattern** → Each `<Toaster>` requires a `toaster` store prop
  and a `children` render function. Documented in ToastOutlet implementation.
