## Context

Page-level navigation in ModalPage, MainPage, and DetailPage headers needs
tab-styled links. The existing `Tabs` component is a content-switching widget
that uses `role="tablist"`, `role="tab"`, and roving tabindex with arrow-key
cycling — semantics that are correct for in-page panel switching but actively
wrong for route-based navigation.

Pressing ArrowRight inside a `tablist` is expected to move focus and reveal
another panel. When the items are actually `<a>` links to different routes,
arrow keys move focus to elements that navigate to nothing (no panel exists),
which confuses keyboard and screen reader users. Bootstrap explicitly warns
against this pattern, and Material UI has an acknowledged open bug for the
same mistake in their "NavTabs" example.

## Approach

Introduce a **new component** `TabNav` rather than overloading `Tabs` with a
"link" mode. The two components are intentionally separate:

- `TabNav.Root` renders a `<nav>` landmark (via `withProvider("nav", "root")`)
  and registers a slot-recipe context keyed `nimbusTabNav`.
- `TabNav.Item` renders an `<a>` (via `withContext("a", "item")`) and wraps
  React Aria Components' `<Link>` using the `asChild` slot pattern for press
  and focus handling — consistent with the Nimbus `Link` component convention.
- Active state is signalled with `aria-current="page"` (not `aria-selected`).
- No roving tabindex, no arrow-key handlers: standard sequential Tab order.
- The slot recipe `tabNavSlotRecipe` is a **visual twin** of the Tabs `line`
  horizontal variant — same colors, spacing, underline indicator, focus ring —
  but lives in its own recipe file and is registered separately as
  `nimbusTabNav` in `slot-recipes/index.ts`. A comment in `tab-nav.recipe.ts`
  flags the visual coupling and the obligation to keep both recipes in sync.
- Size and variant tokens (`sm` / `md` / `lg`, `variant: "tabs"`) follow the
  same Tier 1 slot-recipe contract as other Nimbus compound components.

## Alternatives Considered

- **Extend `Tabs` with a `variant="nav"` or `as="a"` mode.** Rejected: it
  conflates two ARIA patterns into one component, makes it easy for consumers
  to pick the wrong semantics, and forces conditional branching of the
  keyboard model inside a single hook tree.
- **Re-style `Link` directly in page headers.** Rejected: there is no shared
  landmark, no active-state styling contract, and every consumer would
  duplicate the underline indicator and `aria-current` wiring.
- **Use `useLink` from `react-aria` directly inside `TabNav.Item`.** The
  proposal mentioned this; the implementation uses RAC `<Link>` via `asChild`
  instead, which composes identically with the slot recipe and matches the
  pattern already established by the Nimbus `Link` component.

## Risks / Trade-offs

- **Visual drift between `Tabs.line` and `TabNav.tabs`.** Two separate recipes
  means a styling change in one can silently desync the other. Mitigated by a
  prominent comment in `tab-nav.recipe.ts` and a shared design intent
  documented in both `*.mdx` files.
- **Consumer confusion: which component do I pick?** Two visually identical
  components with different semantics. Mitigated by `tab-nav.mdx` and
  `tab-nav.a11y.mdx` explicitly contrasting `TabNav` (route navigation) vs.
  `Tabs` (content panels), and by the page-header components (ModalPage,
  MainPage, DetailPage) consuming `TabNav` directly so consumers rarely pick
  manually.
- **No arrow-key navigation may surprise users coming from the Tabs pattern.**
  This is the *correct* behavior for links (browsers do not arrow-cycle
  anchors), and is asserted explicitly in the `KeyboardNavigation` story.
