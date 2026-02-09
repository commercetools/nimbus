# Toast Notification System — Design Plan

**Date:** 2026-02-09 **Branch:** CRAFT-1853-nimbus-toast-notification-system
**Status:** Brainstormed, awaiting implementation

---

## Context

Stakeholder ticket requested a toast notification system. Original ticket had
several issues identified through research (wrong styling tech, missing
variants, incomplete accessibility requirements). This plan is the corrected,
research-backed design.

### Original Ticket Issues Corrected

1. Tailwind CSS → Chakra UI slot recipes
2. react-aria-components exclusively → Ark UI/Chakra (already in deps)
3. 3 variants → 4 (added warning)
4. 5s timeout → 6s default (5s is WCAG minimum, not recommended)
5. Timer pause hover-only → hover + focus + page idle
6. Added: ARIA role differentiation, prefers-reduced-motion, queuing/max limit,
   i18n, z-index strategy, focus management, action buttons, promise pattern,
   portal rendering, F6 landmark navigation

---

## Consumer API

```typescript
import { toast } from "@commercetools/nimbus";

// Basic usage
toast({ title: "Settings saved" });

// With variant, description, and placement
toast({
  type: "success",
  title: "Profile updated",
  description: "Your changes are now live.",
  placement: "top-end", // optional, defaults to 'top-end'
});

// Convenience methods
toast.info({ title: "New version available" });
toast.success({ title: "Item created" });
toast.warning({ title: "This action cannot be undone" });
toast.error({ title: "Connection lost", description: "Retrying..." });

// With action button (toast won't auto-dismiss)
toast.success({
  title: "Item deleted",
  action: { label: "Undo", onClick: () => restoreItem() },
});

// Promise pattern — single toast transitions through states
toast.promise(saveData(), {
  loading: { title: "Saving..." },
  success: { title: "Saved!" },
  error: (err) => ({ title: "Failed", description: err.message }),
});

// Programmatic control
const id = toast({ title: "Uploading..." });
toast.update(id, { title: "Upload complete", type: "success" });
toast.dismiss(id); // with exit animation
toast.dismiss(); // dismiss all
```

### Key API Decisions

- `type` not `variant` — aligns with Zag.js/Ark UI naming
- `placement` defaults to `'top-end'` but is overridable per-toast
- `action` presence automatically disables auto-dismiss (WCAG compliance)

---

## Internal Architecture

### Foundation

Chakra UI / Ark UI (Zag.js state machine). We import only from
`@chakra-ui/react`, never from `@zag-js/*` or `@ark-ui/*` directly.

### Multi-Toaster Facade

Zag.js ties placement to the toaster instance (one fixed-position DOM container
per placement). This is intentional:

1. **DOM**: One toaster = one fixed-position container = one placement
2. **Stacking**: Height calculations require siblings in the same container
3. **ARIA**: Each region needs a distinct label including its placement
4. **Keyboard**: Hotkeys focus a specific region by placement

To support per-toast placement, a `ToastManager` singleton lazily creates and
caches Zag.js toaster instances per placement:

```typescript
class ToastManager {
  private toasters = new Map<Placement, CreateToasterReturn>();
  private defaultPlacement: Placement = "top-end";

  private getOrCreate(placement: Placement) {
    if (!this.toasters.has(placement)) {
      this.toasters.set(
        placement,
        createToaster({
          placement,
          max: 3,
          duration: 6000,
          pauseOnPageIdle: true,
        })
      );
    }
    return this.toasters.get(placement)!;
  }

  create(options: ToastOptions) {
    const placement = options.placement ?? this.defaultPlacement;
    const toaster = this.getOrCreate(placement);
    return toaster.create(options);
  }

  dismiss(id?: string) {
    /* routes to correct toaster via idToPlacement map, or all */
  }
  update(id: string, options: Partial<ToastOptions>) {
    /* find & update */
  }
}
```

ID tracking: `idToPlacement` map populated on every `.create()` call, enabling
`toast.dismiss(id)` and `toast.update(id)` to route to the correct toaster.

### NimbusProvider Integration

`<ToastOutlet />` renders inside NimbusProvider, subscribing to the manager and
rendering a `<Toaster>` for each active placement. Apps that never call
`toast()` get zero extra DOM nodes (lazy creation).

```tsx
<ChakraProvider value={system}>
  <NimbusColorModeProvider>
    <NimbusI18nProvider locale={locale}>
      {children}
      <ToastOutlet />
    </NimbusI18nProvider>
  </NimbusColorModeProvider>
</ChakraProvider>
```

---

## Component Structure

### File Structure

