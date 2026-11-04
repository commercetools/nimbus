## 1. Investigation

- [x] 1.1 Check the docs app on a narrow screen and record whether sidebar navigation works (decides task 6)
- [x] 1.2 Check whether `ProgressBar` supports an indeterminate state (decides task 4.3)
- [x] 1.3 Re-count Nimbus components used in `apps/docs/src` and record the baseline (41 used, 49 unused, 90 folders)

## 2. Breadcrumbs

- [x] 2.1 Replace the link list in `components/navigation/breadcrumb/breadcrumb.tsx` with `Breadcrumbs` (`size="sm"`, 14px, to match the app's text size), built from the existing `menuToPath` data
- [x] 2.2 Keep the Home item with its icon, the "Copy link" button, and `BreadcrumbProvider` behaviour
- [x] 2.3 Verify with Playwright: keyboard navigation, links to parent pages, "Copy link" visible on hover and focus

## 3. Skeleton (dropped)

- [x] 3.1 Tried `Skeleton` placeholders for page content and the table of contents, then removed them. The docs bundle is loaded at once, so the loading state lasts too short to see. Skeleton stays unused in the app
- [x] 3.2 `Suspense` fallbacks keep `LoadingSpinner`

## 4. ProgressBar

- [x] 4.1 Show `downloadPercent` in a `ProgressBar` while `status === "loading-model"` in `app-nav-bar-search.tsx`
- [x] 4.2 Keep an accessible text label for the download and indexing phases
- [x] 4.3 Use an indeterminate bar for the indexing phase if task 1.2 allows it

## 5. Sidebar (dropped)

- [x] 5.1 Dropped. Accordion cannot hold links as parents. Tree would turn the site navigation into a `treegrid` for little gain. The sidebar keeps its links

## 6. Other places

- [x] 6.1 Add a `Drawer` for narrow-screen navigation (`components/navigation/mobile-nav`). Below the `lg` breakpoint the app frame hides the sidebar and the table of contents and shows a menu button that opens the sidebar in a drawer
- [x] 6.2 Popover for the Nimbus version: skipped. The badge shows only the version, so a popover would have nothing to show
- [x] 6.3 ComboBox for the icon explorer: skipped. Search, the category list and the tag bar already cover filtering
- [x] 6.4 Steps: skipped. The only step-by-step page is the static Installation page, and `Steps` is a stateful progress component
- [x] 6.5 Use `Slider` for the icon size control in the icon explorer (`icon-display-controls.tsx`), replacing a plain range input
- [x] 6.6 Use `ListBox` for the category list in the icon explorer (`category-rail.tsx`), replacing the React Aria `ListBox` and its custom row styles

## 7. Finish

- [x] 7.1 Re-count used components: 46 of 90 folders are used (was 41). New: Breadcrumbs, Drawer, ListBox, ProgressBar, Slider
- [ ] 7.2 Update `docs-app` spec through `/opsx:archive` after implementation
- [x] 7.3 ESLint and Prettier are clean on the changed files, and `tsc` reports no errors in them (the docs app has other type errors in files this change does not touch)
- [x] 7.4 Checked in the browser at 1440px and 700px, in light and dark mode
