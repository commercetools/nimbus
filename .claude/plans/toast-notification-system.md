# Toast Notification System — Design Plan

**Date:** 2026-02-09 **Branch:** CRAFT-1853-nimbus-toast-notification-system
**Status:** Brainstormed, awaiting implementation

---

## Context

Stakeholder ticket requested a toast notification system. Original ticket had
several issues identified through research (wrong styling tech, missing
variants, incomplete accessibility requirements). This plan is the corrected,
research-backed design.

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
toast.remove(id); // immediate removal (no exit animation)

// Closable control
toast.loading({ title: "Saving...", closable: false }); // no close button
```

### Key API Decisions

- `type` not `variant` — aligns with Chakra UI naming
- `placement` defaults to `'top-end'` but is overridable per-toast
- `action` presence disables auto-dismiss (WCAG compliance) — enforced by
  `ToastManager.create()`, not automatic in Chakra
- `closable` controls close button visibility (useful for loading state)
- Both `toast.dismiss(id)` (animated) and `toast.remove(id)` (immediate) exposed

---

## Internal Architecture

### Foundation

Chakra UI toast system (`createToaster` from `@chakra-ui/react`).

### Multi-Toaster Facade

Chakra's toast system ties placement to the toaster instance — one
fixed-position container per placement. This means stacking, ARIA regions, and
hotkeys are all scoped to a single placement.

To support per-toast placement, a `ToastManager` singleton lazily creates and
caches toaster store instances per placement:

```typescript
class ToastManager {
  private stores = new Map<Placement, CreateToasterReturn>();
  private idToPlacement = new Map<string, Placement>();
  private listeners = new Set<() => void>();
  private defaultPlacement: Placement = "top-end";

  private getOrCreate(placement: Placement): CreateToasterReturn {
    if (!this.stores.has(placement)) {
      const store = createToaster({
        placement,
        duration: 6000,
        pauseOnPageIdle: true,
        hotkey: PLACEMENT_HOTKEYS[placement],
      });
      this.stores.set(placement, store);
      this.notifyListeners(); // ToastOutlet needs to know about new stores
    }
    return this.stores.get(placement)!;
  }

  create(options: ToastOptions) {
    const placement = options.placement ?? this.defaultPlacement;
    const store = this.getOrCreate(placement);

    // Chakra does NOT auto-disable dismiss for action toasts.
    // We enforce WCAG compliance by setting duration: 0 when action is present.
    const resolved = options.action
      ? { ...options, duration: options.duration ?? 0 }
      : options;

    const id = store.create(resolved);
    this.idToPlacement.set(id, placement);
    return id;
  }

  dismiss(id?: string) {
    if (id) {
      const placement = this.idToPlacement.get(id);
      if (placement) this.stores.get(placement)?.dismiss(id);
    } else {
      this.stores.forEach((store) => store.dismiss());
    }
  }

  remove(id?: string) {
    if (id) {
      const placement = this.idToPlacement.get(id);
      if (placement) this.stores.get(placement)?.remove(id);
    } else {
      this.stores.forEach((store) => store.remove());
    }
  }

  update(id: string, options: Partial<ToastOptions>) {
    const placement = this.idToPlacement.get(id);
    if (placement) this.stores.get(placement)?.update(id, options);
  }