```
packages/nimbus/src/components/toast/
├── toast.tsx                    # Compound export: Toast.Root, .Title, etc.
├── toast.recipe.ts              # Slot recipe (nimbusToast)
├── toast.slots.tsx              # createSlotRecipeContext wrappers
├── toast.types.ts               # Consumer-facing types
├── toast.manager.ts             # ToastManager singleton + toast() API
├── toast.outlet.tsx             # <ToastOutlet /> for NimbusProvider
├── toast.i18n.ts                # i18n source messages
├── toast.messages.ts            # Auto-generated compiled messages
├── toast.stories.tsx            # Storybook stories with play functions
├── toast.spec.tsx               # Unit tests (manager logic)
├── toast.docs.spec.tsx          # Consumer implementation tests
├── components/                  # Sub-component implementations
│   ├── toast.root.tsx
│   ├── toast.title.tsx
│   ├── toast.description.tsx
│   ├── toast.action-trigger.tsx
│   ├── toast.close-trigger.tsx
│   └── index.ts
├── intl/
│   ├── en.ts, de.ts, es.ts, fr-FR.ts, pt-BR.ts
└── index.ts
```

### Slot Recipe

```typescript
import { defineSlotRecipe } from "@chakra-ui/react/styled-system";

export const toastRecipe = defineSlotRecipe({
  slots: [
    "root",
    "title",
    "description",
    "icon",
    "actionTrigger",
    "closeTrigger",
  ],
  className: "nimbus-toast",

  base: {
    root: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: "200",
      width: "100%",
      alignItems: "start",
      padding: "300",
      borderRadius: "200",
      boxShadow: "4",
      backgroundColor: "colorPalette.2",
      border: "solid-25",
      borderColor: "colorPalette.5",
    },
    icon: {
      gridColumn: "1",
      gridRow: "1",
      marginTop: "50",
      "& svg": {
        width: "500",
        height: "500",
        color: "colorPalette.11",
      },
    },
    title: {
      gridColumn: "2",
      order: "1",
      fontWeight: "500",
      fontSize: "400",
      color: "colorPalette.11",
    },
    description: {
      gridColumn: "2",
      order: "2",
      fontSize: "350",
      color: "colorPalette.11",
    },
    actionTrigger: {
      gridColumn: "2",
      order: "3",
    },
    closeTrigger: {
      gridColumn: "3",
      gridRow: "1",
    },
  },

  variants: {},
});
```

### Type-to-Palette Mapping

| Toast type | `colorPalette` | Icon                 |
| ---------- | -------------- | -------------------- |
| `info`     | `info`         | `Info`               |
| `success`  | `positive`     | `CheckCircleOutline` |
| `warning`  | `warning`      | `WarningAmber`       |
| `error`    | `critical`     | `ErrorOutline`       |

### Registration

In `src/theme/slot-recipes/index.ts`:

```typescript
export { toastRecipe } from "@/components/toast/toast.recipe";
// key: nimbusToast
```

---

## Accessibility

### ARIA Roles by Type

| Type      | ARIA role | `aria-live` | Rationale                          |
| --------- | --------- | ----------- | ---------------------------------- |
| `info`    | `status`  | `polite`    | Non-urgent, waits for SR to finish |
| `success` | `status`  | `polite`    | Confirmations are non-interruptive |
| `warning` | `alert`   | `assertive` | Urgent, announces immediately      |
| `error`   | `alert`   | `assertive` | Critical, announces immediately    |

Set automatically by `Toast.Root` based on `type` — consumers don't configure
this.

### Keyboard Navigation

- **Escape**: Dismisses focused toast (Zag.js native)
- **F6 / Shift+F6**: Navigate to/from toast landmark region (Zag.js native)
- **Alt+T**: Configurable hotkey to jump to toast region (Zag.js default)
- **Tab**: Cycles through interactive elements (close button, action button)
- Focus indicators: `_focusVisible: { focusRing: "outside" }`

### Focus Management

- Toasts do NOT steal focus — use live regions for announcements
- F6/Alt+T navigates to most recent toast
- Dismissing last focused toast restores focus to previously focused element
  (Zag.js tracks `lastFocusedEl`)

### prefers-reduced-motion

```typescript
"@media (prefers-reduced-motion: reduce)": {
  animationDuration: "0s !important",
  transitionDuration: "0s !important",
},
```

### Additional WCAG 4.1.3 Compliance

- Each region labeled: `aria-label="top-end Notifications"` (auto by Zag.js)
- Close button: i18n `aria-label` via `msg.format("dismiss")`
- Icons: `aria-hidden="true"` (decorative, color is not sole indicator)
- Action buttons: visible text labels, not icon-only

---

## Behavior

### Auto-Dismiss

- Default: **6 seconds**
- Configurable per-toast: `duration: 8000`
- `duration: 0` disables auto-dismiss
- Toasts with `action` automatically get `duration: 0`

### Timer Pausing

Timers pause on:

