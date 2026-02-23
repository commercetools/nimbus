## ADDED Requirements

### Requirement: Toast Types

The toast system SHALL support four semantic types: `info`, `success`,
`warning`, and `error`. Each type SHALL map to a Nimbus semantic color palette
(`info`, `positive`, `warning`, `critical`) and render a corresponding status
icon. A fifth type, `loading`, is used internally by the promise pattern.

#### Scenario: Info toast

- **WHEN** a toast is created with `type: "info"`
- **THEN** it renders with the `info` color palette and an info icon

#### Scenario: Success toast

- **WHEN** a toast is created with `type: "success"`
- **THEN** it renders with the `positive` color palette and a check icon

#### Scenario: Warning toast

- **WHEN** a toast is created with `type: "warning"`
- **THEN** it renders with the `warning` color palette and a warning icon

#### Scenario: Error toast

- **WHEN** a toast is created with `type: "error"`
- **THEN** it renders with the `critical` color palette and an error icon

#### Scenario: Loading toast (promise pattern)

- **WHEN** a promise toast is in the loading state
- **THEN** it renders with the `neutral` color palette and a loading spinner

### Requirement: Toast Visual Variants

The toast system SHALL support three visual variants controlling the toast's
appearance: `solid`, `subtle`, and `accent-start`. The default variant is
`accent-start`.

#### Scenario: Solid variant

- **WHEN** a toast is created with `variant: "solid"`
- **THEN** it renders with a bold colored background and contrast text

#### Scenario: Subtle variant

- **WHEN** a toast is created with `variant: "subtle"`
- **THEN** it renders with a subtle background and an inset border

#### Scenario: Accent-start variant (default)

- **WHEN** a toast is created without specifying a variant
- **THEN** it renders with a subtle neutral background and a colored accent line
  on the inline-start edge

### Requirement: Custom Icon

The toast system SHALL support an optional `icon` property on `ToastOptions`
that accepts a `React.ReactElement`. When provided, the custom icon replaces the
default type-based icon. The `loading` type always renders a spinner regardless
of the `icon` property.

#### Scenario: Custom icon replaces default

- **WHEN** a toast is created with a custom `icon` element
- **THEN** the custom icon is rendered instead of the default type-based icon

#### Scenario: Default icon without custom icon

- **WHEN** a toast is created without an `icon` property
- **THEN** the default type-based icon is rendered

#### Scenario: Loading type ignores custom icon

- **WHEN** a toast is created with `type: "loading"` and an `icon` property
- **THEN** the loading spinner is rendered instead of the custom icon

### Requirement: Imperative Toast API

The system SHALL export a `toast` function that creates toasts without requiring
hooks, providers, or setup beyond `NimbusProvider`.

#### Scenario: Basic toast creation

- **WHEN** a consumer calls
  `toast({ title: "Saved", description: "Your changes have been saved" })`
- **THEN** a toast appears in the default placement (`top-end`)

#### Scenario: Convenience methods

- **WHEN** a consumer calls
  `toast.success({ title: "Done", description: "Operation completed" })`
- **THEN** a toast appears with `type: "success"`

#### Scenario: Programmatic dismiss

- **WHEN** a consumer calls `toast.dismiss(id)`
- **THEN** the specified toast is dismissed with exit animation

#### Scenario: Programmatic remove

- **WHEN** a consumer calls `toast.remove(id)`
- **THEN** the specified toast is removed immediately without exit animation

#### Scenario: Internal routing state cleanup on dismiss

- **WHEN** a toast is dismissed via `toast.dismiss(id)` or removed via
  `toast.remove(id)`
- **THEN** the internal ID-to-placement mapping for that toast is deleted
- **AND** subsequent calls referencing that ID fall back to default placement

#### Scenario: Internal routing state cleanup on dismiss/remove all

- **WHEN** `toast.dismiss()` or `toast.remove()` is called without an ID
- **THEN** all internal ID-to-placement mappings are cleared

#### Scenario: Programmatic update

- **WHEN** a consumer calls `toast.update(id, { title: "New title" })`
- **THEN** the specified toast content is updated in place

### Requirement: Per-Toast Placement

The `toast` function SHALL accept an optional `placement` parameter. The system
SHALL manage separate pre-created toaster instances for 4 corner placements:
`top-start`, `top-end`, `bottom-start`, `bottom-end`.

#### Scenario: Default placement

- **WHEN** a toast is created without specifying placement
- **THEN** it appears in the `top-end` position

#### Scenario: Custom placement

- **WHEN** a toast is created with `placement: "bottom-end"`
- **THEN** it appears in the bottom-end position in a separate region

#### Scenario: Multiple placements simultaneously

- **WHEN** toasts exist in both `top-end` and `bottom-end`
- **THEN** each placement renders its own independent region with correct
  stacking

