## Context

Nimbus has an inline `Code` component (`packages/nimbus/src/components/code`,
single-slot `nimbusCode` recipe, `fontFamily: "mono"`) but no block-level code
renderer. This change adds `CodeBlock` as the block sibling — the same split used
by Chakra UI v3 and Atlassian (inline `Code` + block `CodeBlock`).

This design is informed by two research phases:

- **Phase 0 (deep research, 24/25 claims verified)**: naming, read-only mandate,
  ARIA rules for code regions, keyboard model for scroll regions, and
  highlighter/theming strategy.
- **Phase 1 (Nimbus library research)**: reconciliation against React Aria,
  Chakra v3 recipes, the Card compound pattern, the existing
  `useCopyToClipboard` hook, `IconButton`, `VisuallyHidden`, and the
  bundle-size CI gate.

Constraints: WCAG 2.1 AA; strict TypeScript (no `any`); token-only theming (no
raw px/hex); SSR-safe; the bundle-size gate (`pnpm check:bundle-size`) and
package-shape gate apply when `package.json`/exports change.

## Goals / Non-Goals

**Goals:**

- A read-only, accessible, token-themed block code renderer with syntax
  highlighting for the common language set.
- Single props-driven API: `<CodeBlock code language showLineNumbers
  startLineNumber highlightedLines showHeader showCopyButton size aria-label
  onCopy />`.
- Copy-to-clipboard with a screen-reader success announcement.
- Light/dark and full brand-redesign decoupling — only tokens + recipe change,
  never component logic.
- Internal slot structure that lets future features (collapsible, word-wrap,
  filename/title) be added without an API break.

**Non-Goals:**

- Editing / code input (that is a different component — a code editor).
- Collapsible/expandable, word-wrap toggle, and filename/title chrome (designed
  for via slots, but not implemented in v1).
- Non-contiguous or per-line custom line numbering (diff hunks with gaps,
  arbitrary number arrays). The `startLineNumber` offset covers contiguous
  excerpts only.
- Line-highlight ranges and semantic (non-visual) highlight conveyance.
  `highlightedLines` is a flat list of line numbers with a decorative band.
- Auto language detection (explicit `language` prop only).
- A compound `.Root` public API (content is data, not composable JSX).

## Decisions

### Decision 1: Highlighter = `prism-react-renderer` (bundled dependency)

**Choice**: Use `prism-react-renderer@^2.4.1` as a regular bundled
`dependency` of `@commercetools/nimbus`.

**Why over alternatives:**

