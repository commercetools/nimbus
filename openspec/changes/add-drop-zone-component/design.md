# Design — DropZone

## Context

React Aria's `DropZone` is a headless, accessible drop target: it renders a
focusable button element and is **keyboard- and screen-reader-accessible by
default** — a user presses Enter to enter drag-and-drop mode, Tab between drop
targets, Enter to drop, and Escape to cancel, with screen-reader announcements
throughout. It exposes interaction state via render props (`isDropTarget`,
`isFocusVisible`, `isHovered`, `isDisabled`) and matching `data-*` attributes. It
has no visual styling. Per RAC's own drag-and-drop guidance, keyboard/SR drag is
only supported *within the browser window*, so for **file uploads from the OS**
an alternative such as a `FileTrigger` should be provided in addition to the drop
zone. Nimbus already ships that `FileTrigger`.

DropZone adds the design-system styling layer on top of RAC's primitive,
following the same faithful-passthrough philosophy as `FileTrigger`. It styles
only the interaction states RAC exposes out of the box — it does not invent
error/loading/invalid states.

## Goals / Non-Goals

This is an **MVP**: DropZone adds only the drag-and-drop and accessibility
mechanics on top of RAC. Content and upload affordance are the consumer's.

**Goals**

- Accessible, on-brand drop target with idle / hover / dragOver / focus /
  disabled states.
- Faithful forwarding of React Aria drop handlers and accessible-name props.
- A minimal default state (upload icon + one localized label) so a bare
  `<DropZone />` is self-explanatory and labelled; children replace it wholesale.
- A documented upload path via composition with the existing `FileTrigger`
  (DropZone does not re-implement it).

**Non-Goals (explicitly cut from the MVP)**

- **The 3-slot content model** (independently-overridable icon / title /
  description) and the slot-inspection / fragment-flattening that supported it.
  The default state is all-or-nothing: children replace it entirely.
- **A `size` variant** — sizing is done with Nimbus style props (`minH`, `p`, …).
- **Disabled-context propagation** to composed controls — the consumer sets
  `isDisabled` on both the zone and their button.
- Upload progress / retry / file-list / filled-state UI, and error/loading/
  invalid states — consumer-owned, expressed via children.

## Decisions

### Recipe: standard `defineRecipe`, single container

`nimbusDropZone` is a **standard recipe** (`defineRecipe`) registered in
`theme/recipes/index.ts`, styling the RAC `DropZone` root via a
`createRecipeContext({ key: "nimbusDropZone" })` slot in `drop-zone.slots.tsx`
(mirroring `Badge`). With no icon/title/description sub-elements to coordinate,
there is nothing a slot recipe would buy — a single container is correct.

- **base**: `borderStyle: dashed`, neutral border/background, `focusRing` on
  `&[data-focus-visible]`, hover via `&[data-hovered]`, `layerStyle: disabled` +
  `pointerEvents: none` on `&[data-disabled]`.
- **dragOver**: `&[data-drop-target='true']` switches to a solid/heavier border
  and a tinted `colorPalette` background — not color-only (border weight/style +
  outline change too).
- Non-text contrast ≥3:1, `forced-colors` visibility, and `prefers-reduced-
  motion` handling are honored.

### Content model: default state, else children

`Children.count(children) === 0` → DropZone renders a default state: a centered
upload icon (Nimbus `Icon` + `UploadFile`) and one localized instruction line
(`Nimbus.DropZone.defaultLabel`). Otherwise it renders the children as-is.
It is all-or-nothing — there is no slot inspection, fragment flattening, or
per-slot override. Consumers who want a Browse button, custom copy, or a
filled-state file list pass their own children (which replace the default).

### Accessible name: RAC-native

The default instruction line is rendered as React Aria's `<Text slot="label">`,
so RAC applies it as the drop zone's accessible name automatically — a bare
`<DropZone />` is labelled for free. An explicit `aria-label`/`aria-labelledby`
is forwarded to `RaDropZone` and takes precedence. There is no custom
`aria-labelledby` wiring, `useLayoutEffect` DOM workaround, or accessible-name
warning — RAC's native labelling covers it. When a consumer replaces the
children and provides neither a `<Text slot="label">` nor an `aria-label`, the
zone is unnamed (documented; RAC's own dev warnings apply).

### Click-to-upload via composition (not built in)

DropZone does not own file selection. Consumers compose the existing Nimbus
`FileTrigger` in the children:

```tsx
<DropZone onDrop={handleDrop} aria-label="Upload files" minH="2400" p="600">
  <FileTrigger onSelect={handleSelect} allowsMultiple>
    <Button variant="ghost">Browse files</Button>
  </FileTrigger>
</DropZone>
```

This keeps DropZone single-responsibility and matches React Aria's canonical
DropZone + FileTrigger pattern. The zone is keyboard-accessible by default
(RAC); the composed FileTrigger is the recommended alternative specifically for
OS **file uploads**, which keyboard/SR drag cannot cover. To disable the whole
thing, set `isDisabled` on both the DropZone and the composed control.

### Types & DX

`drop-zone.types.ts` derives from `DropZoneProps` (react-aria-components),
omitting `className`/`style` where the recipe or Nimbus style-props take over,
and adding `children` and `ref: Ref<HTMLDivElement>`. No `size`, no slot props,
no file-selection props.

- The component **re-exports** `DropEvent`, `DropOperation`, and `DragTypes`
  from `react-aria-components` so consumers can type `onDrop`/`getDropOperation`
  handlers without a direct RAC import.
- The Implementation docs include a complete, copy-pasteable example showing the
  non-obvious `onDrop` → `await item.getFile()` extraction, a single
  `handleFiles(files: File[])` helper shared by both `onDrop` and the composed
  FileTrigger's `onSelect`, and the recommended `getDropOperation` guard so a
  zone does not silently accept every type.
- Component supports Nimbus style props (`@supportsStyleProps`) for sizing.

## Risks / Trade-offs

- **All-or-nothing content**: a consumer who wants the default prompt *and* a
  Browse button must render both themselves (the default is only shown when there
  are no children). Accepted trade for dropping the slot system; the common
  zero-config case (bare `<DropZone />`) still gets a labelled prompt for free.
- **No error/loading/invalid states**: by decision, DropZone styles only the
  states RAC exposes. A drag whose types are rejected by `getDropOperation`
  simply does not trigger the drop-target highlight (RAC default); consumers own
  any error/loading/filled UI via children.
- **Accessible name when children are supplied**: the default state is labelled
  via `<Text slot="label">`, but a consumer who replaces the children and
  provides neither a `<Text slot="label">` nor an `aria-label` gets an unnamed
  zone. Documented in the Accessibility tab; RAC's dev-time warnings apply.

## Migration Plan

Purely additive. New component exported from the `packages/nimbus` barrel; new
standard recipe registered; one new i18n message. No consumer migration required.

## Open Questions

- None. The 3-slot content model and a `size` variant were considered and
  deliberately deferred; the MVP keeps a single all-or-nothing default state.
