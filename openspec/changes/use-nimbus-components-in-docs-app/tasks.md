## 1. Investigation

- [ ] 1.1 Check the docs app on a narrow screen and record whether sidebar navigation works (decides task 6)
- [ ] 1.2 Check whether `ProgressBar` supports an indeterminate state (decides task 4.3)
- [ ] 1.3 Re-count Nimbus components used in `apps/docs/src` and record the baseline (33 used, 49 unused)

## 2. Breadcrumbs

- [ ] 2.1 Replace the link list in `components/navigation/breadcrumb/breadcrumb.tsx` with `Breadcrumbs`, built from the existing `menuToPath` data
- [ ] 2.2 Keep the Home item with its icon, the "Copy link" button, and `BreadcrumbProvider` behaviour
- [ ] 2.3 Verify with Playwright: keyboard navigation, links to parent pages, "Copy link" visible on hover and focus

## 3. Skeleton

- [ ] 3.1 Use `Skeleton` as the fallback for the content area and the table of contents in `layouts/app-layout.tsx`
- [ ] 3.2 Match the skeleton width to `AppFrame.MainContent` so the content does not jump
- [ ] 3.3 Keep `LoadingSpinner` for the sidebar menu and for `routes/dynamic-route.tsx`
- [ ] 3.4 Use `Skeleton` for search results while they load, if the search UI has a loading state for them

## 4. ProgressBar

- [ ] 4.1 Show `downloadPercent` in a `ProgressBar` while `status === "loading-model"` in `app-nav-bar-search.tsx`
- [ ] 4.2 Keep an accessible text label for the download and indexing phases
- [ ] 4.3 Use an indeterminate bar for the indexing phase if task 1.2 allows it

## 5. Sidebar

- [ ] 5.1 Try `Accordion` on `components/navigation/menu/components/menu-item.tsx`
- [ ] 5.2 Try `Tree` on the same item
- [ ] 5.3 Keep the option that preserves link semantics, current-route highlight and sidebar scroll restoration; if neither does, drop this task and note it in `design.md`

## 6. Conditional candidates

- [ ] 6.1 Add a `Drawer` for narrow-screen navigation, only if task 1.1 shows it is missing
- [ ] 6.2 Add a `Popover` for the Nimbus version details, only if the current version display has more detail to show
- [ ] 6.3 Add a `ComboBox` filter to the icon explorer, only if the tag bar and category rail do not cover the need
- [ ] 6.4 Use `Steps` on a page with a real sequence, only if one exists

## 7. Finish

- [ ] 7.1 Re-count used components and record the result in this change
- [ ] 7.2 Update `docs-app` spec through `/opsx:archive` after implementation
- [ ] 7.3 Run `pnpm typecheck:strict` and `pnpm lint`
- [ ] 7.4 Check the docs app in the browser in light and dark mode
