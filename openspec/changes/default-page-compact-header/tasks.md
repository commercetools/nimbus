# Tasks

Sections 1 to 5 built the one-step change, which is now the fallback (design.md,
decision 12). Notes mark what a later decision changed. Section 6 builds the
scroll-driven change.

## 1. Types and warning

- [x] 1.1 Add `collapseHeaderOnScroll?: boolean` with JSDoc to both branches of
      `DefaultPageProps`. Verify with
      `pnpm --filter @commercetools/nimbus typecheck:dev`.
- [x] 1.2 Add compile checks for consumer patterns that must keep working: a
      `layout` value typed as `"constrained" | "flexible"`, an
      `Omit<DefaultPageProps, "children">` wrapper that spreads into Root,
      `({ layout, ...rest }) => <Root layout={layout} {...rest} />`, and
      `stickyHeader={someBoolean}` with and without the new prop. Put them
      inside an `it()` block in `default-page.types.spec.ts` (a file with only
      type checks fails with "No test suite found"), or in the stories as in
      `grid.stories.tsx`. Verify with `typecheck:dev` and the unit run.
- [x] 1.3 Log a warning in development builds when `collapseHeaderOnScroll` is
      true with `layout="flexible"` and no `stickyHeader`. Verify with a unit
      test that spies on `console.warn` and checks that production builds do
      not warn.

## 2. Scroll distance and header state

- [x] 2.1 Write a pure function for the next header form: collapsed at a
      distance of at least the space given back plus 8 CSS pixels, full below 1
      CSS pixel, unchanged in between, and full when nothing could be measured
      or the header height is 0. Verify with a unit spec that covers both
      points, the range in between, scrolling up within that range, and missing
      or zero measurements.
      - Changed by 6.4: in the flexible layout the threshold is 8 CSS pixels
        past the space the header keeps.
- [x] 2.2 Write the hook (in `default-page/hooks/`) that measures the scroll
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
      - Now the one-step fallback only (design.md, decision 12).
- [x] 2.3 Measure the collapsed height on a hidden copy of the header (design.md,
      decision 9) on mount and when the full header changes size. Verify with a story
      that measures the real full and collapsed heights, derives the space given
      back S, and checks that a distance of S + 7 keeps the full form and S + 9
      collapses after the pause. Also verify that measuring on a short page
      scrolled to the bottom does not move the content.
- [x] 2.4 Write a story first, with the flexible layout + `stickyHeader` and a
      scroll container that starts 200px below the top of the window. It
      scrolls 10px per frame, stops, and expects the header to collapse after
      the pause. Verify that it fails before 2.5 and passes after.
- [x] 2.5 Connect Root and Header through a context file
      (`default-page.context.ts`): Header and Content register their elements,
      Root runs the hook, Header writes `data-collapsed="true"` in its collapsed
      form, and Root sets `--default-page-header-height` in pixels after the
      first measurement. Verify that the 2.4 story passes and that the variable
      matches the header height in both forms and is absent before the first
      measurement, with
      `pnpm test:storybook:dev packages/nimbus/src/components/default-page/default-page.stories.tsx`.

## 3. Collapsed form

- [x] 3.1 Get the collapsed values (padding, title font size and line height,
      fade timing) from the Nimbus design, and record them in design.md under
      "Open Questions" as resolved. Verify that design.md lists the values and
      their source.
- [x] 3.2 Wrap the back link label in its own element, and show a Nimbus
      `Tooltip` with the label in the collapsed form only. The tooltip must not
      add an `aria-describedby` to the link, and its content is `aria-hidden`.
      Verify with stories: the tooltip appears on hover and keyboard focus in
      the collapsed form and never in the full form, the tooltip text equals the
      label, the link has no accessible description from the tooltip, the
      accessible name is unchanged, and the existing DefaultPage stories and
      `default-page.docs.spec.tsx` pass.
