# Design: Popover Compound Component Export

## Context

See `proposal.md` — Why. Two facts about the current code shape the approach,
both of which contradict the ticket's own description and are worth stating
plainly:

1. **`Popover` is not publicly exported.** `packages/nimbus/src/components/index.ts`
   has no `./popover` line. There is no public API to preserve, so the component
   can be reshaped from a callable into a namespace object freely.
2. **The internal consumers are ComboBox and LocalizedField — not Select.**
   Select already uses React Aria's `Popover` directly
   (`select/components/select.root.tsx:97`) and is untouched by this change.

The existing implementation is a ~15-line `withContext` wrapper over React
Aria's `Popover`, styled by a plain (non-slot) recipe registered at
`theme/recipes/index.ts:51`. Menu is the closest existing analogue — a trigger
plus a portaled surface — and Dialog is the closest React Aria analogue, since
both `Popover.Root` and `Dialog.Root` wrap `DialogTrigger`.

## Goals / Non-Goals

**Goals:**

- Land the three-part public surface with the styling, a11y and docs quality
  bar the rest of the library holds.
- Leave ComboBox and LocalizedField pixel-identical. This is the change's main
  risk and the main thing review should check.
- Follow Menu's and Dialog's established patterns rather than inventing a
  fourth way to build an overlay.

**Non-Goals:**

- Extending the parts contract beyond Root/Trigger/Content. Header, Body,
  Footer, CloseButton and Arrow are explicitly removed from the spec rather
  than deferred silently.
- Refactoring Select onto the shared component. It works, it is out of scope,
  and touching it would widen the blast radius for no benefit.
- Reworking ComboBox's or LocalizedField's own recipes beyond the minimum the
  migration requires.

## Decisions

### Root mounts no DOM element

`Popover.Root` renders `<PopoverRootSlot asChild><RaDialogTrigger>`, following
`Menu.Root` (`menu/components/menu.root.tsx`). `RaDialogTrigger` renders no DOM
of its own, so `asChild` leaves nothing behind: the slot contributes recipe
context but no element.

*Alternative considered:* `Dialog.Root`'s pattern, which renders
`<DialogRootSlot>{children}</DialogRootSlot>` — a real `<div>`. Rejected
because a block-level wrapper around a trigger is a layout hazard for inline
triggers (an icon button inside a flex row or a sentence of text). Dialog gets
away with it because its trigger is typically a standalone button.

`withProvider` still installs the slot-recipe context, and React context
crosses portals, so `Popover.Content` receives styling context even though it
renders at the document root.

*Naming note:* the compound-components guideline says a part that mounts no DOM
should be named `.Provider`, not `.Root`. We keep `.Root` because the ticket
specifies it and because `Menu.Root` and `Dialog.Root` both already wrap
DOM-less React Aria trigger components. Consistency with sibling components
wins over a literal reading of the rule.

### Content owns the React Aria Dialog

`Popover.Content` renders
`<PopoverContentSlot asChild><RaPopover><PopoverDialogSlot asChild><RaDialog>`.

React Aria requires a `Dialog` inside a `Popover` under `DialogTrigger` to get
`role="dialog"`, accessible naming and Escape handling. Making that the
component's job rather than the consumer's means it cannot be gotten wrong, and
it mirrors how `Menu.Content` nests `<Popover><Menu>` rather than asking
consumers to assemble the pair.

*Alternative considered:* expose the bare surface and let consumers add
`<Dialog>`. Rejected — it makes the a11y contract opt-in, and the one existing
consumer that hand-rolls it (LocalizedField) is evidence of the boilerplate.

*Trade-off:* consumers cannot omit the dialog element. Accepted; if a
surface-only use case appears, an escape hatch can be added without breaking
the parts contract.

### Focus model follows React Aria's default, with `isNonModal` as the opt-out

The old spec required the popover to be non-modal: background interactive,
focus never contained. That is **not** what React Aria does. A `Popover` under
a `DialogTrigger` contains keyboard focus and blocks outside pointer
interaction unless `isNonModal` is passed — which is precisely why ComboBox
passes it explicitly today (`combobox.popover.tsx`). The old spec also cited a
`shouldCloseOnBlur` prop that does not exist in React Aria Components.

