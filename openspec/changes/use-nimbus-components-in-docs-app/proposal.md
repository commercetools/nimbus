## Why

The documentation app should show Nimbus in real use, not only in code examples.
Today the app's own UI imports 41 of the 90 component folders in
`packages/nimbus/src/components`. The remaining 49 are not used anywhere in
`apps/docs/src`. This includes the four components added since July 2026:
Breadcrumbs, Skeleton, Slider and ListBox.

Several places in the app already do by hand what a Nimbus component does:

- `components/navigation/breadcrumb/breadcrumb.tsx` builds a breadcrumb from
  `Flex`, `Box as="ul"`, `Link` and chevron icons.
- `components/navigation/app-nav-bar/components/app-nav-bar-search/app-nav-bar-search.tsx`
  shows the model download as the text `Downloading model… N%`.

Using Nimbus components in these places removes custom code and shows consumers
the components working in a real product.

## What Changes

Replace hand-built UI with the matching Nimbus component, only where it fits.
Each item below was checked against the code. Candidates that had no natural
place were dropped (see design.md).

- **Breadcrumbs**: replace the custom `BreadcrumbNav` with `Breadcrumbs` at
  `size="sm"`. Keep the Home item and the hover-revealed "Copy link" button.
- **ProgressBar**: show the semantic search model download as a progress bar
  instead of percentage text.
- **Drawer**: show the sidebar in a drawer on narrow screens. Today the app
  frame is a fixed three-column grid.
- **Slider**: use it for the icon size control in the icon explorer, which is a
  plain range input today.
- **ListBox**: use it for the category list in the icon explorer, which uses
  React Aria's `ListBox` with custom row styles today.

Out of scope: components with no natural place in the app (ChatMessage,
ChatMessageList, DataTable, the date and time inputs, and similar). We will not
add pages only to use them.

No change to the published `@commercetools/nimbus` package. No breaking changes.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `docs-app`: the "Navigation System" requirement changes. The breadcrumb
  scenario now requires the Nimbus `Breadcrumbs` component. The sidebar and the
  loading states also use Nimbus components. A new requirement states that the
  app's own UI uses Nimbus components where one matches the need.

## Impact

- `apps/docs/src/components/navigation/` (breadcrumb, mobile-nav, app-nav-bar)
- `apps/docs/src/components/app-frame/` and `apps/docs/src/layouts/app-layout.tsx`
  (responsive grid)
- `apps/docs/src/components/document-renderer/components/token-demos/icon-search/`
  (category rail and size control)
- `openspec/specs/docs-app/spec.md` (delta spec)
- No new dependencies. All components come from `@commercetools/nimbus`.
- Risk: the sidebar and breadcrumb are used on every page. Keyboard behaviour
  and scroll restoration (`useSidebarScrollRestoration`) must keep working.
