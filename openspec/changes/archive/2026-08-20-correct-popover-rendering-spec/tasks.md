# Tasks: Correct the Popover Optimized Rendering requirement

- [x] Task 1: Rewrite the `Optimized Rendering` requirement as a delta
- [x] Task 2: Validate and archive

---

## Task 1: Rewrite the `Optimized Rendering` requirement as a delta

**File:**
`openspec/changes/correct-popover-rendering-spec/specs/nimbus-popover/spec.md`

- Restate `Lazy mounting` against the overlay content.
- Replace the `Scroll optimization` body: drop the `requestAnimationFrame`
  claim and the non-existent scroll-dismissal option, and state the observable
  anchoring behavior instead.
- Keep both scenario names, since a MODIFIED requirement may not drop scenarios
  the current spec still has.

**Validation:**

- `pnpm exec openspec validate correct-popover-rendering-spec --strict` clean

## Task 2: Validate and archive

- Archive so the delta applies to `openspec/specs/nimbus-popover/spec.md`.

**Validation:**

- `openspec/specs/nimbus-popover/spec.md` no longer mentions
  `requestAnimationFrame` or closing on scroll
- No source or test files change