We keep React Aria's default and expose `isNonModal` on `Popover.Content`.

*Decisive argument:* LocalizedField currently renders `<Popover>` with no
`isNonModal`, so it gets the contained-focus default today. Defaulting
`Content` to non-modal would silently change that consumer's behavior, which
this change is explicitly required not to do. Preserving the default preserves
the consumer.

The spec's `Non-Modal Focus Behavior` requirement is therefore removed and
replaced by `Focus Management`, which states the real default and the opt-out.
The main spec's Overview and Purpose prose needs the same correction.

### Content accepts a function child for programmatic close

Because `Content` owns the `Dialog`, consumers lose direct access to React
Aria's `Dialog` render prop — the idiomatic way for content to dismiss its own
overlay. `Popover.Content` therefore forwards a function child through to the
dialog, so `{({ close }) => …}` keeps working.

This is the one cost of owning the Dialog, and it is cheap to pay back. Without
it, the only way to close from inside would be controlled mode, which is a lot
of ceremony for a "Cancel" button.

### No `aria-haspopup` on the trigger

The old spec required `aria-haspopup="dialog"`. React Aria does not set it, and
that is deliberate — `useOverlayTrigger` only sets it for `menu` and `listbox`,
with the source comment: *"we only add it for menus for now because screen
readers often announce it as a menu even for other values."*

We follow React Aria rather than forcing the attribute. Overriding a considered
accessibility decision from the library that owns the pattern would likely make
screen reader announcements worse, not better. What the trigger does expose —
verified against the rendered DOM — is `aria-expanded` always, and
`aria-controls` while open.

### Slot recipe replaces the plain recipe

`nimbusPopover` moves from `theme/recipes/index.ts` to
`theme/slot-recipes/index.ts` with slots `root`, `trigger`, `content`,
`dialog`. The `content` slot carries what the old flat base carried, with
`bg: "white"` replaced by the semantic `bg` token — matching Menu
(`menu.recipe.tsx:31`) and Dialog — and with Menu's `&[data-entering]` /
`&[data-exiting]` fade+scale animations lifted across for consistency.

A compound component with three styleable parts needs per-slot styling; a flat
recipe cannot express it. The key stays `nimbusPopover` so nothing else has to
be renamed.

### Both consumers drop to React Aria's Popover

The migration is symmetric: both consumers already override the shared surface
completely, so neither gains anything by routing through the new component.

**ComboBox** already overrides everything the shared recipe provides. Its own
`popover` slot re-declares `bg`, `borderRadius`, `boxShadow` and `padding: 0`
(`combobox/combobox.recipe.ts:138-145`). The only property it actually inherits
is `zIndex: 1`. So the shared component is a styling layer that contributes one
declaration — and it stops making sense once that recipe becomes slot-based.
ComboBox therefore uses React Aria's `Popover` directly, exactly as Select
does, and `zIndex: 1` is added explicitly to its `popover` slot. Net effect:
one less layer, identical computed styles.

**LocalizedField** turns out to be the same story, not the exception. An
earlier draft of this design claimed it "genuinely wants the shared surface"
based on its call site (`<Popover padding={0}>`). Reading its recipe disproved
that: the `infoDialog` slot (`localized-field.recipe.ts:51-63`) re-declares the
whole surface on the **inner** dialog — `bg: neutral.1`, `borderRadius: 200`,
`boxShadow: 6`, `border`, `maxHeight`, `overflow`, `focusRing: outside`. What it
actually inherits from the shared recipe is a `boxShadow: 5` on the outer box
(visible, stacked under the inner shadow), `zIndex: 1`, and a background and
radius that are hidden behind the padding-zero inner dialog.

Migrating it to `Popover.Content` is also blocked outright: now that `Content`
owns the `RaDialog`, there is no way to apply `LocalizedFieldInfoDialogSlot` to
the dialog element via `asChild`. Moving those styles to an inner `div` would
put `focusRing: outside` on a non-focusable element and lose the dialog's focus
ring — an accessibility regression, not a refactor.