- [x] 3.3 Add the `collapseHeaderOnScroll` recipe variant, with collapsed styles
      under `&[data-collapsed="true"]`: header padding; title on one line with
      ellipsis; back link icon inside grid column 1 on the title row with a 24
      by 24 CSS pixel target; Actions on the title row; page-owned content in
      its grid column; subtitle and back link label hidden visually but kept in
      the accessibility tree. Add a fade-in (opacity) for parts that appear, with
      `_motionReduce` at 0, and no fade on the first measurement. Regenerate the
      theme typings (`pnpm --filter @commercetools/nimbus build-theme-typings`);
      the DefaultPage recipe is already registered. Verify with the stories in
      3.5.
      - Changed by 6.5: the collapsed title keeps all its lines.
- [x] 3.4 Keep the content still when the header collapses after a scroll
      (design.md, decision 12), in both layouts: read, write and correct in one task with
      `behavior: "instant"`; no correction after a jump or on the first
      measurement; save and restore the scroller offset when returning to the
      full form at the top. Verify with stories:
      - the screen position of a content element is the same, within 1 pixel,
        before and after the collapse;
      - `scrollIntoView({ behavior: "smooth" })` reaches its target;
      - after a jump, the target ends directly below the collapsed header;
      - at the top, the content starts directly below the full header, also
        with content above Root in the same scroller.
      - Changed by 6.4: in the flexible layout the header keeps its space, so
        there is no correction there.
- [x] 3.5 Add stories with play functions for: constrained layout; flexible +
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
- [x] 3.6 Update `default-page.dev.mdx`:
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
      - Changed by 6.7: the `data-collapsed` selector is no longer documented;
        pages use the function as Header children.

      Add the designer view to `default-page.mdx` and a consumer example to
      `default-page.docs.spec.tsx`. Verify that the docs spec passes and the
      live examples render in `pnpm start:docs`.
- [x] 3.7 Add a minor changeset for `@commercetools/nimbus` that starts with
      "`DefaultPage` (Beta):", following `docs/changeset-conventions.md`. Include
      the note on snapshot tests and `getByText` for the back link. Verify with
      `pnpm changeset:status`.

## 4. Accessibility and motion

- [x] 4.1 Add play steps that check: the same `h1` element in both forms; the
      back link, subtitle, actions and tab navigation still in the document;
      focus kept on a header element when the form changes; the back link's
      accessible name after the fade and with reduced motion; its 24 by 24 CSS
      pixel target; and the subtitle text in the accessibility tree. Verify with
      `pnpm test:storybook:dev` and the a11y test tag.
- [x] 4.2 Check reduced motion as `docs/file-type-guidelines/stories.md`
      describes: a play function cannot fake the media query, so assert the
      compiled `_motionReduce` rule for the fade, and check that the header
      still changes form. Verify with `pnpm test:storybook:dev` on the stories
      file.
      - Changed by 6.3: with reduced motion the one-step change runs.

## 5. Integration checks

- [x] 5.1 Run `pnpm --filter @commercetools/nimbus typecheck:dev` and
      `pnpm lint`, both without errors.
- [x] 5.2 Run the full DefaultPage story suite and unit specs with
      `pnpm test:dev packages/nimbus/src/components/default-page/`, all green.