### Requirement: Auto-Dismiss

Toasts SHALL auto-dismiss after a configurable duration (default 6 seconds).
Timers SHALL pause on hover, focus, and page idle (via Chakra's built-in
`pauseOnInteraction` and `pauseOnPageIdle`).

#### Scenario: Default auto-dismiss

- **WHEN** a toast is created without custom duration
- **THEN** it dismisses after 6 seconds

#### Scenario: Custom duration

- **WHEN** a toast is created with `duration: 10000`
- **THEN** it dismisses after 10 seconds

#### Scenario: Disabled auto-dismiss

- **WHEN** a toast is created with `duration: Infinity`
- **THEN** it persists until manually dismissed

#### Scenario: Pause on hover

- **WHEN** the user hovers over a toast
- **THEN** the auto-dismiss timer pauses and resumes on mouse leave

#### Scenario: Pause on focus

- **WHEN** the user focuses an element within a toast via keyboard
- **THEN** the auto-dismiss timer pauses and resumes on blur

### Requirement: Toast Dismissal

Toasts SHALL be dismissible via a close button, the Escape key, auto-dismiss
timer, or programmatic API.

#### Scenario: Close button

- **WHEN** the user clicks the close button
- **THEN** the toast is dismissed with exit animation

#### Scenario: Escape key

- **WHEN** the toast region is focused and the user presses Escape
- **THEN** the focused toast is dismissed

#### Scenario: Dismiss all

- **WHEN** `toast.dismiss()` is called without an ID
- **THEN** all toasts across all regions are dismissed

### Requirement: Action Button

Toasts SHALL support an optional action button configured via
`action: { label: string; onPress: () => void }`. Action buttons do not
override the toast duration — consumers control duration independently. An
action toast uses the default 6s duration unless the consumer explicitly sets a
different value.

#### Scenario: Action toast

- **WHEN** a toast is created with `action: { label: "Undo", onPress: fn }`
- **THEN** an action button is rendered and the toast uses the default duration

#### Scenario: Action callback

- **WHEN** the user clicks the action button
- **THEN** the `onPress` callback is invoked

### Requirement: Promise Pattern

The `toast.promise()` method SHALL create a toast that transitions through
loading, success, and error states based on a promise's lifecycle. This is
delegated directly to Chakra's `toaster.promise()`.

#### Scenario: Promise resolves

- **WHEN** `toast.promise(promise, { loading, success, error })` is called and
  the promise resolves
- **THEN** the toast transitions from loading to success state

#### Scenario: Promise rejects

- **WHEN** `toast.promise(promise, { loading, success, error })` is called and
  the promise rejects
- **THEN** the toast transitions from loading to error state

### Requirement: Queuing and Stacking

The system SHALL use Chakra's default max (24) per placement region. When the
maximum is exceeded, additional toasts SHALL be queued and displayed as visible
slots become available.

#### Scenario: Stacking

- **WHEN** multiple toasts are visible in the same region
- **THEN** they stack vertically without overlapping

#### Scenario: Queuing overflow

- **WHEN** the toast count exceeds the maximum for a region
- **THEN** new toasts are queued and appear when visible toasts are dismissed

### Requirement: ARIA Role Differentiation

Info, success, and warning toasts SHALL use `role="status"` (polite). Error
toasts SHALL use `role="alert"` (assertive). The `ToastOutlet` SHALL override
these attributes on `Toast.Root` since Chakra defaults all toasts to
`role="status"`. Consumers MAY override the default `aria-live` politeness level
via the `"aria-live"` option on `ToastOptions`.

#### Scenario: Polite announcement

- **WHEN** an info, success, or warning toast appears
- **THEN** it has `role="status"` and `aria-live="polite"`

#### Scenario: Assertive announcement

- **WHEN** an error toast appears
- **THEN** it has `role="alert"` and `aria-live="assertive"`

#### Scenario: Consumer override

- **GIVEN** a toast is created with `"aria-live": "assertive"`
- **WHEN** the toast appears
- **THEN** it has `role="alert"` and `aria-live="assertive"` regardless of type

### Requirement: Keyboard Navigation

Toast regions SHALL support per-placement hotkeys and standard keyboard
navigation within toasts.

#### Scenario: Per-placement hotkey

- **WHEN** the user presses Alt+Shift+9
- **THEN** focus moves to the top-end toast region (if toasts are visible)
- **NOTE**: Hotkeys map to numpad corners: 7=top-start, 9=top-end,
  1=bottom-start, 3=bottom-end

#### Scenario: Tab through toast elements

- **WHEN** a toast with close button and action button is focused
- **THEN** Tab cycles through the interactive elements

### Requirement: Non-Selectable Text