So LocalizedField drops to raw React Aria too, symmetric with ComboBox, and
gains an `infoPopover` slot on its own recipe carrying exactly what it
previously inherited (`bg`, `borderRadius: 200`, `boxShadow: 5`, `zIndex: 1`).
That keeps it pixel-identical while decoupling it entirely.

*Consequence:* the new public `Popover` ships with **zero** internal consumers.
That is deliberate. Both existing consumers fully override the shared surface,
so routing them through a brand-new public API would couple them to it for no
styling benefit.

*Noted for a separate ticket:* the stacked `boxShadow: 5` + `boxShadow: 6` on
LocalizedField's info popover looks like a latent bug rather than intent. We
replicate it here to hold the pixel-identical guarantee; changing it is a
visual decision that deserves its own change.

*Alternative considered:* keep a shared internal surface primitive for both.
Rejected — it would exist solely to serve ComboBox's single inherited `zIndex`
declaration, and an explicit token in ComboBox's own recipe is clearer than an
inherited one from a component it otherwise fully overrides.

### Docs match Dialog, minus Code Connect and i18n

Full set: `.mdx`, `.dev.mdx`, `.a11y.mdx`, `.guidelines.mdx`,
`.docs.spec.tsx`, `.stories.tsx`. Pages are discovered from mdx frontmatter, so
there is no route registry to touch; the component is filed under
`Components > Feedback` alongside Tooltip, Dialog and Drawer, at
`lifecycleState: Beta` as a new export.

`popover.figma.tsx` is omitted because Code Connect needs a real Figma node to
map to. No i18n file: the three-part surface has no component-owned string.

## Risks / Trade-offs

- **ComboBox dropdown regresses visually or in stacking order** → Its slot
  already re-declares every inherited property except `zIndex`, which is
  restored explicitly. Verified by ComboBox's existing story suite plus
  Chromatic. This is the single highest-risk edit in the change; if a diff
  appears, the fix is a token on ComboBox's own slot, not a revert of the
  recipe migration.
- **LocalizedField's info popover loses its dialog styling** → Its
  `LocalizedFieldInfoDialogSlot` moves rather than disappears; its existing
  play functions cover open/close, and Chromatic covers the frame.
- **Slot-recipe context does not reach portaled content** → React context
  crosses portals, and Menu already relies on this exact arrangement. If it
  fails it fails loudly and immediately in the first story.
- **`.Root` naming conflicts with the DOM-less `.Provider` guideline** →
  Accepted deliberately; documented in Decisions so the next reader does not
  file it as a bug. Sibling precedent (Menu, Dialog) is the tiebreaker.
- **Removing eight spec requirements looks like scope loss** → All eight
  described unimplemented behavior. Each removal carries a Reason and a
  Migration note, so the record shows they were retired knowingly rather than
  dropped.
- **The focus-model correction surprises someone reading the old spec** → The
  removal note on `Non-Modal Focus Behavior` states the contradiction and names
  `isNonModal` as the opt-out, and the docs page will say which model applies.
  Worth flagging in PR review, since it is the one place this change
  contradicts previously written intent rather than merely narrowing it.

## Migration Plan

Single PR, no phased rollout — the component is unreleased and the two
consumers are in-repo.

Order matters for keeping the tree green:

1. Recipe and slots first (slot recipe + theme re-registration), since
   everything else depends on the slot keys existing.
2. Parts, then the namespace and the public export.
3. Consumer migration last, so the new surface exists before anything switches
   to it.
4. Stories, docs, spec narrowing, changeset.

Verification gates: `pnpm --filter @commercetools/nimbus typecheck:dev` while
iterating, then `pnpm test:dev` for the popover, combobox and localized-field
suites, then a build plus `pnpm typecheck:strict` before pushing. Chromatic on
the PR is the visual gate for the two migrated consumers.

Rollback is `git revert` of the single commit range; nothing is published mid-
change and no consumer outside the repo can depend on the new export until a
release ships.
