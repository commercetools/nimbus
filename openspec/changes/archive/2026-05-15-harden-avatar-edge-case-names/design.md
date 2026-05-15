## Context

`Avatar` currently derives initials with
`firstName.split("")[0].toUpperCase() + lastName.split("")[0].toUpperCase()`.
This crashes when either name is the empty string (because
`"".split("")[0]` is `undefined`), and produces malformed output for
whitespace-only strings, leading whitespace, and astral-plane Unicode (emoji).
The TypeScript types declare both name props as required strings, but the
Merchant Center has user records where one or both fields are empty/missing.

PR #1411 narrows the crash to "empty string" via `charAt(0)`, but does not
address the type mismatch, the whitespace cases, the Unicode cases, or what
should be rendered when no usable initial exists.

The component is Tier 1 (single slot, no React Aria) and renders inside a
`<figure>` element. Its only translatable string today is
`avatarLabel` ("Avatar image for {fullName}").

## Goals / Non-Goals

**Goals:**

- Spec then implement defensive behavior for missing/empty/whitespace/Unicode
  name inputs without crashing.
- Provide a meaningful visual fallback (`Person` icon) when no initial can be
  derived, so the avatar is never blank.
- Align the type contract with observed reality (names are sometimes
  missing).
- Provide a localized generic `aria-label` and `alt` when no name is
  present.

**Non-Goals:**

- Auto-detecting cultural name conventions (mononyms, family-name-first
  ordering, hyphenated compound names). Initials are still
  "first codepoint of each provided name field", just defensively extracted.
- Image preloading, skeleton states, or animated transitions between image
  and initials.
- Splitting the component into `Avatar.Image` / `Avatar.Initials` /
  `Avatar.Icon` compound parts.
- Locale-aware case folding (`toLocaleUpperCase`). We retain
  locale-independent `toUpperCase()` to keep output deterministic across
  locales; a follow-up can revisit if specific scripts need it.

## Decisions

### Decision 1: Use `Array.from(name.trim())[0]` for codepoint-safe extraction

**Choice:** Replace `charAt(0)` / `split("")[0]` with
`Array.from((name ?? "").trim())[0]`.

