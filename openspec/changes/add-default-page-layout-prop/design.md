# Design: DefaultPage Layout Prop

## Context

The DefaultPage component supports two fundamentally different layout behaviors:

1. **Constrained**: The page fills its parent's height. The CSS grid
   (`auto 1fr auto`) means header and footer are naturally pinned — only the
   content area (the `1fr` row) scrolls. `position: sticky` is irrelevant here
   because header/footer never leave the viewport.

2. **Flexible**: The page grows with its content (no height constraint). The
   entire page scrolls as one unit. To pin header or footer, `position: sticky`
   is required.

Currently, both modes are possible but the distinction is implicit: consumers
override `height` via style props and toggle `stickyHeader`/`stickyFooter` —
but those sticky props only work in flexible mode. There is no type-level
enforcement or documentation of this relationship.

## Goals / Non-Goals

**Goals:**

- Make the two layout modes an explicit, named API concept
- Use TypeScript discriminated unions to prevent invalid prop combinations
- Keep the recipe-based styling approach (no JavaScript layout logic)
- Document both modes clearly with stories and dev docs

**Non-Goals:**

- Automatic detection of parent height constraints
- JavaScript-based scroll management
- New sub-components or structural changes

## Decisions

### Discriminated Union for Type Safety

The `DefaultPageProps` type uses a discriminated union on the `layout` prop:

```typescript
type DefaultPageProps =
  | {
      /** Constrained layout fills parent height. Content area scrolls
       *  independently. Header and footer are always pinned by the grid. */
      layout?: "constrained";
    }
  | {
      /** Flexible layout grows with content. The whole page scrolls.
       *  Use stickyHeader/stickyFooter to pin header or footer. */
      layout: "flexible";
      /** Pin the header at the top while the page scrolls */
      stickyHeader?: boolean;
      /** Pin the footer at the bottom while the page scrolls */
      stickyFooter?: boolean;
    };
```

This makes invalid states unrepresentable:
- `<DefaultPage.Root stickyHeader />` → TypeScript error
- `<DefaultPage.Root layout="constrained" stickyHeader />` → TypeScript error
- `<DefaultPage.Root layout="flexible" stickyHeader />` → valid

### Recipe Variant Structure

The recipe gains a `layout` compound variant:

- `layout: "constrained"` (default): `height: 100%` on root, `overflow: auto`
  on content
- `layout: "flexible"`: `height: auto` on root, no overflow on content

The `stickyHeader` and `stickyFooter` variants remain as boolean variants in the
recipe (CSS has no discriminated unions). The TypeScript types enforce the valid
combinations; the recipe simply applies styles when the variant is present.

### Default Behavior Preserved

`layout` defaults to `"constrained"`, preserving current behavior. Existing
usage without the `layout` prop continues to work identically — height fills
parent, content scrolls.

## Risks / Trade-offs

- **Recipe variants are not gated by layout at the CSS level** — The recipe
  will apply `position: sticky` if `stickyHeader` is passed regardless of
  `layout`. The TypeScript types are the enforcement layer. This is acceptable
  because recipe variants are always set programmatically via the component, not
  by consumers directly.
- **Discriminated unions can produce less readable error messages** — When a
  consumer passes `stickyHeader` without `layout="flexible"`, the error
  message references the union branches rather than stating "stickyHeader
  requires layout='flexible'". This is a known TypeScript ergonomics trade-off.
  JSDoc on the type helps clarify intent.
