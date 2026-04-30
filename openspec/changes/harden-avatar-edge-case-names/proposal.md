# Proposal: Harden Avatar Against Missing/Edge-Case Names

## Why

`Avatar`'s `getInitials` helper crashes at runtime when `firstName` or
`lastName` is the empty string (`"".split("")[0]` is `undefined`, and
`undefined.toUpperCase()` throws). The Merchant Center has real user records
where one or both name fields are empty or missing, despite the current
TypeScript types declaring them as required strings — a mismatch between the
declared contract and observed reality.

PR [#1411](https://github.com/commercetools/nimbus/pull/1411) attempts to fix
this by switching `split("")[0]` to `charAt(0)`, which only addresses the
empty-string case. Whitespace-only names render an invisible blank avatar,
emoji/surrogate-pair names render broken half-glyphs, and `undefined`/`null`
inputs still crash. The component also has no graceful behavior when neither
name yields any usable initial — it just renders nothing.

This change locks down the full set of edge cases in spec form first, relaxes
the type contract to match reality, and adds a `Person` icon fallback so the
component always renders something meaningful.

## What Changes

- **BREAKING (type relaxation, minor in semver per consumer-safe convention):**
  `firstName` and `lastName` props become **optional** (`string | undefined`).
  Existing call sites that pass both still type-check; new call sites can omit
  either or both.
- New behavior: when neither `firstName` nor `lastName` yields a usable
  initial after trimming, render the `Person` icon from
  `@commercetools/nimbus-icons` instead of empty content.
- New behavior: initials extraction is **trim-aware** (leading/trailing
  whitespace is stripped before extracting the first character).
- New behavior: initials extraction is **Unicode codepoint-safe** (uses
  `Array.from(name)[0]` so emoji and astral-plane characters are not split
  mid-surrogate).
- New behavior: when only one of `firstName`/`lastName` yields a usable
  character, render that single initial (not two characters with one missing).
- New i18n key `avatarLabelGeneric` (default: `"User avatar"`) used as the
  `aria-label` and default `alt` when both names are missing.
- Existing `avatarLabel` key continues to be used when at least one name is
  present, but `fullName` is composed from non-empty trimmed parts only (no
  trailing/leading spaces).
- New `avatar.spec.tsx` unit-test file covering the initials helper across
  the full edge-case matrix (JSDOM, fast).
- Expanded `avatar.stories.tsx` with play functions covering each
  edge-case scenario in the rendered DOM.
- Documentation updates in `avatar.dev.mdx` and `avatar.a11y.mdx` covering
  the new fallback behavior and generic label.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `nimbus-avatar`: Multiple requirements change in `openspec/specs/nimbus-avatar/spec.md`:
  - **Initials Fallback** — extraction becomes trim-aware and codepoint-safe;
    handles missing/empty/whitespace input; supports single-initial output
    when only one name is usable.
  - **Required Name Props** scenario removed; replaced by **Optional Name
    Props** scenario.
  - **Type Safety > Required vs optional props** — `firstName` and
    `lastName` become optional.
  - **Alternative Text** and **ARIA Labels** — gracefully handle missing
    names; introduce generic label.
  - **Internationalization Support** — adds `avatarLabelGeneric` key.
  - **Name Composition** — composes from trimmed non-empty parts only.
  - **Conditional Rendering Logic** — adds icon-fallback path.
  - New requirement: **Person Icon Fallback** — render `Person` icon when no
    initials are derivable.

## Impact

- **Code:** `packages/nimbus/src/components/avatar/{avatar.tsx, avatar.types.ts, avatar.i18n.ts, avatar.messages.ts, avatar.recipe.ts, avatar.stories.tsx, avatar.spec.tsx (new), avatar.docs.spec.tsx, avatar.dev.mdx, avatar.a11y.mdx, intl/*}`
- **API:** `AvatarProps.firstName` and `AvatarProps.lastName` become
  optional. No removals, no renames, no behavioral regressions for callers
  that already pass both names.
- **Dependencies:** Adds runtime dependency on `Person` from
  `@commercetools/nimbus-icons` (already a workspace dependency of
  `@commercetools/nimbus`; no new package added).
- **i18n:** New `avatarLabelGeneric` key requires Transifex translations for
  `de`, `es`, `fr-FR`, `pt-BR` (English baseline ships with the change).
- **Release:** Minor semver bump via Changeset (relaxation + additive
  behavior).
- **Follow-up:** Close PR #1411 with a comment pointing at the merged
  change.
