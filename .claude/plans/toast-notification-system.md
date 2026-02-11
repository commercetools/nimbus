# Toast Notification System — Design Plan

**Date:** 2026-02-09 **Branch:** CRAFT-1853-nimbus-toast-notification-system
**Status:** Implemented

---

## Context

Thin wrapper around Chakra UI's built-in toast system (`createToaster` backed by
Zag.js). A `ToastManager` singleton routes toast IDs to placement-specific
toaster instances. Rendering uses Chakra's `Toast.*` subcomponents styled via a
Nimbus slot recipe override.

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
  error: { title: "Failed", description: "Something went wrong" },
});

// Programmatic control
const id = toast({ title: "Uploading..." });
toast.update(id, { title: "Upload complete", type: "success" });
toast.dismiss(id); // with exit animation
toast.dismiss(); // dismiss all
toast.remove(id); // immediate removal (no exit animation)

// Closable control
toast({ title: "Saving...", closable: false, duration: 0 }); // no close button
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

### Multi-Toaster Architecture

Chakra's toast system ties placement to the toaster instance — one
fixed-position container per placement. To support per-toast placement, we
pre-create all 6 toaster instances (one per placement) in `toast.toasters.ts`
and expose them to both the `ToastManager` (for creating/managing toasts) and
the `ToastOutlet` (for rendering).

The `ToastManager` singleton tracks which toast ID belongs to which placement
via an `idToPlacement` map, enabling `toast.dismiss(id)`, `toast.remove(id)`,
and `toast.update(id)` to route to the correct toaster store.

### ToastOutlet Render Pattern

The Chakra `<Toaster>` component requires:

1. A `toaster` prop — the `CreateToasterReturn` store instance
2. A `children` render function — `(toast) => ReactNode`

`<ToastOutlet />` iterates over all toaster instances and renders a `<Toaster>`
per placement. Each `<Toaster>` uses the render function to compose Chakra's
built-in `Toast.*` sub-components with Nimbus styling applied via the recipe:

```tsx
function ToastOutlet() {
  return (
    <>
      {Array.from(toasters.entries()).map(([placement, toaster]) => (
        <Toaster key={placement} toaster={toaster}>
          {(toast) => {
            const type = (toast.type as ToastType) || "info";
            return (
              <ChakraToast.Root
                colorPalette={COLOR_PALETTE_MAP[type]}
                {...getARIAAttributes(type)}
              >
                <ToastContent toast={toast} toaster={toaster} />
              </ChakraToast.Root>
            );
          }}
        </Toaster>
      ))}
    </>
  );
}
```

### NimbusProvider Integration