- **Shiki** (Phase-0's aesthetic favorite): rejected for a published library —
  large WASM/oniguruma payload and an async `createHighlighter()` API that would
  force Suspense/async into a display component and conflict with the bundle-size
  gate.
- **react-syntax-highlighter**: rejected — bundles both highlight.js and Prism
  cores and uses `dangerouslySetInnerHTML` in the Prism path.
- **lowlight/highlight.js**: rejected — no React renderer; consuming its `hast`
  output requires HTML serialization/innerHTML.
- **prism-react-renderer**: renders tokens as React elements (no
  `dangerouslySetInnerHTML` → inherently XSS-safe for untrusted code), is
  synchronous (SSR-safe), is already in the monorepo lockfile (via `apps/docs`),
  and its `PrismTheme` is a plain JS object whose `color` values may be CSS
  variables — exactly what token-driven theming needs.

**Packaging**: bundled `dependency` (not peer) so `import { CodeBlock }` works
out of the box; tree-shaking keeps it out of consumers who never import
`CodeBlock`. The bundle-size delta is accepted and verified against the CI gate.

### Decision 2: Token-driven theming via CSS custom properties

The recipe's `root` slot declares one namespaced CSS custom property per syntax
token type — `--code-token-keyword`, `--code-token-string`, `--code-token-comment`,
`--code-token-number`, `--code-token-function`, `--code-token-tag`,
`--code-token-attr`, `--code-token-punctuation`, `--code-token-operator`,
`--code-token-plain` — each mapped to a Nimbus color token, with `_dark`
overrides for dark mode. A **static** `PrismTheme` object (in
`code-block.constants.ts`) maps each Prism token type to `var(--code-token-*)`.

Consequences:

- The theme object never changes between renders or color modes — light/dark is
  resolved entirely by the CSS cascade (Chakra `_dark` condition), so the
  component logic never reads or branches on a color.
- A brand redesign edits only tokens + recipe. This is the testable decoupling
  required by `docs/theming-decoupling.md`.
- Monospace font comes from the existing `fontFamily: "mono"` token; surface and
  border use semantic tokens (e.g. `neutral.2` / `neutral.6`), mirroring the
  Card recipe.

### Decision 3: Slot recipe, single-component composition

Internally the component is built from a registered Chakra slot recipe
`nimbusCodeBlock` (`defineSlotRecipe` + `createSlotRecipeContext`,
`withProvider`/`withContext`, reference: `card`). Slots: `root`, `header`,
`languageLabel`, `copyButton`, `pre`, `code`, `line`, `lineNumber`.

Even though the **public** API is a single props-driven component, composing
internal styled slots (rather than ad-hoc `Box`es) keeps every visual decision in
the recipe and reserves named seams for future features. The recipe is registered
in `packages/nimbus/src/theme/slot-recipes/index.ts` as `nimbusCodeBlock`.

### Decision 4: Accessibility structure

- Outer container: `role="region"` with an accessible name from `aria-label`
  (default localized "Code block"). `role="region"` is a labelled landmark, which
  matches "a self-contained block of code worth navigating to".
- Inner `<code>` carries its implicit `role=code` and **no** `aria-label` — ARIA
  prohibits accessible names on `code`; the name lives on the region.
- The `<pre>` scroll container carries `tabIndex={0}` so overflowing code is
  keyboard-scrollable (WCAG 2.1.1 / axe `scrollable-region-focusable`).
  **v1 decision**: apply `tabIndex={0}` **unconditionally** — it is simpler and
  always safe. (See Risks for the overflow-conditional refinement.)
- The language label in the header is `aria-hidden` (decorative; avoids redundant
  announcement).
- Copy success: a `VisuallyHidden` `aria-live="polite"` region (always mounted,
  empty until copy) announces the localized "Copied" message; the message clears
  after ~2s so it does not linger for later reads.

### Decision 5: Copy mechanics

Reuse the existing `useCopyToClipboard` hook
(`packages/nimbus/src/hooks/use-copy-to-clipboard`, wraps `react-use`). The copy
button is a Nimbus `IconButton` (React Aria `Button`, `onPress`). On press: copy
the `code` string, set a transient "copied" state (toggles icon + the live-region
message), invoke `onCopy` once, and reset after a timeout. No toast — too
heavyweight for an inline affordance and would require a toaster service.

### Decision 6: `language` is explicit; unknown falls back to plaintext

`language` defaults to `"plaintext"`. prism-react-renderer renders an unknown
grammar as a single plain token stream, so unsupported/omitted languages degrade
gracefully with no crash. The common set (js, jsx, ts, tsx, json, css,
html/markup, graphql, sql, yaml, markdown, python, rust, go, bash/shell, …) is
covered by the prism core that ships with prism-react-renderer.

### Decision 7: Line-number gutter offset via `startLineNumber`

The line-number gutter renders `lineIndex + startLineNumber` rather than a
hard-coded `lineIndex + 1`. `startLineNumber` is an optional positive integer
defaulting to `1`, so existing behavior is unchanged when it is omitted.

**Naming**: `startLineNumber` — qualifier-first noun, matching the established
Nimbus/React Aria numeric-prop convention (`minValue`, `maxValue`,
`defaultValue`, `minSize`, `maxSize`); a noun-first `lineNumberStart` would be
the equivalent of `valueMin`, which appears nowhere in the codebase. `start`
(over `first`) is React Aria's positional vocabulary (`start`/`end`).

**Orthogonality**: `startLineNumber` is purely the gutter's starting value;
`showLineNumbers` remains the sole on/off switch. The offset has no effect when
the gutter is hidden, and it never participates in copy (copy uses the `code`
prop, so numbers — decorative — are never included regardless of the offset).

**Scope (contiguous only)**: a single numeric offset covers the real use case —
a contiguous excerpt of a file (lines 42–46). Non-contiguous numbering (diff
hunks with gaps, skipped rows, a `…` gutter) would need a richer API
(`lineNumbers={[...]}` or a render callback) and is deliberately deferred until
there is a concrete use case, keeping v1 minimal and additive.

### Decision 8: Line highlighting via `highlightedLines`

A line is highlighted when its **displayed** line number (`index +
startLineNumber`) appears in the `highlightedLines` array. The component sets a
`data-highlighted` attribute on the matching `line` slot (absent — not `false` —
when off), and the recipe styles `&[data-highlighted]` with a `backgroundColor`
token.

**Keyed to displayed numbers, not array index**: highlighting shares the gutter's
numbering, so `startLineNumber={42} highlightedLines={[43]}` highlights the line
labeled `43`. This is the intuitive model ("highlight line 43") and composes
cleanly with the excerpt feature. Highlighting is independent of
`showLineNumbers` so a consumer can emphasize a line without showing a gutter.

**Token-driven, mode-adaptive**: the band uses `amber.3`, which carries its own
`_light`/`_dark` values, so the highlight adapts to color mode with no `_dark`
override and no branching in component logic — consistent with the theming
decoupling requirement. No new CSS custom property is needed because the value is
applied directly in the recipe (unlike the syntax `--code-token-*` vars, which
exist only so the static `PrismTheme` JS object can reference them).

**Full-width under horizontal scroll**: a `display: block` line's background only
covers the viewport, so a highlighted long line would show a clipped band when
scrolled. The `line` slot therefore uses `width: max-content` + `min-width: 100%`
so every line is at least as wide as the scrollable content and the band spans
the full width.

**Accessibility (v1 = visual only)**: the highlight is a decorative emphasis. A
semantic conveyance was considered and deferred — `aria-current` is defined for a
single "current" item and reads awkwardly across multiple highlighted lines, and
injecting per-line visually-hidden text is noisy for screen-reader users moving
through code. This matches prevailing practice (Shiki, Prism line-highlight,
GitHub blob view all highlight visually only). Consumers needing semantic
emphasis can describe it through the region's `aria-label`.

**Scope**: a flat `number[]` of discrete lines. Ranges (`[[43, 45]]`) are
deferred until there is a concrete use case; the `line` slot reserves the seam.

## Risks / Trade-offs

- **Bundle size of prism-react-renderer** → Verified against the 5% relative
  bundle-size CI gate during finalize; tree-shaking keeps it out of consumers who
  don't import `CodeBlock`. If the gate fails, revisit lazy-loading the
  highlighter chunk.
- **Unconditional `tabIndex={0}` on `<pre>`** → Adds a tab stop even when the code
  does not overflow (slight focus noise, mainly in Safari which doesn't
  auto-focus scroll regions). Accepted for v1 simplicity. Future refinement:
  detect actual overflow via `ResizeObserver`/ref and apply `tabIndex` only when
  overflowing.
- **`prism-react-renderer` `sideEffects: true`** → Individual languages are not
  separately tree-shakeable; the prism core is a single payload. Accepted because
  the bundled language set is exactly the target audience's needs.
- **Highlight fidelity** → prism-react-renderer's token granularity is coarser
  than Shiki's TextMate-grammar output. Accepted trade-off for bundle size, sync
  rendering, and XSS safety.
- **Copy in non-secure contexts** → `navigator.clipboard` is unavailable on
  insecure origins; `react-use`'s `useCopyToClipboard` reports an error state. The
  component announces success only on actual success and still renders fine.

## Migration Plan

Additive only — no migration. New component, new dependency, new recipe
registration, new barrel export. Rollback = revert the change; nothing else
depends on it. After adding `code-block.i18n.ts`, run `pnpm extract-intl`
(CI build-breaker if skipped). Run `build-theme-typings` before typecheck for the
new recipe.

## Open Questions

- Should a `wrap`/word-wrap option ship soon after v1? (Slots reserve room; not
  in v1 scope.)
- Should copy success use a tooltip in addition to the live region? (v1 uses
  icon swap + live region; revisit with design.)
