# Derivatives Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Compound Components](./compound-components.md) |
[Next: Component vs Pattern →](./component-vs-pattern.md)

## Purpose

A **derivative** is a component that presents a constrained or widened form of
another component, lives inside that parent's directory under `derivatives/`, and
is exported through the parent's barrel. `RangeSlider` is a derivative of
`Slider`; `SkeletonText` and `SkeletonCircle` are derivatives of `Skeleton`.

This organisation keeps a family of closely related components together in the
source tree while still giving each one its own documentation page, stories, and
top-level export.

> **Note on provenance.** The `derivatives/` layout was introduced for the
> Skeleton and Slider families, and the commits that introduced it
> (`18a83e282`, `df66146d8`) record it as a deliberate departure from the
> repo's one-directory-per-nav-entry convention, with "no prior precedent". The
> criterion below was formalized afterwards, from those existing cases — it is a
> written statement of the practice, not a rule the original families were built
> against.

## Choosing: Derivative, Sibling, or Compound Part?

Three shapes are easy to confuse. The distinction is not "does it reuse another
component's implementation" — several **siblings** do exactly that.

### Derivative vs. sibling component

> A **derivative** introduces no new state and no new interaction. It constrains
> or widens the parent's existing API — a fixed prop value, or a value type with
> greater arity — and reuses the parent's implementation rather than adding to
> it.
>
> A **sibling component** introduces new state, a new interaction, or a distinct
> visual or semantic contract, even when it composes another component
> internally.

Checked against every case in the codebase:

| Component | Relationship to | What it does | Verdict |
| --- | --- | --- | --- |
| `SkeletonCircle` | `Skeleton` | Renders `<Skeleton shape="circle">` — one prop fixed | Derivative |
| `SkeletonText` | `Skeleton` | Composes N Skeleton lines; no new state or interaction | Derivative |
| `RangeSlider` | `Slider` | Same drag interaction, value widened from `number` to a tuple | Derivative |
| `IconButton` | `Button` | Icon-only square visual contract; `aria-label` obligatory | Sibling |
| `PasswordInput` | `TextInput` | Adds reveal/hide state and a toggle interaction | Sibling |

**Why "reuses the parent" is not the test.** `IconButton` wraps `Button`
(`icon-button.tsx:9`) and has no recipe of its own; `PasswordInput` wraps
`TextInput` (`password-input.tsx:3`) and likewise has no recipe. Both are
top-level siblings. Composition alone tells you nothing.

**`RangeSlider` is the borderline case**, and it is worth understanding why it
still counts. It does require something `Slider` does not: each thumb needs its
own accessible name via `thumbLabels` (`range-slider.tsx:14-18`). But that
obligation follows mechanically from having two values rather than one — it is a
consequence of the widened arity, not a new behaviour. The interaction is the
same drag, and no new state is introduced. Contrast `PasswordInput`, where the
reveal toggle is genuinely new state that has nothing to do with `TextInput`'s
value.

If you are undecided, prefer a **sibling**. A sibling can always be moved into
`derivatives/` later; promoting a derivative out is the more disruptive change
because its documentation route moves with it.

### Derivative vs. compound part

A compound part (`components/{component}.{part}.tsx`) is **never exported
independently** — it exists only as a static property of its parent, as
`Menu.Root` or `Dialog.Title`. A derivative *is* independently importable:
consumers write `import { RangeSlider } from "@commercetools/nimbus"`. If the
thing you are building has no meaning outside its parent, it is a compound part;
see [Compound Components](./compound-components.md).

## Directory Structure

```
components/
├── slider/
│   ├── slider.tsx
│   ├── slider-base.tsx              # shared implementation
│   ├── slider.types.ts
│   ├── slider.recipe.ts
│   ├── slider.mdx
│   ├── derivatives/
│   │   └── range-slider/
│   │       ├── range-slider.tsx        # composes the parent
│   │       ├── range-slider.types.ts
│   │       ├── range-slider.stories.tsx
│   │       ├── range-slider.mdx
│   │       ├── range-slider.guidelines.mdx
│   │       ├── range-slider.dev.mdx
│   │       ├── range-slider.a11y.mdx
│   │       ├── range-slider.docs.spec.tsx
│   │       └── index.ts
│   └── index.ts                     # re-exports the derivative
```

A derivative gets the **same file set as any component, minus the recipe** — it
takes styling from the parent. Naming inside the folder follows
[Naming Conventions](../naming-conventions.md) exactly; there is no special
derivative spelling.

## Implementation

### Compose the parent through a deep import

Import the parent's implementation file directly, never its barrel. This is the
repo-wide cross-chunk import rule (see `packages/nimbus/CLAUDE.md`), and it
matters more here than usual because parent and derivative are in the same
dependency neighbourhood — going through `index.ts` risks a circular chunk.

```tsx
// derivatives/range-slider/range-slider.tsx
import { SliderBase } from "../../slider-base";
import type { SliderBaseProps } from "../../slider.types";
import type { RangeSliderProps } from "./range-slider.types";

export const RangeSlider = (props: RangeSliderProps) => {
  // SliderBaseProps intentionally widens value/onChange to `number | number[]`
  // so the shared implementation can serve both Slider and RangeSlider; the
  // cast narrows back since RangeSliderProps only ever supplies the tuple arm.
  return <SliderBase {...(props as SliderBaseProps)} />;
};
```

