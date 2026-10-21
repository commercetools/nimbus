# Review Summary: Toast Notification System

**Branch:** `CRAFT-1853-nimbus-toast-notification-system--implementation`
**Sources:** review-a.md (AI Code Review), review-b.md (Senior Engineer Review)
**Date:** 2026-02-19

---

## How to read this document

Each item below is a normalized, de-duplicated statement drawn from both
reviews. The **Verified** column documents whether the claim was confirmed
against the actual source files. **Recommendation** is the suggested action.

Severity legend: 🔴 Critical · 🟠 High · 🟡 Medium · ⚠️ Warning · 💡 Suggestion

---

## 🔴 Critical

### C-1 — Cross-chunk barrel imports in `toast.outlet.tsx`

**Statement:** `IconButton` and `Button` are imported from their component
directory barrel (`../icon-button`, `../button`) rather than directly from their
implementation files.

**Verified: ✅ TRUE** `toast.outlet.tsx:15-16` clearly shows barrel imports,
while `LoadingSpinner` on line 17 is already imported correctly
(`../loading-spinner/loading-spinner`). The cross-chunk import rule is
documented in `packages/nimbus/AGENTS.md` and
`docs/file-type-guidelines/main-component.md`.

**Recommendation: Fix required.** Change to:

```ts
import { IconButton } from "../icon-button/icon-button";
import { Button } from "../button/button";
```

**Status: ✅ RESOLVED** (commit:
`fix(toast): use direct implementation imports instead of barrel exports`)

---

### C-2 — Toast recipe registered without the `nimbus` prefix

**Statement:** `slot-recipes/index.ts` registers the toast recipe as
`toast: toastRecipe` while every other recipe uses the `nimbus*` naming
convention (`nimbusDialog`, `nimbusDrawer`, etc.). The file's own JSDoc warns
against unprefixed keys.

**Verified: ✅ TRUE** `slot-recipes/index.ts:106` has `toast: toastRecipe`. All
35 other entries use the `nimbus` prefix. The file's JSDoc (lines 55–68)
explicitly warns that omitting the prefix causes TypeScript type collisions with
Chakra built-ins. The recipe file itself has a comment stating the `toast` key
is intentional to override Chakra's default toast recipe.

**Recommendation: Partial fix required.** The deviation is intentional (needed
for `useToastStyles()` to resolve Nimbus styles through Chakra's built-in
`toast` recipe key), but the exception is undocumented at the registration site.
Add a comment in `slot-recipes/index.ts` next to the `toast` entry explaining
the intentional exception — do not add the `nimbus` prefix, as that would break
the style resolution.

**Status: ✅ RESOLVED** (commit:
`fix(toast): document intentional recipe key exception in slot-recipes`)

---

### C-3 — i18n infrastructure exists but the dismiss button label is never resolved

**Statement:** The close button's `aria-label` is hardcoded as `"__Dismiss"`
(with double-underscore prefix). The `toast.messages.ts` file, all five locale
dictionaries under `intl/`, and the `ToastMessageKey` type already exist — they
simply are never imported or used in `toast.outlet.tsx`.

**Verified: ✅ TRUE** `toast.outlet.tsx:99` has `aria-label="__Dismiss"`.
`toast.messages.ts` exports `toastMessagesStrings` and
`ToastMessageKey = "dismiss"`. Neither is imported in the outlet. Screen readers
in every locale announce the raw placeholder string (double underscores
included), which is an accessibility regression.

**Recommendation: Fix required.** Wire up `useLocalizedStringFormatter` with
`toastMessagesStrings` in `toast.outlet.tsx` to resolve the correct locale
string. Once that is done, update the `CloseButtonAriaLabel` story assertion to
expect `"Dismiss"` instead of `"__Dismiss"`.

**Status: ✅ RESOLVED** (commit:
`fix(toast): wire up i18n for dismiss button aria-label`)

---

### C-4 — `interface` used instead of `type` syntax in `toast.types.ts`

**Statement:** Four exported declarations use the `interface` keyword
(`ToastAction`, `ToastOptions`, `ToastPromiseOptions`, `IToastManager`) contrary
to the Nimbus types convention.

**Verified: ✅ TRUE** `toast.types.ts:29,47,75,91` all use `interface`. The
checklist in `docs/file-type-guidelines/types.md:866` explicitly requires `type`
syntax (not `interface`). Toast is the only types file in the entire codebase
that uses `interface` — all other `*.types.ts` files use `type`.

