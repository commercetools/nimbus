# Proposal: Correct the Popover Optimized Rendering requirement

## Why

Rewrite the `Optimized Rendering` requirement in the `nimbus-popover` capability
so it describes observable Popover behavior instead of React Aria internals and
a configuration option that does not exist.

### Background

`popover-compound-export` narrowed this capability from an eight-part
aspirational surface to the three parts actually built, and corrected the
requirements it touched. `Optimized Rendering` was not among them, so its
`Scroll optimization` scenario still specifies two things the component cannot
be held to:

- **`SHALL use requestAnimationFrame for positioning updates`** — an assertion
  about React Aria's internals. Nimbus neither implements nor tests it, and it
  would silently become false if React Aria changed its scheduling.
- **`MAY close popover on scroll if configured`** — there is no such option.
  `Popover.Content` forwards `placement`, `offset`, `crossOffset`, `shouldFlip`,
  `containerPadding`, `boundaryElement`, `isNonModal`,
  `isKeyboardDismissDisabled`, `shouldCloseOnInteractOutside` and `triggerRef`,
  and none of them dismisses on scroll.

Both are the same class of inaccuracy as the `portalContainer` and
`trigger="hover"` scenarios corrected in the previous change, and they were left
behind only because that change's scope did not reach this requirement.

## What Changes

Keep both scenario names and restate their bodies against what the component
actually does:

- `Lazy mounting` is accurate and stays, worded against the overlay content
  rather than "content in DOM".
- `Scroll optimization` becomes a statement about the observable outcome — the
  popover stays anchored to its trigger and within the viewport while the page
  moves — and records that no scroll-dismissal option is exposed.

## Scope

- **In scope**: the `Optimized Rendering` requirement of `nimbus-popover`.
- **Out of scope**: any implementation change. This corrects the specification
  to match shipped behavior; no source file changes.

## Impact

- **Breaking changes**: None
- **Migration required**: None
- **Dependencies**: None
