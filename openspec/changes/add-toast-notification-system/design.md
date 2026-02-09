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

### Foundation: Chakra UI / Ark UI (Zag.js)

Use Chakra UI's toast system (Zag.js state machine). Handles timers, queuing,
pause/resume, stacking, z-index, and animations out of the box.

### Per-Toast Placement: Multi-Toaster Facade

A `ToastManager` singleton lazily creates Zag.js toaster instances per unique
placement. Zag.js requires this because one toaster = one fixed-position
container = one placement (stacking math, ARIA regions, and keyboard nav all
depend on it).

Apps using a single placement still only create one toaster.

### Mounting: Inside NimbusProvider

`<ToastOutlet />` renders inside NimbusProvider. Lazy creation means zero DOM
nodes until the first toast is triggered.

### ARIA Roles

`role="status"` (polite) for info/success, `role="alert"` (assertive) for
warning/error. Set automatically based on type.

### Auto-Dismiss: 6 Seconds Default

Pause on hover, focus, and page idle. Toasts with actions don't auto-dismiss.

### Z-Index: Popover Level (1500)

Above modals (1400), below skipNav (1600).

## Risks / Trade-offs

- **Multi-toaster complexity** → Encapsulated in ToastManager; consumers never
  see it
- **NimbusProvider modification** → Low risk; single lazy child component