**Recommendation: Fix required.** Convert all four to `export type X = { ... }`
syntax.

**Status: ✅ RESOLVED** (commit:
`fix(toast): convert interfaces to type syntax, rename IToastManager, make description optional`)

---

## 🟠 High

### H-1 — `promise()` does not tunnel `closable`, `variant`, or `icon` into `meta`

**Statement:** `toast.manager.ts`'s `promise()` method spreads toast state
options directly onto the Chakra toast object without wrapping `closable`,
`variant`, and `icon` inside `meta`, so the outlet (which reads
`toast.meta?.closable`, etc.) never renders the close button or custom icon for
promise toasts.

**Verified: ✅ TRUE** `toast.manager.ts:201–212` — the mapped object for
`loading`, `success`, and `error` spreads `options.*` directly and calls
`mapAction()`, but does not construct a `meta` object. Compare with `create()`
(lines 99–103) which builds `meta: { closable, variant, icon }`.

**Recommendation: Fix required.** Replicate the `meta`-tunneling pattern from
`create()` into each state of the `promise()` mapped object.

**Status: ✅ RESOLVED** (commit:
`fix(toast): tunnel closable/variant/icon through meta in promise() and update()`)

---

### H-2 — `update()` silently ignores `icon` and `variant` updates

**Statement:** `toast.manager.ts`'s `update()` method destructures `action` for
mapping, but does not handle `icon` or `variant` — both of which are stored in
`meta` and therefore cannot be updated after creation.

**Verified: ✅ TRUE** `toast.manager.ts:122–124` — `update()` passes
`{ ...rest, action: mapAction(action) }` to the underlying toaster, with no
`meta` reconstruction. `create()` shows how to build `meta`; `update()` does not
do the same.

**Recommendation: Fix required (companion to H-1).** Reconstruct `meta` from the
update options inside `update()`, mirroring the pattern in `create()`.

**Status: ✅ RESOLVED** (commit:
`fix(toast): tunnel closable/variant/icon through meta in promise() and update()`)

---

### H-3 — `TOAST_REVIEW.md` is committed as a component source file

**Statement:** An internal review artifact (`TOAST_REVIEW.md`) sits inside
`packages/nimbus/src/components/toast/` — a path reserved for canonical
component files. It is not a valid component file type and exposes internal
implementation notes publicly.

**Verified: ✅ TRUE** (confirmed via branch diff in both reviews).

**Recommendation: Fix required.** Delete the file before merging.

**Status: ✅ RESOLVED** (commit:
`fix(toast): remove internal review artifact from component directory`)

---

### H-4 — `toast.types.ts` does not follow the Four-Layer Pattern

**Statement:** The types file uses ad-hoc `// TOAST CORE TYPES` and
`// TOAST MANAGER TYPES` section dividers rather than the Four-Layer Pattern
(Recipe Props → Slot Props → Helper Types → Main Props) required by the types
guidelines.

**Verified: ⚠️ PARTIALLY TRUE — with important nuance.** The Four-Layer Pattern
is designed for standard React component props types that extend Chakra's slot
props. Toast's types file is atypical: it defines an _imperative manager API_
(`IToastManager`), not a React element props tree. The pattern does not map
cleanly onto an imperative API. No other manager-style component exists to
compare against.

**Recommendation: Fix partially — apply where applicable.** Adopt the standard
section dividers and `type` syntax (see C-4), but recognize that the Four-Layer
Pattern does not apply verbatim to an imperative API type file. What matters is
structural consistency within the file and consistent use of `type` over
`interface`.

**Status: ✅ RESOLVED** (commit:
`fix(toast): reorganize types file with standard section structure`)

---

## 🟡 Medium

### M-1 — `IToastManager` uses Hungarian notation prefix

