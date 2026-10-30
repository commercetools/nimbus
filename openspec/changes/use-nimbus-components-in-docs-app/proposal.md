## Why

The documentation app should show Nimbus in real use, not only in code examples.
Today the app's own UI imports 33 of the 82 component folders in
`packages/nimbus/src/components`. The remaining 49 are not used anywhere in
`apps/docs/src`. This includes the four components added since July 2026:
Breadcrumbs, Skeleton, Slider and ListBox.

Several places in the app already do by hand what a Nimbus component does:

- `components/navigation/breadcrumb/breadcrumb.tsx` builds a breadcrumb from
  `Flex`, `Box as="ul"`, `Link` and chevron icons.
- `layouts/app-layout.tsx` uses `<Suspense fallback={<LoadingSpinner />}>` for
  the sidebar, the content and the table of contents.
- `components/navigation/app-nav-bar/components/app-nav-bar-search/app-nav-bar-search.tsx`
  shows the model download as the text `Downloading model… N%`.

Using Nimbus components in these places removes custom code and shows consumers
the components working in a real product.

## What Changes

Replace hand-built UI with the matching Nimbus component, only where it fits.
Each item below is a candidate. The design phase confirms or drops each one.

- **Breadcrumbs**: replace the custom `BreadcrumbNav` with `Breadcrumbs`. Keep
  the Home item and the hover-revealed "Copy link" button.
- **Skeleton**: use it as the `Suspense` fallback for the content area and the
  table of contents, and for the search results while they load.
- **ProgressBar**: show the semantic search model download as a progress bar
  instead of percentage text.
- **Accordion** (or **Tree**): replace the hand-written open/close state in the
  sidebar `MenuItem`. The design phase chooses one, because the sidebar is a
  nested list of links and not a set of panels.
- **Drawer**: show the sidebar as a drawer on narrow screens. The design phase
  checks first whether the app has a narrow-screen layout today.
- **Popover**: show details such as the Nimbus version in a popover.
- **ComboBox**: filter the icon explorer, if the current tag bar and category
  rail are not enough.
- **Steps**: show the install guide as steps, if a page has a real sequence.

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

- `apps/docs/src/components/navigation/` (breadcrumb, menu, app-nav-bar)
- `apps/docs/src/layouts/` (loading fallbacks, narrow-screen navigation)
- `apps/docs/src/components/document-renderer/components/token-demos/icon-search/`
  (only if ComboBox is chosen)
- `openspec/specs/docs-app/spec.md` (delta spec)
- No new dependencies. All components come from `@commercetools/nimbus`.
- Risk: the sidebar and breadcrumb are used on every page. Keyboard behaviour
  and scroll restoration (`useSidebarScrollRestoration`) must keep working.
