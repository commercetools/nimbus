## Context

`apps/docs/src` imports 41 Nimbus components. 49 component folders are unused
(see the proposal). Only the app's own code counts. The live code editor
(`live-code-editor.tsx`) and the props table (`props-table.tsx`) use
`import * as`, so they can render any component, but they do not show the
component working in the app's UI.

Current state of the places this change touches:

- **Breadcrumb**: `components/navigation/breadcrumb/breadcrumb.tsx` is a custom
  `<nav>` with `Link` items and `ChevronRight` icons. It also has a "Copy link"
  button that appears on hover or focus, and a `BreadcrumbProvider` context
  (`contexts/breadcrumb-context.tsx`) that keeps the last parts while the next
  route loads.
- **Loading states**: `routes/dynamic-route.tsx`, `layouts/app-layout.tsx`,
  `layouts/no-sidebar-layout.tsx` and `layouts/dynamic-layout.tsx` use
  `<Suspense fallback={<LoadingSpinner />}>`. One fallback is `<Box />`
  (`dynamic-layout.tsx:82`, around the breadcrumb).
- **Semantic search**: `useSemanticSearch` returns `status` and
  `downloadPercent` (0–100 while `status === "loading-model"`). The search UI
  shows this as the text `Downloading model… N%`.
- **Sidebar**: `components/navigation/menu/components/menu-item.tsx` keeps
  `isOpen` state per item and renders nested `Link` rows. It also saves and
  restores the scroll position of the sidebar viewport.
- **Narrow screens**: I found no responsive props in
  `components/app-frame/app-frame.tsx`. I have not checked how the app looks on
  a narrow screen. This is the first task.

## Goals / Non-Goals

**Goals:**

- Replace hand-built UI with the matching Nimbus component where the result is
  simpler or equal in behaviour.
- Use each of these components at least once in the app's own code: Breadcrumbs,
  ProgressBar, and one of Accordion or Tree.
- Keep behaviour users rely on: keyboard navigation, the "Copy link" button,
  sidebar scroll restoration, and the route-change fade.

**Non-Goals:**

- Using every one of the 49 unused components. Components without a natural
  place (ChatMessage, ChatMessageList, DataTable, the date and time inputs) stay
  unused.
- Adding pages only to show a component.
- Changing any Nimbus component. If a component does not fit, we drop the
  candidate. We do not change the component for the docs app.

## Decisions

### 1. Use a component only where the code shows a real need

Each candidate was checked against the code before it was built. Breadcrumbs,
ProgressBar, Drawer, Slider and ListBox replace or add something the app needs.
Skeleton, Accordion/Tree, Popover, ComboBox and Steps were dropped, because the
code showed no natural place for them (see decisions 3, 5 and 7).

Alternative: commit to all eight first candidates. Rejected, because it forces
components into places where they do not help the reader.

### 2. Breadcrumbs wraps, it does not replace, the surrounding behaviour

Use `Breadcrumbs` with `items` built from the same `menuToPath` data as today,
at `size="sm"` (14px). The default `md` is 16px and looks too large next to the
app's 14px text.
Keep the `BreadcrumbProvider` and the hover-revealed "Copy link" button as they
are, next to the new component. Only the list of links changes.

Open point: the Home item has an icon today. `BreadcrumbItem.label` accepts
`React.ReactNode`, so an icon and text can stay.

Alternative: move "Copy link" inside the breadcrumb. Rejected: it is not part of
the Breadcrumbs API, and it would change focus order.

### 3. Skeleton: tried and dropped

Skeleton placeholders were built for the content column and the table of
contents, where `DocumentRenderer` and `Toc` return `null` while a page loads.
They were removed: the docs bundle is loaded at once, so the loading state is
too short for anyone to see. The `Suspense` fallbacks keep `LoadingSpinner`.
Skeleton stays unused in the app until a place with a visible wait exists.

### 4. ProgressBar shows the existing percentage

Use `downloadPercent` as the progress value while `status === "loading-model"`.
Keep the text label for screen readers and for the "indexing" phase, where there
is no percentage. When the percentage is not known, show an indeterminate bar
if `ProgressBar` supports it. This is checked during implementation.

### 5. Sidebar: dropped

The sidebar is a tree of links where the parent is also a link, and it opens
by route only (`MenuItem` has no toggle). `Accordion` triggers only toggle, so
parents could not stay links. `Tree` supports `href` rows, but it would make the
site navigation a `treegrid` with its own keyboard model, and the scroll
restoration and current-route highlight would need rework. That is a large
change on every page only to use one more component. The sidebar is unchanged.

### 6. Drawer below the `lg` breakpoint

`AppFrameRoot` was a fixed three-column grid that needs about 1,100px (256px
sidebar, an 80ch main column and the table of contents), so it overflowed on
narrow screens. Below `lg` (1024px) the grid now has one column, the sidebar and
the table of contents are hidden, and `MobileNav` shows a menu button in the main
column. The button opens the same `Menu` in a left `Drawer`, which closes when
the route changes. The top bar itself is still cut off at narrow widths. That is
not part of this change.

Alternative: a breakpoint at `md` (768px). Rejected, because the grid is already
too wide at that size.

### 7. Icon explorer: Slider and ListBox, and no ComboBox

The icon explorer used a plain `<input type="range">` for the icon size and a
React Aria `ListBox` with hand-written row styles for categories. These are
exactly what Nimbus `Slider` and `ListBox` (`variant="plain"`, `size="sm"`)
provide, and they remove the custom styles. A `ComboBox` filter was not added:
search, the category list and the tag bar already cover filtering. `ListBox` is
marked experimental in Nimbus, so its API may change.

### 8. Popover and Steps: not used

The version badge shows only the version number, so a popover would have no
content. The only step-by-step page is the static Installation page, and `Steps`
is a stateful progress component, so it does not fit.

## Risks / Trade-offs

- [Breadcrumb and sidebar are on every page] → Check keyboard navigation and the
  current-route highlight with Playwright before merging.
- [Sidebar scroll restoration breaks when the markup changes] →
  `useSidebarScrollRestoration` reads `sidebarViewportRef`. Keep the viewport
  element unchanged. Only the item markup changes.
- [The docs app and the Nimbus build drift] → The docs app resolves
  `@commercetools/nimbus` from the workspace, so a missing or changed prop shows
  up in `pnpm typecheck:strict`.

## Open Questions

- The current spec says breadcrumbs display "deepest → root order". The code
  renders root first (Home, then each parent, then the page). The delta spec
  uses root first to match the code. Confirm this is intended.
- ~~Is there a narrow-screen layout for the docs app?~~ Resolved: no.
  `AppFrameRoot` uses a fixed grid (`minmax(200px, 256px) minmax(80ch, 1fr) ...`)
  with no breakpoints, so the sidebar is always visible. Decision 6 applies
  (checked in code, not yet in a browser).
- ~~Does `ProgressBar` support an indeterminate state?~~ Resolved: yes, through
  the `isIndeterminate` prop (`progress-bar.types.ts:29`).