```tsx
// derivatives/skeleton-circle/skeleton-circle.tsx
import { Skeleton } from "../../skeleton";

// Sugar over `Skeleton` with `shape="circle"`.
```

Where a parent serves several family members, factor the shared implementation
into its own file — `slider-base.tsx` — rather than having the derivative import
the parent's public component. Skeleton's derivatives do import `Skeleton`
itself, which is fine when the parent is simple enough to be its own base.

### No recipe of its own

Derivatives do not define a recipe and are not registered in
`src/theme/recipes/index.ts` or `src/theme/slot-recipes/index.ts`. Styling comes
from the parent. If a derivative needs its own recipe, that is a strong signal it
is really a sibling.

### Export through the parent's barrel

The derivative's own `index.ts` re-exports its component and props:

```ts
// derivatives/range-slider/index.ts
export { RangeSlider } from "./range-slider";
export type { RangeSliderProps } from "./range-slider.types";
```

The **parent's** `index.ts` then re-exports it, under a comment marking the
section:

```ts
// slider/index.ts
export { Slider } from "./slider";
export type { SliderProps } from "./slider.types";

// Derivatives — spin-offs built on the base Slider, each self-contained under
// `derivatives/`.
export { RangeSlider } from "./derivatives/range-slider";
export type { RangeSliderProps } from "./derivatives/range-slider";
```

A derivative never gets its own line in `src/components/index.ts`; it rides the
parent's `export *`. The resulting public surface is identical in shape to a
sibling's — `RangeSlider` is a named export of `@commercetools/nimbus` either
way — which is why the export path cannot be used to tell the two apart.

## Tooling: No Special Cases

Nothing in the build or docs pipeline knows about `derivatives/`. Every mechanism
that picks the folder up does so through a generic recursive glob:

- **Docs.** Discovery is a recursive filesystem walk, and nav placement comes
  from each `.mdx` file's own `menu` frontmatter — so a derivative appears
  wherever its frontmatter says, independent of where it sits on disk.
- **Type tables.** Resolved by exported identifier from
  `packages/nimbus/src/index.ts`, never by path.
- **Storybook.** `stories: ["../src/**/*.stories.tsx"]` picks up the derivative's
  stories with no extra configuration.
- **TypeScript.** No `include`/`exclude` names the folder.
- **Package exports.** `packages/nimbus/package.json` exposes only the root
  barrel and `./theme`, so a derivative is never separately importable by
  subpath.

One incidental benefit: because derivative folder names (`range-slider`,
`skeleton-text`, `skeleton-circle`) are unique across the tree, each gets a
correctly named build entry. Folder names that repeat across components —
`hooks`, `utils`, `constants`, `components` — collide in the entry map and are
silently merged. Keep derivative folder names distinctive.

## Documentation Expectations

A derivative is documented as its own component, with the full set of MDX files.
`range-slider` has all four (`.mdx`, `.guidelines.mdx`, `.dev.mdx`, `.a11y.mdx`).

`skeleton-text` and `skeleton-circle` currently have only `.mdx` and `.dev.mdx`,
mirroring a gap in their parent rather than a rule — see
[Accessibility Docs](./accessibility-docs.md) and
[Design Guidelines](./design-guidelines-docs.md) for the coverage lists. New
derivatives should not copy that gap.

Because a derivative's documentation is separate, say plainly in its Overview how
it relates to the parent and when to reach for one over the other. A reader who
lands on the derivative's page may never see the parent's.

## Related Guidelines

- [Compound Components](./compound-components.md) — parts that are not
  independently exported
- [Component vs Pattern](./component-vs-pattern.md) — the other structural
  decision
- [Naming Conventions](../naming-conventions.md) — authoritative for filenames
- [Main Component](./main-component.md) — cross-component import rules
- [Recipes](./recipes.md) — why a derivative has none

## Validation Checklist

- [ ] The component introduces no new state and no new interaction — otherwise
      make it a sibling
- [ ] Lives at `components/{parent}/derivatives/{derivative-name}/`
- [ ] Folder name is kebab-case and unique across the component tree
- [ ] Composes the parent via a deep import to an implementation file, never
      through the parent's `index.ts`
- [ ] No recipe of its own, and no entry in either theme recipe registry
- [ ] Own `index.ts` exporting the component and its props type
- [ ] Re-exported from the parent's `index.ts` under a `// Derivatives` comment
- [ ] **No** entry added to `src/components/index.ts`
- [ ] Full file set present: `.tsx`, `.types.ts`, `.stories.tsx`, `.mdx`,
      `.guidelines.mdx`, `.dev.mdx`, `.a11y.mdx`, `.docs.spec.tsx`, `index.ts`
- [ ] Each `.mdx` has `menu` frontmatter placing it correctly in the nav
- [ ] Overview explains the relationship to the parent and when to choose which

---
