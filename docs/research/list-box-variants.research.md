# ListBox — visual variants & usage research

> **Status:** Research complete · informs OpenSpec proposal for `ListBox`
> **Ticket:**
> [FEC-1139 — Nimbus Phase 1: ListBox component](https://commercetools.atlassian.net/browse/FEC-1139)
> **Date:** 2026-09-08 **Author:** Michael Salzmann

## Why this document exists

FEC-1139 asks us to add a standalone `ListBox` that wraps React Aria's
`ListBox`. Behaviour (single/multi selection, sections, keyboard navigation,
type-ahead, drag-and-drop) is fixed by React Aria. The open question was
**visual**: how should a ListBox _look_, are there different variants, and which
ones do we actually need so the component is usable in the contexts where it
will live?

This document records the answer, so the OpenSpec proposal and the
implementation can point back to a single verified source.

## How this was researched

A multi-source, fact-checked research pass (deep-research workflow):

- **5 search angles** → **22 sources fetched** → **101 claims extracted**.
- **25 top claims verified** with 3-vote adversarial checking (a claim needed 2
  of 3 votes to survive). **24 confirmed, 1 refuted, 0 unverified.**
- Reference systems compared: Adobe React Spectrum / React Aria, GitHub Primer
  (ActionList), Shopify Polaris (Option List), Material UI, IBM Carbon, plus a
  scoped look at Fluent 2 / Material 3 / Base UI / shadcn.

Full source list at the bottom. Quotes below are word-for-word from the cited
primary docs.

---

## Finding 1 — Build ONE ListBox, not an "embedded" and a "standalone" version

**Confidence: high.** React Aria reuses the _exact same_ `ListBox` component as
the popup content of Select, ComboBox, and Autocomplete — each nested as
`<Popover><ListBox /></Popover>`. The embedded instance keeps the full
standalone feature set (static/dynamic collections, sections, disabled items,
links, text slots, async loading); it is, if anything, _more_ capable
(filtering, TagGroup multi-select) inside Autocomplete.

> "Select reuses the ListBox component, following the Collection Components
> API." —
> [React Aria Select](https://react-spectrum.adobe.com/react-aria/Select.html)

> "`ComboBox` reuses the `ListBox` component" … supporting "ListBox features
> such as static and dynamic collections, sections, disabled items, links, text
> slots, asynchronous loading, etc." —
> [React Aria ComboBox docs](https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/docs/ComboBox.mdx)

**Implication:** do not spec a reduced "menu-mode" ListBox. Spec one component,
and make sure its styling reads well inside a popover.

## Finding 2 — Usage is overlay-dominant, standalone secondary

**Confidence: high.** A selection list is used overwhelmingly as popup content
inside Select/ComboBox/Menu/Autocomplete, with standalone use (settings/filter
lists, pickers) as the secondary case. Mature product systems ship one
implementation for both.

> Shopify Polaris Option List "usually appears in a popover, and sometimes in a
> modal or a sidebar." —
> [Polaris Option List](https://polaris-react.shopify.com/components/lists/option-list)

GitHub Primer's ActionList items are "the foundation of ActionMenu, SelectPanels
and NavLists" — one component reused across menu, dropdown-select, and
standalone navigation contexts. —
[Primer ActionList](https://primer.style/react/ActionList)

## Finding 3 — Selection affordance is a variant driven by intent, NOT auto-derived from mode

**Confidence: high.** The common mapping is single-select → row highlight /
trailing checkmark, multi-select → checkboxes. **But multi-select does not
obligate a checkbox.** A deliberate macOS/Windows-style "replace" multi-select
uses full-row highlight instead.

> Polaris: "Controls in simple option lists are buttons, and controls in
> multiple option lists are checkboxes." —
> [Polaris Option List](https://polaris-react.shopify.com/components/lists/option-list)

> React Aria's multi-select contact-list uses a plain highlight, no checkbox:
> "This emulates native platforms such as macOS and Windows, and is often used
> when checkboxes in each row are not desired." —
> [React Aria contact-list example](https://react-spectrum.adobe.com/react-aria/examples/contact-list.html)

Primer ActionList sets selection via a list-level `selectionVariant` of
`single | multiple`; MUI shows three affordances (row highlight via `selected`,
checkbox, switch) by use case.

**Implication:** expose selection style as its own prop
(`checkbox | highlight | checkmark`), decoupled from `selectionMode`. This is
the main visual decision the research says we _must_ get right; it cannot be
inferred automatically. (Verifier note: "selection mode drives affordance" is a
design convention, not automatic ARIA behaviour — a listbox uses `role=option` +
`aria-selected`; the menu-role mapping is set by the developer.)

## Finding 4 — Rich item content is modelled through named slots; React Aria gives them for free

**Confidence: high.** Every mature system models a list item as discrete slots:
leading icon/avatar, primary label + secondary/description text (inline-beside
or block-below), trailing visual/metadata/action, and grouped sections with
headers. React Aria's `ListBox` already exposes these as first-class API.

> Primer ActionList exposes `ActionList.LeadingVisual`,
> `ActionList.TrailingVisual`, `ActionList.TrailingAction`, and
> `ActionList.Description` with `variant: 'inline' | 'block'` ("inline
> descriptions positioned beside primary text; block descriptions positioned
> below"). — [Primer ActionList](https://primer.style/react/ActionList)

React Aria `ListBoxItem` anatomy: `<Text slot="label">` +
`<Text slot="description">`, an optional `<SelectionIndicator />`, and
`<ListBoxSection>` with `<Header>`. Its contact-list example renders a leading
avatar (row-span-2) plus a two-tier label/description text block. —
[React Aria useListBox](https://react-aria.adobe.com/ListBox/useListBox.html)

MUI composes items from `ListItemIcon`, `ListItemAvatar`, `ListItemText`
(primary + secondary). — [MUI List](https://mui.com/material-ui/react-list/)

**Implication:** provide item content slots for leading media, secondary text,
trailing content, and section headers. Low cost — the API already supports them.

## Finding 5 — Density and container/padding are exposed as variants (thin evidence)

**Confidence: high, but only two systems.** A compact-vs-comfortable density
toggle (MUI `dense`) and a container/edge-inset treatment (Primer ActionList
list-level `variant: 'inset' | 'horizontal-inset' | 'full'`) are real
precedents.

> Primer: "Inset children are offset (vertically and/or horizontally) from list
> edges; full children are flush with list edges." —
> [Primer ActionList](https://primer.style/product/components/action-list/)

Because this axis rests on only MUI + Primer, treat the container variant and
compact density as **nice-to-have**, not essential.

## Finding 6 — Synthesis: the variant set for Nimbus

**Confidence: medium (interpretive synthesis of Findings 1–5).**

| Axis                     | What it is                                                                      | Verdict                                              | React Aria support                                                                  |
| ------------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Size / density**       | size scale (committed) + compact vs comfortable                                 | **Essential** (size); nice-to-have (compact)         | You style rows; density = your tokens                                               |
| **Selection affordance** | `checkbox` vs `highlight` vs `checkmark`                                        | **Essential** — explicit prop, not derived from mode | optional `<SelectionIndicator />` + `[data-selected]`                               |
| **Rich item content**    | leading icon/avatar, label + description, trailing meta/action, section headers | **Essential**                                        | `<Text slot="label">`, `<Text slot="description">`, `<ListBoxSection>` + `<Header>` |
| **Container / padding**  | `plain` vs `bordered`/`card` (inset vs flush)                                   | **Nice-to-have**                                     | style wrapper, or delegate to Popover                                               |

React Aria makes label/description slots, `SelectionIndicator`, sections, and
every interactive state (`data-selected`, `data-focus-visible`, `data-disabled`,
…) easy to style with Chakra recipes. The hard parts are purely visual choices,
not wiring.

---

## Gaps in the research (be honest about what is NOT answered)

1. **Empty / loading / disabled visual states were not resolved.** Only the
   _existence_ of React Aria's `renderEmptyState` and `ListBoxLoadMoreItem` was
   confirmed; no system's actual visual treatment (skeleton rows, spinner
   placement, empty-state copy, dimmed disabled rows) survived verification. →
   Resolve against Nimbus's own Menu/Select/ComboBox before implementation.
2. **Density + container rest on only MUI + Primer.** Spectrum 2, Carbon, Fluent
   2, Material 3, Base UI, shadcn were scoped but yielded no _confirmed_ claims.
   Evidence skews to React Aria, Primer, Polaris, MUI.
3. **Source drift:** several URLs now 301-redirect (Polaris → shopify.dev,
   Primer product docs, the classic React Aria domain → react-aria.adobe.com).
   The contact-list example was verified against the `adobe/react-spectrum` repo
   (tag `tailwindcss-react-aria-components@1.2.0`) but is absent from the
   current Spectrum 2 examples index — treat as an illustrative-but-valid
   pattern.
4. One related W3C ARIA 1.1 combobox-wiring claim was **refuted 0–3**; its
   rejection does not affect any conclusion here (the React Aria composition
   claims stand on their own primary sources).

## Open questions that only Nimbus's own design language can answer

These are being resolved by inspecting the existing Nimbus components (results
folded into the OpenSpec proposal):

1. **Single-select inside Select/ComboBox — trailing checkmark or full-row
   highlight?** Both are documented across systems; pick whichever matches
   Nimbus's existing Menu/Select look.
2. **Does the bordered/card container belong on ListBox, or on the
   Select/ComboBox Popover wrapper?** Primer puts it on the list; React Aria
   styles the Popover separately.
3. **What do empty / loading / disabled rows look like in Nimbus?**

---

## Sources

Primary (verified quotes used above):

- React Aria Select — https://react-spectrum.adobe.com/react-aria/Select.html
- React Aria ComboBox docs —
  https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/docs/ComboBox.mdx
- React Aria Autocomplete —
  https://react-spectrum.adobe.com/react-aria/Autocomplete.html
- React Aria useComboBox —
  https://react-spectrum.adobe.com/react-aria/useComboBox.html
- React Aria useListBox — https://react-aria.adobe.com/ListBox/useListBox.html
- React Aria contact-list example —
  https://react-spectrum.adobe.com/react-aria/examples/contact-list.html
- React Aria styling (data attributes) —
  https://react-spectrum.adobe.com/react-aria/styling.html
- GitHub Primer ActionList (react) — https://primer.style/react/ActionList
- GitHub Primer ActionList (product) —
  https://primer.style/product/components/action-list/
- Shopify Polaris Option List —
  https://polaris-react.shopify.com/components/lists/option-list
- Material UI List — https://mui.com/material-ui/react-list/
- IBM Carbon Contained List —
  https://carbondesignsystem.com/components/contained-list/usage/
- Chakra UI slot recipes — https://chakra-ui.com/docs/theming/slot-recipes

Refuted (kept for the record, 0–3):

- W3C ARIA 1.1 combobox-with-listbox example —
  https://www.w3.org/TR/2018/NOTE-wai-aria-practices-1.1-20180726/examples/combobox/aria1.1pattern/listbox-combo.html

_Stats: 5 angles · 22 sources · 101 claims · 25 verified · 24 confirmed · 1
refuted · 104 agent calls._
