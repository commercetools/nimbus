# TabNav Component — Research Conclusion

**Context:** Three in-progress page components (ModalPage, MainPage, DetailPage)
all need a horizontal navigation bar with tab-like styling in their headers.
This document summarises the research and reasoning behind the recommended
approach.

---

## The Problem

The page components need a way to navigate between distinct views or sections
within a page (or route to different URLs). The natural visual metaphor is a tab
strip in the page header.

Two candidate approaches were considered:

- **Option A — Use the existing `Tabs` component** with `Tabs.List` in the
  header and `Tabs.Panel` in the content area
- **Option B — Build a new navigation component** with tab-like visual styling

---

## Why the Existing `Tabs` Component Is the Wrong Tool Here

### The ARIA split is not about DOM adjacency

The claim that putting `Tabs.List` in the header and `Tabs.Panel` in the content
area "doesn't work a11y-wise" turns out to be **imprecisely stated**. The ARIA
spec does not require `tablist` and `tabpanel` to be DOM-adjacent — the
relationship is established via `aria-controls` / `aria-labelledby`. React Aria
wires this through React Context, not DOM proximity, so it technically works.

The real problems are architectural:

- `Tabs.Root` must wrap both the header and content, inverting the composition
  hierarchy (Tabs ends up owning the ModalPage layout, not the other way around)
- React Aria requires `Tabs.List` to render before `Tabs.Panel` in the tree —
  fragile to future refactoring
- `TabPanel` nulls out `TabListStateContext` for its subtree, which can cause
  unexpected behaviour in complex nested layouts

### The deeper semantic problem

More fundamentally, `role="tablist"` is the wrong ARIA role for page-header
navigation regardless of DOM structure. The differences are not cosmetic:

| Concern                    | `role="tablist"` (Tabs)          | Page header navigation      |
| -------------------------- | -------------------------------- | --------------------------- |
| Container element          | `<div>`                          | `<nav>`                     |
| Item element               | `<button>`                       | `<a>`                       |
| Active state attribute     | `aria-selected="true"`           | `aria-current="page"`       |
| Keyboard navigation        | Arrow keys (roving tabindex)     | Tab key (sequential)        |
| Associated panel           | Requires `tabpanel` on same page | None — navigates to a route |
| Screen reader announcement | "tab, 2 of 3, tablist"           | "link, navigation landmark" |

With `role="tablist"`, pressing ArrowRight/Left moves focus within the tab
strip. When the items are actual navigation links (routing to different views),
those arrow key presses change nothing — they only move visual focus. This is
actively confusing for keyboard and screen reader users.

Bootstrap explicitly warns in its docs: navigation bars styled as tabs _"should
not be given `role="tablist"`, `role="tab"` or `role="tabpanel"` attributes."_
Material UI has an open acknowledged bug for the same mistake in their "NavTabs"
example.

---

## The Right Solution: A Dedicated `TabNav` Component

### Industry precedent

Radix UI drew exactly this line when building their design system:

- **`Tabs`** (Radix Primitives): WAI-ARIA Tabs pattern, `role="tablist"`, roving
  tabindex, content switching only, no `href`
- **`TabNav`** (Radix Themes): Navigation landmark pattern, renders `<nav>`,
  links use `aria-current`, standard sequential Tab stops

Their docs state explicitly: _"Tabs should not be used for page navigation. Use
Tab Nav instead, which is designed for this purpose and has equivalent styles."_

### Why not a generic `Nav` component with a `tabs` variant?

The idea of `<Nav variant="tabs">` is appealing ("it's all just links, right?")
and partially correct — the semantic structure is the same across visual
variants. However:

- **`Nav` is too broad.** Sidebars, breadcrumbs, and footers are also "navs." A
  generic `Nav` either needs to cover all those cases (scope creep) or relies on
  `variant="tabs"` to communicate its actual scope, which is backwards.
- **It risks conflation with `Tabs`.** A `Nav` component with a `variant="tabs"`
  prop will make developers assume it behaves like the `Tabs` component. The
  name should make the distinction obvious.
- **Variants don't change the semantic structure** — they're purely visual.
  Naming it `TabNav` doesn't prevent adding `variant="pills"` or
  `variant="underline"` later; it just names the component's purpose clearly up
  front.

### What `TabNav` should be

- Renders `<nav>` as the container (provides the `navigation` landmark)
- Items render as `<a>` elements (or use `asChild` for router integration)
- Active item uses `aria-current="page"`
- Keyboard behaviour: standard sequential Tab key navigation — no roving
  tabindex, no arrow key cycling
- Accepts a `variant` prop (`"tabs"` as default) for visual variants
- No `tabpanel`, no `aria-controls`, no panel relationship — it navigates, it
  doesn't switch content in place

### Relationship to the existing `Tabs` component

|                | `Tabs`                                         | `TabNav`                             |
| -------------- | ---------------------------------------------- | ------------------------------------ |
| Purpose        | Switch between content panels on the same page | Navigate between routes / page views |
| Container      | `<div role="tablist">`                         | `<nav>`                              |
| Items          | `<button role="tab">`                          | `<a aria-current="page">`            |
| Keyboard       | Arrow keys (roving tabindex)                   | Tab key (sequential)                 |
| Panels         | Required (`Tabs.Panel`)                        | None                                 |
| Where it lives | Inside page content area                       | In the page header                   |

---

## Summary

The a11y concern about "tabs in the header" was directionally correct but blamed
the wrong cause. The actual issue is semantic: `role="tablist"` is a
content-switching widget, not a navigation landmark. Using it for route-based
navigation gives users incorrect keyboard behaviour and ARIA semantics
regardless of where in the DOM it sits.

The right path forward is a dedicated **`TabNav` component** that:

1. Uses proper navigation semantics (`<nav>`, `<a>`, `aria-current`)
2. Is visually equivalent to the `Tabs` component's tab strip
3. Accepts a `variant` prop for future visual variants
4. Is shared across ModalPage, MainPage, and DetailPage headers
5. Is clearly distinct from `Tabs` by name, preventing misuse

This follows the same decision Radix UI made when they separated `Tabs` from
`TabNav`, and aligns with the explicit guidance in the Bootstrap and WAI-ARIA
documentation.