`<ToastOutlet />` renders inside NimbusProvider. Toaster DOM regions are created
by Chakra UI but are empty until toasts are triggered.

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
├── toast.recipe.ts              # Slot recipe (overrides Chakra's "toast" key)
├── toast.types.ts               # Consumer-facing types
├── toast.manager.ts             # ToastManager singleton + toast() API
├── toast.toasters.ts            # Pre-created toaster instances per placement
├── toast.outlet.tsx             # <ToastOutlet /> for NimbusProvider
├── toast.i18n.ts                # i18n source messages
├── toast.messages.ts            # Pre-compiled messages loader
├── toast.stories.tsx            # Storybook stories with play functions
├── toast.spec.tsx               # Unit tests (manager logic)
├── toast.docs.spec.tsx          # Consumer implementation tests
├── toast.mdx                    # Designer documentation
├── toast.dev.mdx                # Developer documentation
├── intl/
│   ├── en.ts, de.ts, es.ts, fr-FR.ts, pt-BR.ts
└── index.ts
```

### Slot Recipe

Registered as `toast` key in `src/theme/slot-recipes/index.ts` to override
Chakra's default toast recipe, allowing Chakra's built-in Toast components to
use Nimbus styles directly.

Slots: `root`, `indicator`, `title`, `description`, `actionTrigger`,
`closeTrigger`.

Uses solid colored backgrounds (`colorPalette.9`) with contrast text
(`colorPalette.contrast`).

### Type-to-Palette Mapping

| Toast type | `colorPalette` | Icon                 |
| ---------- | -------------- | -------------------- |
| `info`     | `info`         | `Info`               |
| `success`  | `positive`     | `CheckCircleOutline` |
| `warning`  | `warning`      | `WarningAmber`       |
| `error`    | `critical`     | `ErrorOutline`       |

---

## Accessibility

### ARIA Roles by Type

| Type      | ARIA role | `aria-live` | Rationale                          |
| --------- | --------- | ----------- | ---------------------------------- |
| `info`    | `status`  | `polite`    | Non-urgent, waits for SR to finish |
| `success` | `status`  | `polite`    | Confirmations are non-interruptive |
| `warning` | `alert`   | `assertive` | Urgent, announces immediately      |
| `error`   | `alert`   | `assertive` | Critical, announces immediately    |

**Implementation:** Chakra's toast system defaults to `role="status"` on all
toasts. The `ToastOutlet` overrides this by spreading ARIA attributes on
`ChakraToast.Root` based on the toast type.

### Keyboard Navigation

- **Escape**: Dismisses focused toast
- **Tab**: Cycles through interactive elements (close button, action button)
- Focus indicators via Chakra's built-in focus ring

#### Per-Placement Hotkeys

Configured via Chakra's `createToaster` hotkey option using string format:

| Placement      | Hotkey        | Numpad position   |
| -------------- | ------------- | ----------------- |
| `top-start`    | `Alt+Shift+7` | 7 (top-left)      |
| `top`          | `Alt+Shift+8` | 8 (top-center)    |
| `top-end`      | `Alt+Shift+9` | 9 (top-right)     |
| `bottom-start` | `Alt+Shift+1` | 1 (bottom-left)   |
| `bottom`       | `Alt+Shift+2` | 2 (bottom-center) |
| `bottom-end`   | `Alt+Shift+3` | 3 (bottom-right)  |

All hotkeys are registered at module load time (all 6 toasters are pre-created).

### prefers-reduced-motion

Handled by Chakra UI's toast system and CSS transition properties in the recipe.

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

- Hover over any toast in region (`pauseOnInteraction: true` default)
- Focus on any element within a toast
- Browser tab losing visibility (`pauseOnPageIdle: true`)

Resume from paused position when hover/focus leaves.

### Queuing and Stacking

- Chakra's default `max` per placement region
- FIFO queue for overflow
- Vertical stack without overlapping

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

1. **Loading**: Shows loading state, configurable `closable: false`
2. **Success/Error**: Replaces content with resolved/rejected state

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

Pre-compiled to en, de, es, fr-FR, pt-BR.

Only library string is the dismiss label. Title, description, and action label
are consumer-provided content.

---

## Exports

From `toast/index.ts`:

```typescript
export { toast } from "./toast.manager"; // Imperative API
export { ToastOutlet } from "./toast.outlet"; // For NimbusProvider (internal)
export type {
  ToastType,
  ToastPlacement,
  ToastAction,
  ToastOptions,
  ToastPromiseOptions,
  IToastManager,
} from "./toast.types";
```

Consumer-facing: `toast` (function + methods) and types. `ToastOutlet` is
internal — consumed only by NimbusProvider.

The `toast` object exposes: callable as function, plus `.dismiss()`,
`.remove()`, `.update()`, `.promise()`, `.info()`, `.success()`, `.warning()`,
`.error()`.

---

## Testing Strategy

### Story Tests (`toast.stories.tsx`)

| Story                      | Tests                                                        |
| -------------------------- | ------------------------------------------------------------ |
| `Variants`                 | All 4 types with correct icons and ARIA roles                |
| `ARIARoles`                | info/success: `role="status"`, warning/error: `role="alert"` |
| `AutoDismiss`              | Default 6s, custom duration, disabled (duration: 0)          |
| `PauseBehavior`            | Hover pauses timer; focus pauses timer                       |
| `Dismissal`                | Close button, Escape key, dismiss all, remove all            |
| `ActionButton`             | Renders button, no auto-dismiss (action forces duration: 0)  |
| `PromisePattern`           | Loading → success; loading → error transitions               |
| `StackingAndQueuing`       | Multiple toasts stack; overflow queued                       |
| `MultiPlacement`           | Different placements render in separate regions              |
| `KeyboardNavigation`       | Hotkeys and Tab navigation                                   |
| `ClosableControl`          | `closable: false` hides close button                         |
| `ReducedMotion`            | Respects prefers-reduced-motion                              |
| `ProgrammaticUpdate`       | `toast.update(id)` changes content in place                  |
| `Internationalization`     | Translated aria-label for close button                       |
| `ComprehensiveIntegration` | Real-world scenarios (save, error with retry)                |

### Unit Tests (`toast.spec.tsx`)

- Singleton pattern
- Toast creation via toaster instance
- ID routing for dismiss/update/remove
- Convenience methods (info, success, warning, error)
- Promise pattern forwarding
- Action presence sets `duration: 0`
- `.remove()` vs `.dismiss()` behavior
- Closable option forwarding via meta
- Edge cases and configuration options

### Consumer Tests (`toast.docs.spec.tsx`)

- Basic: trigger toast from button click
- Convenience methods
- Custom placement
- Programmatic update and dismiss
- Promise pattern
- Action buttons with callbacks

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
| Rendering       | Chakra's built-in Toast components with Nimbus recipe override    |
| Mounting        | Automatic inside NimbusProvider                                   |
| Placement       | Per-toast, default `top-end`, pre-created toasters per placement  |
| Variants        | info, success, warning, error (4 types)                           |
| Actions         | `duration: 0` enforced by ToastManager (not Chakra auto)          |
| Promise pattern | loading → success/error via Chakra's `toaster.promise()`          |
| Auto-dismiss    | 6s default, pause on hover + focus + page idle                    |
| ARIA            | Manual override: `role="status"/"alert"` (Chakra defaults status) |
| Hotkeys         | Per-placement numpad mapping (Alt+Shift+1–9)                      |
| Styling         | Chakra slot recipe override (key: `toast`) with `colorPalette`    |
| Closable        | Exposed via `closable` prop, forwarded through meta               |
| i18n            | One message: dismiss label (5 locales)                            |
| Testing         | Stories (interactions), unit (manager), consumer (docs)           |