**Statement:** The type `IToastManager` uses the `I`-prefix (Hungarian notation
convention from C#/Java), which does not appear anywhere else in the Nimbus
codebase.

**Verified: ✅ TRUE** No other Nimbus type or interface uses an `I`-prefix. The
naming convention in `docs/file-type-guidelines/types.md` does not mention or
endorse this pattern.

**Recommendation: Fix required.** Rename to `ToastManagerApi` or `ToastApi` to
match Nimbus naming conventions.

**Status: ✅ RESOLVED** (commit:
`fix(toast): convert interfaces to type syntax, rename IToastManager, make description optional`)

---

### M-2 — `toast.i18n.ts` source file is absent

**Statement:** The compiled `toast.messages.ts` and locale files under `intl/`
exist, but the `toast.i18n.ts` source file from which they should have been
generated is missing. Without it, the `dismiss` message cannot be re-extracted
by `pnpm extract-intl` or re-submitted to Transifex.

**Verified: ✅ TRUE** Glob search confirms no `toast.i18n.ts` file exists in the
toast directory. `toast.messages.ts` and all locale files exist, but their
source is absent.

**Recommendation: Fix required.** Create `toast.i18n.ts` with the `dismiss`
message definition so the translation pipeline remains functional for future
changes.

**Status: ✅ RESOLVED** (commit:
`fix(toast): add missing i18n source file for dismiss message`)

---

### M-3 — `toast.mdx` documents placement values that do not exist

**Statement:** The designer documentation references `"top"` and `"bottom"`
center placements, but the implementation only supports four corner placements
(`top-start`, `top-end`, `bottom-start`, `bottom-end`). The center placements
were removed during the design phase.

**Verified: ✅ TRUE** `toast.types.ts:20–24` — `ToastPlacement` only contains
the four corner values. Both reviews independently flag this discrepancy in
`toast.mdx`.

**Recommendation: Fix required.** Remove references to `"top"` and `"bottom"`
center positions from `toast.mdx`.

**Status: ✅ RESOLVED** (commit:
`fix(toast): correct factual errors in designer and engineering docs`)

---

### M-4 — `pauseOnPageIdle` is a public API prop with no effect

**Statement:** `ToastOptions.pauseOnPageIdle` is documented and typed as a
per-toast option, but it is never read in `toast.manager.ts`'s `create()` method
and is therefore silently ignored. The global `pauseOnPageIdle: true` is set on
the toaster at initialization time and cannot be overridden per-toast.

**Verified: ✅ TRUE** `toast.manager.ts:94–104` — `safeOptions` is destructured
but `pauseOnPageIdle` is never accessed or forwarded. Only `pauseOnInteraction`
is forwarded (line 98).

**Recommendation: Fix required.** Either forward `safeOptions.pauseOnPageIdle`
into the toast options (if Chakra's API supports it per-toast), or remove it
from `ToastOptions` and document it as a global-only setting. Leaving it as a
silent no-op is misleading to consumers.

**Status: ✅ RESOLVED** (commit:
`fix(toast): remove non-functional pauseOnPageIdle from per-toast options`)

---

### M-5 — `description` and `title` are required in types but conditionally guarded in the outlet

**Statement:** `ToastOptions.title` and `ToastOptions.description` are typed as
`string` (required), but the outlet wraps both in conditional guards
(`{toast.title && ...}`, `{toast.description && ...}`). The type contract and
the rendering logic are inconsistent.

**Verified: ✅ TRUE** `toast.types.ts:53,55` — both required.
`toast.outlet.tsx:77–81` — both guarded.

**Recommendation: Fix required — choose one approach.** Either trust the type
contract and remove the guards (cleaner, consistent), or make both fields
optional (`title?: string`, `description?: string`) and keep the guards. Given
that both reviews independently consider `description` potentially optional (the
outlet's guard suggests it was once optional in practice), making `description`
optional and `title` required may be the most accurate model.

**Status: ✅ RESOLVED** (commit:
`fix(toast): convert interfaces to type syntax, rename IToastManager, make description optional`)

---

### M-6 — `any` types used for the Chakra toast render prop

**Statement:** The `toast` parameter in `ToastContent` and in the `<Toaster>`
render callback is typed as `any`, suppressed with `eslint-disable` comments
rather than defining a proper interface.

**Verified: ✅ TRUE** `toast.outlet.tsx:52` and `toast.outlet.tsx:145` both use
`// eslint-disable-next-line @typescript-eslint/no-explicit-any` with
`toast: any`.

**Recommendation: Should fix.** Define a minimal internal type (e.g.,
`ChakraToastData`) covering only the fields accessed: `type`, `title`,
`description`, `action`, `meta`, `id`. This is straightforward and does not
require depending on unexported Chakra internals.

**Status: ✅ RESOLVED** (commit:
`fix(toast): replace any types with ChakraToastData interface`)

---

### M-7 — Long-running story tests inflate CI time

**Statement:** `ComprehensiveIntegration` waits 7 seconds and `AutoDismiss`
accumulates 14+ seconds of `setTimeout` waits, making these stories
disproportionately slow.

**Verified: 🔲 NOT directly verified** (not read, but consistent across both
reviews).

**Recommendation: Should fix.** Pass explicit short durations (e.g., 300–500 ms)
for test scenarios that only need to assert dismissal, rather than waiting for
the real 6-second default.

**Status: ✅ RESOLVED** (commit:
`fix(toast): remove console.log, improve query strategy, reduce story test duration`)

---

## ⚠️ Warnings

### W-1 — `toast.mdx` incorrectly states action toasts do not auto-dismiss

**Statement:** The designer documentation states "Toasts with actions don't
auto-dismiss," but the implementation uses the standard 6-second duration for
all toasts regardless of whether they have action buttons.

**Verified: ✅ TRUE** Both reviews confirm the behavior: `toast.manager.ts` has
no special-casing for action toasts. The commit history shows
`duration: Infinity` for action toasts was explicitly removed. The documentation
is factually wrong.

**Recommendation: Fix required.** Update `toast.mdx` to reflect that action
toasts do auto-dismiss after the standard duration. If the intent was to make
them persistent, re-add `duration: Infinity` enforcement in `create()` and
update both docs to match.

**Status: ✅ RESOLVED** (commit:
`fix(toast): correct factual errors in designer and engineering docs`)

---

### W-2 — `toast.dev.mdx` claims the i18n close-button label is wired up

**Statement:** The engineering documentation states "The close button includes a
translated `aria-label` that adapts to the user's locale," which is false — the
label is currently the hardcoded placeholder `"__Dismiss"`.

**Verified: ✅ TRUE** (C-3 confirms the i18n is not wired).

**Recommendation: Fix required (coupled with C-3).** Remove or correct this
claim. Once C-3 is resolved the claim can be restored accurately.

**Status: ✅ RESOLVED** (commit:
`fix(toast): correct factual errors in designer and engineering docs`)

---

### W-3 — `toast.dev.mdx` "Closable (Default)" example label is misleading

**Statement:** A code example is labelled `"Closable (Default)"` with
`closable: true`, implying the default is `closable: true`, but the actual
default is `closable: false`.

**Verified: ✅ TRUE** `toast.types.ts:64` — JSDoc says `(default: false)`.
`toast.manager.ts:86` — defaults to `false`. The label in the example is wrong.

**Recommendation: Fix required.** Rename the example label to something like
`"Closable Toast"` and add a note that `closable` defaults to `false`.

**Status: ✅ RESOLVED** (commit:
`fix(toast): correct factual errors in designer and engineering docs`)

---

### W-4 — Stories contain `console.log` calls in action handlers

**Statement:** Several action handler callbacks in `toast.stories.tsx` call
`console.log(...)`, producing noise in test output.

**Verified: 🔲 NOT directly verified** (not read, consistent across both
reviews).

**Recommendation: Fix required.** Replace with `() => {}` or a Storybook action
(`fn()`).

**Status: ✅ RESOLVED** (commit:
`fix(toast): remove console.log, improve query strategy, reduce story test duration`)

---

### W-5 — `CloseButtonAriaLabel` story asserts the broken placeholder value

**Statement:** The story's play function asserts `aria-label === "__Dismiss"`,
cementing the broken state as the expected behavior rather than flagging it.

**Verified: ✅ TRUE** (implied by C-3 — the label is `"__Dismiss"` and the story
currently asserts this value according to both reviews).

**Recommendation: Fix required (coupled with C-3).** After wiring up i18n,
update the assertion to `"Dismiss"`.

**Status: ✅ RESOLVED** (commit:
`fix(toast): wire up i18n for dismiss button aria-label`)

---

### W-6 — Stories use `data-testid` as primary query strategy

**Statement:** 24+ queries in `toast.stories.tsx` use `getByTestId()` rather
than accessible role/name queries. This weakens the accessibility signal of the
test suite.

**Verified: 🔲 NOT directly verified** (not read, mentioned in both reviews).

**Recommendation: Should fix.** Prefer `getByRole('button', { name: /label/i })`
or `getByText()` for trigger buttons with descriptive labels. Reserve
`data-testid` for elements with no accessible name (toast containers, regions,
etc.).

**Status: ✅ RESOLVED** (commit:
`fix(toast): remove console.log, improve query strategy, reduce story test duration`)

---

### W-7 — Storybook link placeholder in `toast.dev.mdx`

**Statement:** `toast.dev.mdx:493` contains `[Storybook](link-tbd)` — a
placeholder that was never replaced with the actual URL.

**Verified: 🔲 NOT directly verified** (only review-b mentions this, not read
directly).

**Recommendation: Fix before merge.** Replace with the actual Storybook
deep-link once the story is published.

**Status: ✅ RESOLVED** (commit:
`fix(toast): correct factual errors in designer and engineering docs`)

---

### W-8 — `LoadingSpinner` uses `colorPalette="white"` for solid variant

**Statement:** In `toast.outlet.tsx:70`, the loading spinner uses
`colorPalette = variant === "solid" ? "white" : "primary"`. The `"white"`
palette is non-standard and may not render correctly across dark/light modes.

**Verified: ✅ TRUE** (code confirmed at outlet.tsx:70). Whether `"white"` is a
valid palette in the token system is not confirmed — only review-b raises this;
review-a does not.

**Recommendation: Investigate.** Verify that `colorPalette="white"` renders
correctly in both light and dark themes. If it is not a defined token palette,
replace it with the appropriate token. Low priority if visual testing confirms
it renders correctly.

**Status: ✅ RESOLVED** — `"white"` is a valid, explicitly typed palette in
`loading-spinner.types.ts` (`colorPalette?: "primary" | "white"`). Added inline
comment explaining the contrast rationale. No code change needed.

---

## 💡 Suggestions

### S-1 — Add unit test for `promise()` meta tunneling

**Statement:** There are no unit tests verifying that `promise()` forwards
`closable`, `icon`, or `variant` into `meta`. Adding such a test would catch the
H-1 regression and prevent it from recurring.

**Recommendation:** Add test to `toast.spec.tsx` after H-1 is fixed.

**Status: ✅ RESOLVED** — Added "Tunnels closable, variant, and icon through
meta for each promise state" test to `toast.spec.tsx`. Verifies all three meta
fields with non-default values across loading, success, and error states.

---

### S-2 — `Variants` story play function lacks assertions

**Statement:** The `Variants` story clicks the trigger button but asserts
nothing about the rendered output, making it a no-op test.

**Recommendation:** Add at least one assertion (e.g., that toast elements with
each variant's text are present in the document).

**Status: ✅ RESOLVED** — Added step assertions verifying one representative
toast title per variant (accent-start, subtle, solid) is present in the document
after clicking the trigger.

---

### S-3 — Promise docs test has no meaningful assertion

**Statement:** The "Promise Pattern" test in `toast.docs.spec.tsx` calls
`toast.promise()` but only verifies no error is thrown. No observable output is
asserted.

**Recommendation:** Assert that the mock toaster receives a `.promise()` call,
or that the loading toast ID is returned.

**Status: ✅ RESOLVED** — Added `vi.spyOn(toast, "promise")` assertion verifying
the function was called with the correct promise reference and the expected
state titles (loading/success/error).

---

### S-4 — Document SSR constraint in `toast.toasters.ts`

**Statement:** The lazy initialization pattern is sound, but there is no JSDoc
note that `toast()` cannot be called during server-side rendering.
`TOAST_REVIEW.md` tracks this as a future item, but that file must be deleted.

**Recommendation:** Add a brief JSDoc note in `toast.toasters.ts` or
`toast.manager.ts` warning that the API requires a browser environment.

**Status: ✅ RESOLVED** — Added `@note` JSDoc warning about SSR constraint to
the lazily-initialized toasters block in `toast.toasters.ts`.

---

### S-5 — Export `resetToasters()` for test isolation

**Statement:** `toast.reset()` clears the ID map but the underlying Chakra
toaster instances persist, potentially causing cross-test state leakage.

**Recommendation:** Export a `resetToasters()` function from `toast.toasters.ts`
that sets the internal `toasters` map to `null`, and call it from
`toast.reset()`.

**Status: ✅ RESOLVED** — Added `resetToasters()` export to `toast.toasters.ts`
and updated `toast.manager.ts`'s `reset()` to call it, providing full cleanup.

---

### S-6 — Replace hardcoded `3px` in `accent-start` box-shadow with a design token

**Statement:** The `accent-start` variant's box-shadow
(`inset 3px 0 0 0 var(...)`) uses a raw pixel value rather than a design token,
which is inconsistent with the token-based approach used throughout the recipe.

**Recommendation:** Replace with the nearest spacing token (likely `sizes.25` or
similar, depending on the token scale).

**Status: ✅ RESOLVED** — Registered `borderWidths` (25=1px, 50=2px, 75=3px,
100=4px) as a Chakra token category in the nimbus theme, then replaced the
hardcoded `3px` in the recipe with `{borderWidths.75}`.

---

## Non-Toast Changes (both reviews agree: acceptable)

| File                                | Change                                               | Assessment |
| ----------------------------------- | ---------------------------------------------------- | ---------- |
| `combobox/utils/filters.spec.ts`    | Initializes `score` to `0`                           | Fine       |
| `data-table/utils/rows.utils.tsx`   | Refactors sort value assignment                      | Fine       |
| `inline-svg/inline-svg.stories.tsx` | Narrows test assertion to `div[role="presentation"]` | Fine       |

These changes are minor and correct. Both reviews note they would ideally live
in separate commits on `main` for cleaner git history, but this is a low
priority issue.

---

## Prioritized Action List

| Priority | Item                                       | File                                 | Action                  |
| -------- | ------------------------------------------ | ------------------------------------ | ----------------------- |
| 1        | C-3 — Wire up i18n aria-label              | `toast.outlet.tsx`                   | Fix — a11y regression   |
| 2        | C-1 — Cross-chunk barrel imports           | `toast.outlet.tsx`                   | Fix — build correctness |
| 3        | C-2 — Document unprefixed recipe key       | `slot-recipes/index.ts`              | Add comment             |
| 4        | C-4 — Convert `interface` to `type`        | `toast.types.ts`                     | Fix — convention        |
| 5        | H-1 — `promise()` meta tunneling           | `toast.manager.ts`                   | Fix — functional bug    |
| 6        | H-2 — `update()` meta tunneling            | `toast.manager.ts`                   | Fix — functional bug    |
| 7        | H-3 — Delete `TOAST_REVIEW.md`             | Component directory                  | Delete                  |
| 8        | M-1 — Rename `IToastManager`               | `toast.types.ts`                     | Fix — naming convention |
| 9        | M-2 — Create `toast.i18n.ts`               | Toast directory                      | Create source file      |
| 10       | M-3 — Fix placement docs                   | `toast.mdx`                          | Fix — factual error     |
| 11       | M-4 — Fix or remove `pauseOnPageIdle`      | `toast.types.ts`, `toast.manager.ts` | Fix — silent no-op      |
| 12       | M-5 — Align `description` type with outlet | `toast.types.ts`, `toast.outlet.tsx` | Fix — inconsistency     |
| 13       | W-1 — Fix action toast duration docs       | `toast.mdx`                          | Fix — factual error     |
| 14       | W-2 — Remove false i18n claim              | `toast.dev.mdx`                      | Fix — factual error     |
| 15       | W-3 — Fix "Closable (Default)" label       | `toast.dev.mdx`                      | Fix — misleading        |
| 16       | W-4 — Remove `console.log` calls           | `toast.stories.tsx`                  | Fix — test noise        |
| 17       | W-5 — Update aria-label assertion          | `toast.stories.tsx`                  | Fix — coupled with C-3  |
| 18       | W-7 — Replace Storybook placeholder link   | `toast.dev.mdx`                      | Fix before merge        |
| 19       | M-6 — Replace `any` types                  | `toast.outlet.tsx`                   | Should fix              |
| 20       | H-4 — Restructure types file sections      | `toast.types.ts`                     | Should fix              |
| 21       | M-7 — Reduce story test wait times         | `toast.stories.tsx`                  | Should fix              |
| 22       | W-6 — Replace `data-testid` queries        | `toast.stories.tsx`                  | Should fix              |
| 23       | W-8 — Verify `colorPalette="white"`        | `toast.outlet.tsx`                   | Investigate             |
| 24       | S-1 — Add `promise()` meta test            | `toast.spec.tsx`                     | Nice to have            |
| 25       | S-2 — Add assertions to Variants story     | `toast.stories.tsx`                  | Nice to have            |
| 26       | S-3 — Add meaningful Promise docs test     | `toast.docs.spec.tsx`                | Nice to have            |
| 27       | S-4 — Document SSR constraint              | `toast.toasters.ts`                  | Nice to have            |
| 28       | S-5 — Export `resetToasters()`             | `toast.toasters.ts`                  | Nice to have            |
| 29       | S-6 — Replace hardcoded `3px` token        | `toast.recipe.ts`                    | Nice to have            |