Toast text content SHALL NOT be selectable by the user. Toasts are transient
notifications, not content — text selection is disabled via `user-select: none`
on the toast root.

#### Scenario: Text not selectable

- **WHEN** the user attempts to select text within a toast
- **THEN** the text is not selectable

### Requirement: Reduced Motion

When `prefers-reduced-motion` is active, toast transitions SHALL be minimal.
This is handled by CSS transition properties in the recipe and Chakra's built-in
animation system.

#### Scenario: Reduced motion preference

- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** toast enter/exit transitions are reduced or disabled

### Requirement: Zero-Setup via NimbusProvider

`NimbusProvider` SHALL render a `<ToastOutlet />` component that manages toast
regions. No additional setup SHALL be required from consumers.

#### Scenario: Automatic mounting

- **WHEN** an app uses `NimbusProvider`
- **THEN** toast functionality is available without additional components

### Requirement: Closable Control

Toasts SHALL support a `closable` property on `ToastOptions` that controls close
button visibility. Internally, `ToastManager` tunnels this value through Chakra's
`meta` bag (an implementation detail not exposed to consumers). By default, the
close button is hidden. Persistent toasts (`duration: Infinity`) automatically
enable the close button unless explicitly set to `false`.

#### Scenario: Closable false (default)

- **WHEN** a toast is created without specifying `closable`
- **THEN** the close button is hidden

#### Scenario: Closable true

- **WHEN** a toast is created with `closable: true`
- **THEN** the close button is visible

#### Scenario: Persistent toasts default to closable

- **WHEN** a toast is created with `duration: Infinity` and no explicit
  `closable` value
- **THEN** the close button is visible

### Requirement: Immediate Removal

The `toast.remove()` method SHALL remove toasts immediately without exit
animation, in contrast to `toast.dismiss()` which plays exit animation.

#### Scenario: Remove vs dismiss

- **WHEN** a consumer calls `toast.remove(id)`
- **THEN** the toast is removed from the DOM immediately without animation

#### Scenario: Remove all

- **WHEN** a consumer calls `toast.remove()` without an ID
- **THEN** all toasts across all regions are removed immediately

### Requirement: Internationalization (Deferred)

The toast system SHALL provide internationalized labels for all UI-rendered
strings (e.g., close button `aria-label`). Currently the close button uses a
hardcoded English label (`"__Dismiss"`); full i18n with pre-compiled translations
(en, de, es, fr-FR, pt-BR) is deferred until localization infrastructure is
wired up.

#### Scenario: Translated dismiss label (deferred)

- **WHEN** the locale is set to German
- **THEN** the close button `aria-label` renders the German translation
- **STATUS**: Not yet implemented — close button uses hardcoded label

### Requirement: Nested NimbusProvider Safety

The toast system SHALL ensure that when `NimbusProvider` is nested (e.g., in
micro-frontends or Storybook decorators), only the outermost provider renders a
`<ToastOutlet />`.
Duplicate outlets cause WCAG landmark-unique violations from duplicate
`role="region"` elements.

#### Scenario: Nested providers

- **WHEN** a `NimbusProvider` is nested inside another `NimbusProvider`
- **THEN** only the outermost provider renders toast regions

#### Scenario: Single provider

- **WHEN** a single `NimbusProvider` wraps the application
- **THEN** the `ToastOutlet` renders normally

### Requirement: Modal Interaction Safety

Toast regions SHALL remain interactive when a React Aria modal (Dialog) is open.
React Aria's `ariaHideOutside` sets `inert` on sibling DOM elements during modal
focus trapping, which would block pointer events on toast close and action
buttons. Toast group containers SHALL be marked with
`data-react-aria-top-layer="true"` so React Aria's hide walk skips them.

#### Scenario: Toast buttons clickable above modal

- **GIVEN** a modal dialog is open
- **AND** a toast with a close button and action button is visible
- **WHEN** the user clicks the toast's close button or action button
- **THEN** the button responds to the click (toast is not inert)

#### Scenario: Toast region not marked inert

- **GIVEN** a modal dialog is open
- **WHEN** a toast region exists in the DOM
- **THEN** the toast region's `inert` property is `false`

### Requirement: SSR Safety

The toast module SHALL be safe to import in server-side rendering environments
(Node.js). Toaster instances SHALL be lazily initialized on first access rather
than at module load time, avoiding module-level side effects that could interfere
with tree-shaking, SSR, or test isolation.

#### Scenario: Server-side import

- **WHEN** the toast module is imported in a Node.js (SSR) environment
- **THEN** no toaster instances are created until first client-side access

#### Scenario: Lazy initialization

- **WHEN** `toast()` or `<ToastOutlet />` is invoked for the first time
- **THEN** toaster instances are created on demand and reused for subsequent calls