**Rationale:** `String#charAt` and `String#split("")` both index UTF-16 code
units, so an emoji like `"👨"` (a surrogate pair) yields a lone surrogate
code unit and renders as a broken glyph. `Array.from(string)` iterates by
Unicode codepoints (per the spec's string iterator), giving the full
codepoint as a string slice. The `?? ""` defensively coalesces
`undefined`/`null`. The `.trim()` discards leading/trailing whitespace so
`" John"` produces `"J"` rather than `" "`.

**Alternatives considered:**

- `Intl.Segmenter` with `granularity: "grapheme"` — handles complex
  graphemes (e.g. emoji ZWJ sequences like 👨‍👩‍👧). Rejected for now to keep
  output bundle slim and behavior simple; `Array.from` covers the common
  emoji case without a polyfill. Can revisit if real data demands it.
- A regex like `/^./u` — equivalent to `Array.from`, but less explicit
  about intent. Rejected for readability.

### Decision 2: Render `<Person />` icon (not text glyph) when no initials

**Choice:** When neither name yields a non-empty trimmed character, render
`<Person />` from `@commercetools/nimbus-icons` inside the avatar slot,
sized to fit (`width: 60%; height: 60%` if a tweak is needed).

**Rationale:** The Person icon is a familiar, recognizable visual identity
glyph that fits the existing "user identity" semantic of the component. It
inherits `currentColor` from the slot, so it picks up the recipe's
`colorPalette.11` automatically and respects `colorPalette` prop overrides.
Using a `?` glyph or empty content was rejected for poor UX. Using a
custom-drawn shape inside the recipe was rejected because it forks the icon
language used elsewhere in Nimbus.

**Alternatives considered:**

- `<AccountCircle />` — Material's filled-circle variant, but it
  visually clashes with the avatar's existing background circle.
- A consumer-supplied `fallback` prop for arbitrary content — rejected as
  YAGNI; we can add this in a follow-up if real consumers need it. Right
  now, exactly one fallback is needed (Person icon), so we hard-code it.
- Passing through to existing `children` override — rejected because we
  want a default that works with zero consumer effort.

### Decision 3: Make `firstName` and `lastName` optional, no runtime guard required

**Choice:** Change types to `firstName?: string`, `lastName?: string`. Do
not add a runtime "if not provided, throw" — the new fallback path handles
all undefined/empty cases.

**Rationale:** Aligns the type contract with observed reality. Consumers
already pass `undefined` (just hidden by TypeScript loopholes); making the
type honest means TS catches the case at the call site and forces conscious
handling — but the component still does the right thing if both end up
missing.

**Alternatives considered:**

- Keep types required, add runtime warning on missing values — rejected:
  the warning would never reach end users, the component would still crash
  in the buggy MC paths, and it papers over the real type-system gap.
- Replace `firstName`/`lastName` with a single `name` prop — rejected as
  out of scope; would be a real breaking API change. Names are still split
  into two fields because that's how the rest of MC models the data, and
  initials extraction can yield meaningful single-letter output per field.

### Decision 4: Two-key i18n model (`avatarLabel` + new `avatarLabelGeneric`)

**Choice:** Keep existing `avatarLabel` ("Avatar image for {fullName}") for
when at least one name is present. Add a new key `avatarLabelGeneric`
(default English: `"User avatar"`) for when both names are missing.

**Rationale:** Translators get clean, complete sentences in both branches.
Avoiding a single template like "Avatar image for {fullName}" with
`fullName=""` would yield "Avatar image for " — grammatically broken in
every locale and worse than a generic fallback.

**Alternatives considered:**

- Single key with conditional ICU plural/select syntax — rejected:
  @internationalized/string supports parameter interpolation but using ICU
  selects across an empty-string condition adds complexity for translators
  and doesn't reduce file count.
- Compose `fullName` as the trimmed-and-joined parts and reuse
  `avatarLabel` even when only one name is given — yes, do this for the
  one-name case ("Avatar image for John"). The generic key is only used
  when **both** are missing.

### Decision 5: `fullName` composition is `[firstName, lastName].map(trim).filter(Boolean).join(" ")`

**Choice:** Compose `fullName` by trimming each part, dropping empty
parts, then joining with a single space.

**Rationale:** Avoids leading/trailing spaces ("John " or " Doe") and
double spaces. Produces a clean string for both `aria-label`
interpolation and the default `alt` text.

### Decision 6: Test split between `avatar.spec.tsx` (new) and `avatar.stories.tsx`

**Choice:**

- New `avatar.spec.tsx` — JSDOM unit tests for an exported pure helper
  `getInitials(firstName?, lastName?)` covering the full edge-case matrix.
  Fast feedback loop for TDD.
- `avatar.stories.tsx` — extended with play-function stories that assert
  rendered DOM (Person icon presence, single-character text, etc.) for
  the integration-level cases.

**Rationale:** Per Nimbus conventions, component behavior tests live in
stories (browser-based via Playwright) and unit tests are reserved for
utilities/hooks. Extracting `getInitials` as a named export from
`avatar.tsx` lets us assert the helper directly without paying the
browser-test cost for every input permutation.

## Risks / Trade-offs

- **Risk:** Translators won't have `avatarLabelGeneric` translated when
  the change ships. **Mitigation:** Ship the English default and rely on
  the existing Transifex auto-sync workflow; until translations land,
  non-English locales will fall back to English for this single string —
  acceptable for an edge-case label.

- **Risk:** Bundle size increases by importing `Person` icon directly
  inside the Avatar component, even when consumers never hit the
  fallback path. **Mitigation:** `@commercetools/nimbus-icons` is a
  per-icon ESM package; importing `Person` adds only the single SVG
  component (~200 bytes gzipped). Acceptable.

- **Risk:** `Array.from` doesn't handle ZWJ-joined emoji like 👨‍👩‍👧 (treats
  the joined cluster as 5 codepoints). **Mitigation:** Document this in
  the spec as a known limitation; the rendered initial will be a single
  emoji codepoint, which still renders as a recognizable glyph in modern
  browsers. Future revisit via `Intl.Segmenter` if real data needs it.

- **Trade-off:** Relaxing `firstName`/`lastName` to optional means
  TypeScript will start flagging callers who relied on inference like
  `<Avatar firstName={user.firstName!} />` — actually a correctness win
  but may surface latent bugs in consumer codebases. **Mitigation:**
  Document in the changeset and `dev.mdx` that the type relaxation is
  intentional.

- **Trade-off:** `toUpperCase()` is locale-independent, which is
  technically wrong for Turkish (`i` → `İ`). Same as today, no
  regression, but worth flagging for a follow-up.

## Migration Plan

This is an additive, type-relaxing change. No migration is required for
existing consumers:

1. Existing call sites passing both names: unchanged behavior.
2. Call sites passing only one name (likely via `string | undefined` types
   that previously were silently coerced to `"undefined"`): now render
   correctly with single initial or icon.
3. The change ships behind a minor semver bump via Changeset.

Rollback: revert the PR; the previous behavior (crash on empty string) is
restored. No data migration, no schema changes.

## Open Questions

None blocking. Follow-ups, if any, can include:

- Should we add an opt-in `fallbackIcon` prop for consumers who want a
  different glyph? (Likely yes, post-launch, behind real demand.)
- Should we adopt `Intl.Segmenter` for grapheme-cluster correctness?
  (Defer until a consumer surfaces a ZWJ-emoji name.)