- Hover over any toast in region
- Focus on any element within a toast
- Browser tab losing visibility (`pauseOnPageIdle: true`)

Resume from paused position when hover/focus leaves.

### Queuing and Stacking

- Max **3 visible** per placement region
- FIFO queue for overflow
- Vertical stack with `gap: 16px`
- Newest at screen edge (top of stack for `top-*`, bottom for `bottom-*`)

### Dismissal Methods

| Method               | Behavior                         |
| -------------------- | -------------------------------- |
| Close button click   | Dismisses with exit animation    |
| Escape key (focused) | Dismisses focused toast          |
| Auto-dismiss timer   | Dismisses after duration         |
| `toast.dismiss(id)`  | Programmatic with animation      |
| `toast.dismiss()`    | Dismisses all across all regions |

### Promise Lifecycle

1. **Loading**: Spinner icon, no auto-dismiss, no close button
2. **Success/Error**: Replaces content, starts timer, close button appears

### Z-Index

`zIndex: "popover"` (1500) — above modals (1400), below skipNav (1600).

---

## i18n

Source (`toast.i18n.ts`):

```typescript
export const messages = {
  dismiss: {
    id: "Nimbus.Toast.dismiss",
    description: "aria-label for the close button in a toast notification",
    defaultMessage: "Dismiss",
  },
};
```

Pre-compiled to en, de, es, fr-FR, pt-BR via `pnpm extract-intl`.

Only library string is the dismiss label. Title, description, and action label
are consumer-provided content.

---

## Exports

From `toast/index.ts`:

```typescript
export { Toast } from "./toast"; // Compound component
export { toast } from "./toast.manager"; // Imperative API
export { ToastOutlet } from "./toast.outlet"; // For NimbusProvider (internal)
export type { ToastProps, ToastOptions } from "./toast.types";
```

Consumer-facing: `toast` (function) and `ToastOptions` (type). `ToastOutlet` is
internal — consumed only by NimbusProvider.

---

## Testing Strategy

### Story Tests (`toast.stories.tsx`)

| Story                      | Tests                                                        |
| -------------------------- | ------------------------------------------------------------ |
| `BasicToast`               | Each type with correct icon and colorPalette                 |
| `AutoDismiss`              | Toast disappears after duration; DOM removal                 |
| `PauseOnHover`             | Hover pauses timer; leave resumes and dismisses              |
| `PauseOnFocus`             | Tab into toast pauses timer                                  |
| `DismissButton`            | Click close → toast removed with animation                   |
| `EscapeKey`                | Focus region, Escape → dismissed                             |
| `ActionButton`             | Renders button, no auto-dismiss, callback fires              |
| `PromisePattern`           | Loading → success; loading → error transitions               |
| `Stacking`                 | 3 toasts stack; 4th queues until slot frees                  |
| `MultiPlacement`           | Different placements render separate regions                 |
| `ScreenReaderAnnouncement` | info/success: `role="status"`, warning/error: `role="alert"` |
| `ReducedMotion`            | No slide/transition with prefers-reduced-motion              |

### Unit Tests (`toast.spec.tsx`)

- ToastManager: lazy toaster creation per placement
- ToastManager: ID routing for dismiss/update
- Convenience methods set correct `type`
- Promise: resolves → success, rejects → error
- Action presence sets `duration: 0`

### Consumer Tests (`toast.docs.spec.tsx`)

- Basic: trigger success toast from button click
- Form: loading → success/error from async submit
- Undo: action toast with undo callback
- Custom placement: `placement: 'bottom-end'`

### Workflow

```bash
pnpm --filter @commercetools/nimbus build && pnpm test packages/nimbus/src/components/toast/toast.stories.tsx
```

---

## Decision Log

| Decision        | Choice                                                     |
| --------------- | ---------------------------------------------------------- |
| Foundation      | Chakra UI / Ark UI (Zag.js)                                |
| Consumer API    | `toast()` function, no setup needed                        |
| Mounting        | Automatic inside NimbusProvider                            |
| Placement       | Per-toast, default `top-end`, multi-toaster facade         |
| Variants        | info, success, warning, error (4 types)                    |
| Actions         | v1, with auto `duration: 0`                                |
| Promise pattern | v1, loading → success/error                                |
| Auto-dismiss    | 6s default, pause on hover + focus + page idle             |
| Max visible     | 3 per region, FIFO queue                                   |
| Z-index         | `popover` (1500)                                           |
| ARIA            | `role="status"` info/success, `role="alert"` warning/error |
| Reduced motion  | Disable slide/fade transitions                             |
| Styling         | Chakra slot recipe with `colorPalette` tokens              |
| i18n            | One message: dismiss label (5 locales)                     |
| Testing         | Stories (interactions), unit (manager), consumer (docs)    |
