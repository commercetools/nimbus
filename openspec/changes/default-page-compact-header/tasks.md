# Tasks

## 1. Types and warning

- [ ] 1.1 Add `collapseHeaderOnScroll?: boolean` with JSDoc to both branches of
      `DefaultPageProps`. Verify with
      `pnpm --filter @commercetools/nimbus typecheck:dev`.
- [ ] 1.2 Add compile checks for consumer patterns that must keep working: a
      `layout` value typed as `"constrained" | "flexible"`, an
      `Omit<DefaultPageProps, "children">` wrapper that spreads into Root,
      `({ layout, ...rest }) => <Root layout={layout} {...rest} />`, and
      `stickyHeader={someBoolean}` with and without the new prop. Put them
      inside an `it()` block in `default-page.types.spec.ts` (a file with only
      type checks fails with "No test suite found"), or in the stories as in
      `grid.stories.tsx`. Verify with `typecheck:dev` and the unit run.
- [ ] 1.3 Log a warning in development builds when `collapseHeaderOnScroll` is
      true with `layout="flexible"` and no `stickyHeader`. Verify with a unit
      test that spies on `console.warn` and checks that production builds do
      not warn.

## 2. Scroll distance and header state

- [ ] 2.1 Write a pure function for the next header form: collapsed at a
      distance of at least the space given back plus 8 CSS pixels, full below 1
      CSS pixel, unchanged in between, and full when nothing could be measured
      or the header height is 0. Verify with a unit spec that covers both
      points, the range in between, scrolling up within that range, and missing
      or zero measurements.
- [ ] 2.2 Write the hook (in `default-page/hooks/`) that measures the scroll
      distance with `content.scrollTop + max(0, header.bottom − content.top)`.
      It listens to `scroll` in the capture phase on the document and on every
      shadow root along the flat tree (`assignedSlot`, `host`), ignores
      unrelated targets, applies form changes only after 150 milliseconds
      without a scroll event, holds the form while the mouse pointer is over the
      header (released on pointer leave or a wheel event over the header), uses
      `ResizeObserver` with `{ box: "border-box" }`, never applies a form change
      synchronously in the `ResizeObserver` callback, and does nothing when the
      option is off. Verify with a unit spec using fake timers: listeners only
      when enabled, unrelated targets ignored, no change before the pause, the
      pointer hold, everything removed on unmount.
- [ ] 2.3 Measure the collapsed height on a hidden copy of the header (decision
      4) on mount and when the full header changes size. Verify with a story
      that measures the real full and collapsed heights, derives the space given
      back S, and checks that a distance of S + 7 keeps the full form and S + 9
      collapses after the pause. Also verify that measuring on a short page
      scrolled to the bottom does not move the content.
- [ ] 2.4 Write a story first, with the flexible layout + `stickyHeader` and a
      scroll container that starts 200px below the top of the window. It
      scrolls 10px per frame, stops, and expects the header to collapse after
      the pause. Verify that it fails before 2.5 and passes after.
- [ ] 2.5 Connect Root and Header through a context file
      (`default-page.context.ts`): Header and Content register their elements,
      Root runs the hook, Header writes `data-collapsed="true"` in its collapsed
      form, and Root sets `--default-page-header-height` in pixels after the
      first measurement. Verify that the 2.4 story passes and that the variable
      matches the header height in both forms and is absent before the first
      measurement, with
      `pnpm test:storybook:dev packages/nimbus/src/components/default-page/default-page.stories.tsx`.

## 3. Collapsed form

- [ ] 3.1 Get the collapsed values (padding, title font size and line height,
      fade timing) from the Nimbus design, and record them in design.md under
      "Open Questions" as resolved. Verify that design.md lists the values and
      their source.
- [ ] 3.2 Wrap the back link label in its own element, and show a Nimbus
      `Tooltip` with the label in the collapsed form only. The tooltip must not
      add an `aria-describedby` to the link, and its content is `aria-hidden`.
      Verify with stories: the tooltip appears on hover and keyboard focus in
      the collapsed form and never in the full form, the tooltip text equals the
      label, the link has no accessible description from the tooltip, the
      accessible name is unchanged, and the existing DefaultPage stories and
      `default-page.docs.spec.tsx` pass.
- [ ] 3.3 Add the `collapseHeaderOnScroll` recipe variant, with collapsed styles
      under `&[data-collapsed="true"]`: header padding; title on one line with
      ellipsis; back link icon inside grid column 1 on the title row with a 24
      by 24 CSS pixel target; Actions on the title row; page-owned content in
      its grid column; subtitle and back link label hidden visually but kept in
      the accessibility tree. Add a fade-in (opacity) for parts that appear, with
      `_motionReduce` at 0, and no fade on the first measurement. Regenerate the
      theme typings (`pnpm --filter @commercetools/nimbus build-theme-typings`);
      the DefaultPage recipe is already registered. Verify with the stories in
      3.5.