  /** Returns all active stores for ToastOutlet to render */
  getActiveStores(): Array<{
    placement: Placement;
    store: CreateToasterReturn;
  }> {
    return Array.from(this.stores.entries()).map(([placement, store]) => ({
      placement,
      store,
    }));
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }
}
```

ID tracking: `idToPlacement` map populated on every `.create()` call, enabling
`toast.dismiss(id)`, `toast.remove(id)`, and `toast.update(id)` to route to the
correct store.

### ToastOutlet and Toaster Render Pattern

The Chakra `<Toaster>` component requires two things:

1. A `toaster` prop — the `CreateToasterReturn` store instance
2. A `children` render function — `(toast: ToastOptions) => ReactNode`

`<ToastOutlet />` subscribes to the manager and renders one `<Toaster>` per
active placement. Each `<Toaster>` uses the render function to compose Nimbus
`Toast.*` compound components:

```tsx
function ToastOutlet() {
  const [stores, setStores] = useState(manager.getActiveStores());

  useEffect(
    () =>
      manager.subscribe(() => {
        setStores(manager.getActiveStores());
      }),
    []
  );

  if (stores.length === 0) return null; // Zero DOM nodes until first toast

  return (
    <>
      {stores.map(({ placement, store }) => (
        <Toaster key={placement} toaster={store}>
          {(toast) => (
            <Toast.Root toast={toast}>
              <Toast.Icon />
              <Toast.Title />
              <Toast.Description />
              <Toast.ActionTrigger />
              <Toast.CloseTrigger />
            </Toast.Root>
          )}
        </Toaster>
      ))}
    </>
  );
}
```

### NimbusProvider Integration

`<ToastOutlet />` renders inside NimbusProvider. Apps that never call `toast()`
get zero extra DOM nodes (lazy creation).

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

**Implementation note:** Chakra's toast system defaults to `role="status"` on
all toasts regardless of type. The Nimbus `Toast.Root` component MUST override
the role based on type by spreading after the base props:

```tsx
// In toast.root.tsx
const baseProps = toastContext.getRootProps();
const role = type === "warning" || type === "error" ? "alert" : "status";
const ariaLive =
  type === "warning" || type === "error" ? "assertive" : "polite";

return (
  <ToastRootSlot {...baseProps} role={role} aria-live={ariaLive}>
    {children}
  </ToastRootSlot>
);
```

Consumers don't configure this — it's automatic based on `type`.

### Keyboard Navigation

- **Escape**: Dismisses focused toast
- **Tab**: Cycles through interactive elements (close button, action button)
- Focus indicators: `_focusVisible: { focusRing: "outside" }`

#### Per-Placement Hotkeys

Each store accepts a `hotkey` option — an array of modifier keys and key codes
that must all match (e.g., `["altKey", "shiftKey", "Digit9"]`). Since each
placement gets its own store, we configure **different hotkeys per region**
using a numpad-inspired layout matching screen corners:

| Placement      | Hotkey        | Numpad position   |
| -------------- | ------------- | ----------------- |
| `top-start`    | `Alt+Shift+7` | 7 (top-left)      |
| `top`          | `Alt+Shift+8` | 8 (top-center)    |
| `top-end`      | `Alt+Shift+9` | 9 (top-right)     |
| `bottom-start` | `Alt+Shift+1` | 1 (bottom-left)   |
| `bottom`       | `Alt+Shift+2` | 2 (bottom-center) |
| `bottom-end`   | `Alt+Shift+3` | 3 (bottom-right)  |

```typescript
const PLACEMENT_HOTKEYS: Record<Placement, string[]> = {
  "top-start": ["altKey", "shiftKey", "Digit7"],
  top: ["altKey", "shiftKey", "Digit8"],
  "top-end": ["altKey", "shiftKey", "Digit9"],
  "bottom-start": ["altKey", "shiftKey", "Digit1"],
  bottom: ["altKey", "shiftKey", "Digit2"],
  "bottom-end": ["altKey", "shiftKey", "Digit3"],
};
```

Hotkeys are only registered for placements that are actually in use (lazy
creation). Pressing a hotkey focuses the corresponding toast region.

### Focus Management

- Toasts do NOT steal focus — use live regions for announcements
- Per-placement hotkeys navigate to the corresponding toast region
- Dismissing last focused toast restores focus to previously focused element

### prefers-reduced-motion

```typescript
"@media (prefers-reduced-motion: reduce)": {
  animationDuration: "0s !important",
  transitionDuration: "0s !important",
},
```

### Additional WCAG 4.1.3 Compliance

- Each region labeled: `aria-label="top-end Notifications"`
- Close button: i18n `aria-label` via `msg.format("dismiss")`
- Icons: `aria-hidden="true"` (decorative, color is not sole indicator)
- Action buttons: visible text labels, not icon-only

---

## Behavior

### Auto-Dismiss

- Default: **6 seconds**
- Configurable per-toast: `duration: 8000`
- `duration: 0` disables auto-dismiss
- Toasts with `action` get `duration: 0` (enforced by `ToastManager.create()`)
- `closable: false` hides the close button (useful for loading toasts)

### Timer Pausing

Timers pause on:

- Hover over any toast in region
- Focus on any element within a toast
- Browser tab losing visibility (`pauseOnPageIdle: true`)

Resume from paused position when hover/focus leaves.

### Queuing and Stacking

- Default `max: 24` per placement region (no artificial limit)
- FIFO queue for overflow (unlikely to hit in practice)
- Vertical stack with `gap: 16px`
- Newest at screen edge (top of stack for `top-*`, bottom for `bottom-*`)

### Dismissal Methods

| Method               | Behavior                                   |
| -------------------- | ------------------------------------------ |
| Close button click   | Dismisses with exit animation              |
| Escape key (focused) | Dismisses focused toast                    |
| Auto-dismiss timer   | Dismisses after duration                   |
| `toast.dismiss(id)`  | Programmatic with exit animation           |
| `toast.dismiss()`    | Dismisses all across all regions           |
| `toast.remove(id)`   | Immediate removal (no exit animation)      |
| `toast.remove()`     | Removes all immediately across all regions |

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
export type { ToastProps, ToastOptions, ToastPlacement } from "./toast.types";
```

