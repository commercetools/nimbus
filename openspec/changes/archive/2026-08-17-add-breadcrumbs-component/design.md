## Context

Nimbus needs a breadcrumb navigation component. React Aria Components ships `Breadcrumbs` and
`Breadcrumb` primitives, and Nimbus's `architecture-decisions.md` requires using the RAC
primitive when one exists (as `Tabs` does). This design describes how to build the Nimbus
`Breadcrumbs` component on those primitives with the design system's recipe/slot styling.

Relevant RAC behavior, verified against the installed bundle (`react-aria-components@1.19.0`,
`dist/private/Breadcrumbs.mjs:61-91`):

- `Breadcrumb` derives the current item as the last collection node: `isCurrent = node.nextKey == null`.
- It publishes `{ 'aria-current': isCurrent ? 'page' : null, isDisabled: isDisabled || isCurrent,
  onPress }` to the child `Link` via `LinkContext`. A disabled RAC `Link` renders a non-focusable
  `<span role="link">`, so the current item is out of the tab order automatically.
- It sets `data-current` / `data-disabled` on the `<li>` for styling and supports `onAction(key)`.
- `Breadcrumbs` accepts a static children collection **or** a dynamic `items` + render function
  (it extends `CollectionProps<T>`) and exposes `onAction`.

Constraints: strict TypeScript (no `any`); Chakra recipes + tokens only; component tests live in
Storybook play functions run against the built bundle.

## Goals / Non-Goals

**Goals:**

- Build `Breadcrumbs` on RAC `Breadcrumbs`/`Breadcrumb`, styled with the Nimbus recipe/slot system.
- Automatic last-is-current model — no `isCurrent` prop.
- Both a compound (`Breadcrumbs.Root`/`Breadcrumbs.Item`) and a declarative `items` authoring API.
- Correct list semantics under `list-style:none` (Safari/VoiceOver).
- Typed `onAction`/`routerOptions` for router integration.
- Public `separator` (default `›`, decorative) and `size` (`sm`/`md`) surface.

**Non-Goals:**

- Overflow/collapse ("Home / … / Current") truncation — tracked as follow-up.
- RTL separator-glyph mirroring — tracked as follow-up (documented caveat only).
- Any change to sibling components; no new npm dependency.

## Decisions

**D1 — `Root` on RAC `Breadcrumbs`, `Item` on RAC `Breadcrumb` + `Link`.**
`Breadcrumbs.Root` renders `RaBreadcrumbs` (the `<ol>`), styled via the `withProvider` root/list
slots. `Breadcrumbs.Item` renders `RaBreadcrumb` (the `<li>`) containing a `RaLink` styled via the
link slot (`asChild`). RAC owns current/disabled/`aria-current`/tab-order.
_Alternative considered:_ hand-roll the nav/ol/li structure and only use RAC for the link.
Rejected — it duplicates what RAC provides and diverges from the architecture decision; RAC's
current-item handling (non-focusable, `aria-current`) works out of the box.

**D2 — No `isCurrent` prop; current = last item.**
RAC ties current strictly to the last collection node. Deriving currentness from position (rather
than a consumer-set flag) removes the entire class of invalid states (zero, multiple, or
misplaced current) by construction.
_Alternative considered:_ an explicit `isCurrent` override — rejected as it fights RAC's model and
reintroduces those invalid states.

**D3 — Dual authoring API.**
Expose `items` + render function (native to RAC collections) alongside compound children,
mirroring `Tabs`. Nav semantics and last-is-current apply identically in both paths.

**D4 — Separator via a Nimbus slot.**
Render the decorative separator (`aria-hidden`) as a Nimbus separator slot between items, hiding
the leading one via a `:first-of-type` recipe rule (robust for dynamic collections). Default `›`.
Source the separator through RAC's provided context/render mechanism so both authoring APIs share
one code path.
_Alternative considered:_ CSS `::before content` — rejected because an arbitrary configurable
ReactNode (e.g. an icon) can't be expressed purely in `content`.

**D5 — Explicit `role="list"` on the `<ol>`.**
WebKit strips list semantics under `list-style:none`. Apply `role="list"` to the list slot unless
RAC already emits it. Assert the attribute in a story (the Chromium test runner won't reproduce the
WebKit-specific loss, so assert at the DOM-attribute level).

**D6 — Dev-time warning for missing `aria-label`; no default string.**
Keep the component free of translatable strings (correct i18n posture — the consumer owns the
landmark label). Instead of a hardcoded default, warn in development when `aria-label` is absent.

## Risks / Trade-offs

- [Separator composition differs between compound and `items` APIs] → Mitigation: centralize
  separator rendering in the `Item`/slot layer so both paths share one code path; cover both in
  stories.
- [WebKit list-role loss not reproducible in the Chromium story runner] → Mitigation: assert the
  `role="list"` attribute directly rather than relying on the AX tree; note the limitation.
- [RAC `Link` uses `onPress`, not `onClick`] → Mitigation: type the public item API against the RAC
  link options (like `Link` does) so router/handler props are typed and discoverable.
- [Recipe styling depends on RAC-managed `data-current`/`data-disabled`] → Mitigation: target those
  attributes in `breadcrumbs.recipe.ts` and document that RAC sets them.

## Open Questions

- Does RAC `Breadcrumbs` already emit `role="list"` on its `<ol>` in 1.19.0? Confirm during
  implementation; apply the explicit role only if absent (D5).
- Final shape of the `items` render API — element-per-item vs. object-with-fields — to be settled
  against RAC's `CollectionProps` ergonomics and `Tabs`' precedent during implementation.