- [ ] 3.4 Keep the content still when the header collapses after a scroll
      (decision 6), in both layouts: read, write and correct in one task with
      `behavior: "instant"`; no correction after a jump or on the first
      measurement; save and restore the scroller offset when returning to the
      full form at the top. Verify with stories:
      - the screen position of a content element is the same, within 1 pixel,
        before and after the collapse;
      - `scrollIntoView({ behavior: "smooth" })` reaches its target;
      - after a jump, the target ends directly below the collapsed header;
      - at the top, the content starts directly below the full header, also
        with content above Root in the same scroller.
- [ ] 3.5 Add stories with play functions for: constrained layout; flexible +
      `stickyHeader` with the scroll container at the top of the window;
      document scroll; content that only just overflows; a narrow container with
      every header part; page-owned header content keeping its position; a tab
      click that resets the scroll while the pointer is over the header (no
      change until the pointer leaves); the option switched off at runtime;
      flexible without `stickyHeader` (full form, development warning); and the
      option off (no `data-collapsed`, no variable). Each scrolling story checks
      the full form at 0, no change while scrolling, the kept form between the
      two points (also while scrolling up), the collapsed form after the pause
      past the threshold, and the full form back at the top. Reset every scroll
      position at the end of a story. Mark the collapsed state for a VRT
      snapshot as described in `docs/file-type-guidelines/stories.md`. Verify
      with `pnpm test:storybook:dev` on the stories file.
- [ ] 3.6 Update `default-page.dev.mdx`:
      - the layout modes table and a new "Collapse header on scroll" section
        (threshold, pause, pointer hold, the warning without a pinned header);
      - the scoped `data-collapsed` selector in "Custom elements in the header";
      - the CSS variable: flexible layout only, sticky `top` and
        `scroll-margin-top` inside the page, the `0px` fallback, not for sizes
        and not for `scroll-padding-top`;
      - notes on JSDOM (always the full form), full-height scroll areas inside
        the content, putting the distinguishing part of the title first, and
        the tooltip not opening on touch;
      - the corrected BackLink section and Accessibility section (label as
        children, not `aria-label`);
      - the Root row in "Component parts".

      Add the designer view to `default-page.mdx` and a consumer example to
      `default-page.docs.spec.tsx`. Verify that the docs spec passes and the
      live examples render in `pnpm start:docs`.
- [ ] 3.7 Add a minor changeset for `@commercetools/nimbus` that starts with
      "`DefaultPage` (Beta):", following `docs/changeset-conventions.md`. Include
      the note on snapshot tests and `getByText` for the back link. Verify with
      `pnpm changeset:status`.

## 4. Accessibility and motion

- [ ] 4.1 Add play steps that check: the same `h1` element in both forms; the
      back link, subtitle, actions and tab navigation still in the document;
      focus kept on a header element when the form changes; the back link's
      accessible name after the fade and with reduced motion; its 24 by 24 CSS
      pixel target; and the subtitle text in the accessibility tree. Verify with
      `pnpm test:storybook:dev` and the a11y test tag.
- [ ] 4.2 Check reduced motion as `docs/file-type-guidelines/stories.md`
      describes: a play function cannot fake the media query, so assert the
      compiled `_motionReduce` rule for the fade, and check that the header
      still changes form. Verify with `pnpm test:storybook:dev` on the stories
      file.

## 5. Integration checks

- [ ] 5.1 Run `pnpm --filter @commercetools/nimbus typecheck:dev` and
      `pnpm lint`, both without errors.
- [ ] 5.2 Run the full DefaultPage story suite and unit specs with
      `pnpm test:dev packages/nimbus/src/components/default-page/`, all green.
- [ ] 5.3 Check both layouts by hand in Chrome, Firefox, Safari 26 (no scroll
      anchoring) and Safari 27: mouse wheel, trackpad fling, Space and Page Down,
      a smooth `#hash` link, the content staying still, the tab-click hold, and
      the back link tooltip. Record the results in this file.
- [ ] 5.4 Search the new and changed content of this change for product names
      and ticket keys, and verify that none appear. Existing text outside this
      change is not part of the check.
- [ ] 5.5 Run
      `pnpm exec openspec validate default-page-compact-header --type change --strict`
      without errors.

## Workflow follow-up

- Separate fix, outside this change: set `tabIndex={0}` on
  `DefaultPage.Content` only in the constrained layout, with a visible focus
  style.
- Separate topic: focus that scrolls under a sticky header in the flexible
  layout (WCAG 2.4.7, technique C43).
- `ModalPage` adopts the hook in its own change (design.md, decision 11).
- Decide when to publish: push the branch and open a pull request. Until then,
  the branch stays local.
- Archive the change after the project's review requirements are satisfied.