Consumer-facing: `toast` (function + methods), `Toast` (compound component), and
types. `ToastOutlet` is internal — consumed only by NimbusProvider.

The `toast` object exposes: `.create()`, `.dismiss()`, `.remove()`, `.update()`,
`.promise()`, `.info()`, `.success()`, `.warning()`, `.error()`, `.loading()`.

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
| `ClosableControl`          | `closable: false` hides close button                         |
| `RemoveImmediate`          | `toast.remove(id)` removes without animation                 |
| `Stacking`                 | Multiple toasts stack; overflow queues until slot frees      |
| `MultiPlacement`           | Different placements render separate regions                 |
| `ScreenReaderAnnouncement` | info/success: `role="status"`, warning/error: `role="alert"` |
| `ReducedMotion`            | No slide/transition with prefers-reduced-motion              |

### Unit Tests (`toast.spec.tsx`)

- ToastManager: lazy toaster creation per placement
- ToastManager: ID routing for dismiss/update/remove
- ToastManager: `.remove()` calls store `.remove()` (not `.dismiss()`)
- Convenience methods set correct `type`
- Promise: resolves → success, rejects → error
- Action presence sets `duration: 0` (manual enforcement)
- Hotkey mapping: each placement gets correct `PLACEMENT_HOTKEYS` value
- ARIA role override: warning/error get `role="alert"`, info/success get
  `role="status"`

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

| Decision        | Choice                                                            |
| --------------- | ----------------------------------------------------------------- |
| Foundation      | Chakra UI toast system (`createToaster`)                          |
| Consumer API    | `toast()` function + `.dismiss()` / `.remove()`, no setup needed  |
| Mounting        | Automatic inside NimbusProvider                                   |
| Placement       | Per-toast, default `top-end`, multi-toaster facade                |
| Variants        | info, success, warning, error (4 types)                           |
| Actions         | v1, `duration: 0` enforced by ToastManager (not Chakra auto)      |
| Promise pattern | v1, loading → success/error                                       |
| Auto-dismiss    | 6s default, pause on hover + focus + page idle                    |
| Max visible     | Default (24), no artificial limit                                 |
| Z-index         | `popover` (1500)                                                  |
| ARIA            | Manual override: `role="status"/"alert"` (Chakra defaults status) |
| Hotkeys         | Per-placement numpad mapping (Alt+Shift+1–9)                      |
| Reduced motion  | Disable slide/fade transitions                                    |
| Styling         | Chakra slot recipe with `colorPalette` tokens                     |
| Closable        | Exposed via `closable` prop, useful for loading state             |
| i18n            | One message: dismiss label (5 locales)                            |
| Testing         | Stories (interactions), unit (manager), consumer (docs)           |