- [ ] 5.3 Check both layouts by hand in Chrome, Firefox, Safari 26 (no scroll
      anchoring) and Safari 27: mouse wheel, trackpad fling, Space and Page Down,
      a smooth `#hash` link, the content staying still, the tab-click hold, and
      the back link tooltip. Record the results in this file.
      - Not yet done by hand. Automated runs of
        `default-page.stories.tsx` on 2026-11-04: headless Chromium 31/31
        (source and built bundle), Playwright WebKit 31/31. Playwright
        Firefox did not start on this machine ("Could not find profile
        folder"). Playwright WebKit is not Safari 26 or 27.
      - Replaced by 6.8.
- [x] 5.4 Search the new and changed content of this change for product names
      and ticket keys, and verify that none appear. Existing text outside this
      change is not part of the check.
- [x] 5.5 Run
      `pnpm exec openspec validate default-page-compact-header --type change --strict`
      without errors.

## 6. Scroll-driven change

- [x] 6.1 Prototype the scroll-driven change behind an experiment attribute,
      in both layouts: measuring both forms on copies, the plan (collapse
      distance, pinned height, title row for several lines), the part motions,
      the `IntersectionObserver` states, rest without animations at the top
      and when pinned, the start ahead of the scroll on input, the compact back
      link and the tooltip when pinned, and in the constrained layout the
      margin and padding animations. Verified with the experiment stories in
      Chromium and WebKit, and by measuring frame times and part positions per
      frame in Chromium (design.md, decisions 4 and 5).
- [x] 6.2 Accept a function as `DefaultPage.Header` children that receives
      `{ isCollapsed }`. Verified with the custom-content story, the
      header-state story and a compile check in `default-page.types.spec.tsx`.
- [x] 6.3 Make the scroll-driven change the default: remove the experiment
      attribute; Root uses the scroll-driven change when view and scroll
      timelines exist and reduced motion is not requested; otherwise the
      one-step change. The decision comes from `useSyncExternalStore` with a
      server snapshot of "not supported", so server rendering and hydration
      use the one-step change; the first render's markup is the same in both
      techniques. Turn the experiment stories into regular stories. Verify
      with `pnpm test:storybook:dev` on the stories file.
- [x] 6.4 One-step fallback in the flexible layout: the header keeps its space
      and changes at once. Delete `utils/animate-keep-space-header.ts` and the
      animation code in `use-collapse-header-on-scroll.ts`. Verify with stories
      that hide `ViewTimeline` and `ScrollTimeline` in a `beforeEach` and
      restore them afterwards.
- [x] 6.5 The collapsed form of the one-step fallback keeps all title lines
      (no one-line ellipsis), with the back link icon centered on the title
      row (design.md, decision 7). Verify with the long-title story in the
      fallback.
- [x] 6.6 Unit tests for `planScrollDrivenHeader` (pure: distance, pinned
      height, title row for several lines, rounding) and for the state logic
      as pure functions (thresholds, a ratio of 0 keeps the state). Verify
      with `pnpm test:unit`.
- [x] 6.7 Docs: in `default-page.dev.mdx`, describe both changes, browser
      support, the function as Header children, the height variable (pinned
      height), long titles and truncation, the tab-click behavior, reduced
      motion, and in the constrained layout Root's clip and the kept padding;
      remove the `data-collapsed` section. Update `default-page.mdx`, add a
      function-children example to `default-page.docs.spec.tsx`, and update the
      changeset. Verify that the docs spec passes and the examples render.
- [ ] 6.8 Check by hand in Chrome, Firefox 159 or later, Safari 26 and 27
      (speed and look), and Firefox ESR 153 (one-step fallback): mouse wheel,
      trackpad, Space and Page Down, a `#hash` link, a tab click, the back
      link tooltip, a long title, right-to-left text, a narrow page, and a 1x
      and a 2x display. Record the results here.
- [x] 6.9 Run `pnpm --filter @commercetools/nimbus typecheck:dev`, `pnpm lint`,
      `pnpm test:dev packages/nimbus/src/components/default-page/`, the stories
      in WebKit, and
      `pnpm exec openspec validate default-page-compact-header --type change --strict`,
      all without errors.
- [x] 6.10 A size change while the header is pinned keeps the form: measuring
      again must not show the hidden parts for a frame. Verify with
      `CollapseHeaderResizeWhilePinned`, which changes the page width in steps
      and checks the opacity of the subtitle and the back link label on every
      frame (fails with `--retry=0` before the fix).
- [x] 6.11 A size change while the header is pinned in the constrained layout
      shows no jump: the header top and the content area's top padding keep
      their pinned values on every frame. Verify with
      `CollapseHeaderResizeWhilePinnedConstrained` (fails with `--retry=0`
      before the fix).
- [x] 6.12 Each form is measured with the page content that it renders, so a
      page that removes content when `isCollapsed` is true gets the same
      collapse distance and pinned height at the top and while pinned. Verify
      with `CollapseHeaderNoteRemovedWhenCollapsed` (fails with `--retry=0`
      before the fix).

## Workflow follow-up

- Separate fix, outside this change: set `tabIndex={0}` on
  `DefaultPage.Content` only in the constrained layout, with a visible focus
  style.
- Separate topic: focus that scrolls under a sticky header in the flexible
  layout (WCAG 2.4.7, technique C43).
- `ModalPage` adopts the hooks in its own change (design.md, decision 15).
- Decide when to publish: push the branch and open a pull request. Until then,
  the branch stays local.
- Archive the change after the project's review requirements are satisfied.
