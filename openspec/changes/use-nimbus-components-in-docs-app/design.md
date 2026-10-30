## Context

`apps/docs/src` imports 33 Nimbus components. 49 component folders are unused
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
  Skeleton, ProgressBar, and one of Accordion or Tree.
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

### 1. Two tiers: committed and conditional

Breadcrumbs, Skeleton and ProgressBar replace code that already exists, so they
are committed. Drawer, Popover, ComboBox, Steps, and the Accordion or Tree
choice are conditional. Each one needs a real need first, found in the code. If
there is none, the task is dropped and the component stays unused.

Alternative: commit to all eight. Rejected, because it forces components into
places where they do not help the reader.

### 2. Breadcrumbs wraps, it does not replace, the surrounding behaviour

Use `Breadcrumbs` with `items` built from the same `menuToPath` data as today.
Keep the `BreadcrumbProvider` and the hover-revealed "Copy link" button as they
are, next to the new component. Only the list of links changes.

Open point: the Home item has an icon today. `BreadcrumbItem.label` accepts
`React.ReactNode`, so an icon and text can stay.

Alternative: move "Copy link" inside the breadcrumb. Rejected: it is not part of
the Breadcrumbs API, and it would change focus order.

### 3. Skeleton replaces spinners only where the layout is known

A spinner suits an unknown wait. A skeleton suits a known shape. Use `Skeleton`
for the table of contents fallback and the content fallback in `app-layout.tsx`,
where the column width is fixed by `AppFrame.MainContent`. Keep `LoadingSpinner`
for the sidebar `Menu` and for `dynamic-route.tsx`, where there is no fixed
shape.

Alternative: replace all spinners. Rejected: a skeleton with the wrong shape
causes a visible jump when the content arrives. This is the same jump that
`app-layout.tsx` already avoids with `wideRef`.

### 4. ProgressBar shows the existing percentage

Use `downloadPercent` as the progress value while `status === "loading-model"`.
Keep the text label for screen readers and for the "indexing" phase, where there
is no percentage. When the percentage is not known, show an indeterminate bar
if `ProgressBar` supports it. This is checked during implementation.

### 5. Sidebar: Accordion or Tree, decided by a short spike

The sidebar is a tree of links, where the parent is also a link. `Accordion`
expects a trigger that only toggles. `Tree` models parent-and-child rows but
has its own selection and keyboard model. Try both on the existing
`MenuItem` and keep the one that preserves: link semantics, the highlighted
current route, and scroll restoration. If neither does, drop this candidate.

### 6. Drawer only if narrow screens are unsupported today

If the app has no narrow-screen navigation, add a menu button in the top bar that
opens the sidebar in a `Drawer`. If the sidebar already adapts, skip it.

## Risks / Trade-offs

- [Breadcrumb and sidebar are on every page] → Check keyboard navigation and the
  current-route highlight with Playwright before merging.
- [Sidebar scroll restoration breaks when the markup changes] →
  `useSidebarScrollRestoration` reads `sidebarViewportRef`. Keep the viewport
  element unchanged. Only the item markup changes.
- [Skeleton shape mismatch causes layout shift] → Use the same width and spacing
  as the final content (decision 3).
- [The docs app and the Nimbus build drift] → The docs app resolves
  `@commercetools/nimbus` from the workspace, so a missing or changed prop shows
  up in `pnpm typecheck:strict`.

## Open Questions

- The current spec says breadcrumbs display "deepest → root order". The code
  renders root first (Home, then each parent, then the page). The delta spec
  uses root first to match the code. Confirm this is intended.
- Is there a narrow-screen layout for the docs app? (decision 6)
- Does `ProgressBar` support an indeterminate state? (decision 4)
