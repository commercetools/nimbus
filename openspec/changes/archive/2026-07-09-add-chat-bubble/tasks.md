# Tasks: Add ChatBubble component

> **Note:** the base component shipped in commit `d2a6636f7` (FEC-987). This
> change retroactively specs it and folds in the follow-up hardening from a
> three-reviewer pass. Tasks already satisfied by the initial commit are marked
> done; the follow-up work is grouped in §4.

## 1. Scaffolding and registration

- [x] 1.1 Create `packages/nimbus/src/components/chat-bubble/` with the compound
      file layout: `chat-bubble.tsx` (compound object), `chat-bubble.types.ts`,
      `chat-bubble.recipe.ts`, `chat-bubble.slots.tsx`,
      `chat-bubble.stories.tsx`, `chat-bubble.figma.tsx`, `index.ts`, and
      `components/` with one file per part.
- [x] 1.2 Register the slot recipe as `nimbusChatBubble` in
      `packages/nimbus/src/theme/slot-recipes/index.ts`.
- [x] 1.3 Export from the package barrel
      (`packages/nimbus/src/components/index.ts`).

## 2. Types (four-layer)

- [x] 2.1 Recipe props (`sender`, `tone`) via
      `SlotRecipeProps<"nimbusChatBubble">`.
- [x] 2.2 Slot props per part (`root`, `avatar`, `bubble`, `actions`, `footer`,
      `typing`).
- [x] 2.3 Public part props with JSDoc; `data-${string}` index-signature parity
      across parts; `isStreaming` on Root.

## 3. Slot recipe and parts

- [x] 3.1 CSS Grid `Root` with `sender` column-swap; footer aligned under the
      bubble column.
- [x] 3.2 `Avatar` wraps Nimbus `Avatar` (`2xs`), colored per sender.
- [x] 3.3 `Bubble` dedicated recipe (not reusing `Card`); `Actions` and `Footer`
      layout-only flex rows.
- [x] 3.4 Figma Code Connect mapping (`sender` ← Figma `Sender`).
- [x] 3.5 Stories: user text, agent text, agent + actions, agent + footer,
      agent + Markdown, senders side-by-side.

## 4. Follow-up hardening (this change)

- [x] 4.1 **Overflow fix** — add `minWidth: 0` + `overflowWrap: "anywhere"` +
      `wordBreak: "break-word"` to the `bubble` slot; add an Overflow story
      asserting the bubble does not overflow (`scrollWidth ≤ clientWidth`).
- [x] 4.2 **Extended sender axis** — add `system` (centered, subdued,
      avatar-optional) and `tool` (agent-side, subdued neutral) to the `sender`
      variant; stories for each.
- [x] 4.3 **Error tone** — add an orthogonal `tone` variant (`neutral`/`error`);
      error tints the bubble critical; story for `tone="error"`.
- [x] 4.4 **Streaming** — add `ChatBubble.Typing` (reusing `ActivityIndicator`)
      and `isStreaming` on Root (sets `aria-busy`); Streaming story asserting
      `aria-busy` + a visible affordance.
- [x] 4.5 **Rename `Feedback` → `Footer`** across part/slot/types/recipe/stories
      (and the compound object + underscore exports). Unreleased, so not a
      break.
- [x] 4.6 **Accessibility** — Root renders `<article>` by default (overridable);
      avatar decorative by default (`aria-hidden`) unless named; base `Avatar`
      no longer forces the generic label when hidden; Accessible-log story
      (`role="log"` + named `article`s) passing axe.
- [x] 4.7 **`data-*` typing parity** and **remove/justify** the avatar wrapper
      prop-forwarding (props flow to the inner `Avatar`; documented in a
      comment).
- [x] 4.8 Add the `@see` documentation link to the main JSDoc.

## 5. Documentation

- [x] 5.1 Designer doc `chat-bubble.mdx` (Overview, Resources, Variables).
- [x] 5.2 Engineering doc `chat-bubble.dev.mdx` (Getting started, Usage examples
      incl. streaming + accessible transcript).
- [x] 5.3 Accessibility doc `chat-bubble.a11y.mdx` (article default, sender
      naming, decorative avatar, recommended `role="log"`/`role="feed"`
      composition, `aria-busy`).
- [x] 5.4 Consumer tests `chat-bubble.docs.spec.tsx` (`@docs-section` blocks:
      basic rendering, senders + error tone, actions, footer, markdown,
      streaming, accessible transcript).
- [x] 5.5 Changeset: fold the new API (sender values, `tone`, `Typing`, `Footer`
      rename, `isStreaming`, a11y) into the existing unreleased
      `add-chat-bubble` changeset.

## 6. Validation (blocks shipping)

- [x] 6.1 `pnpm --filter @commercetools/nimbus typecheck:dev` — no errors.
- [x] 6.2 `pnpm test:storybook:dev` for the chat-bubble + avatar stories — all
      play functions pass (incl. axe).
- [x] 6.3 `pnpm test:dev` for `chat-bubble.docs.spec.tsx` — consumer tests pass.
- [x] 6.4 `pnpm lint` — clean.
- [x] 6.5 `openspec validate add-chat-bubble --strict` — proposal + delta spec
      valid; then archive so the spec merges into
      `openspec/specs/nimbus-chat-bubble/spec.md`.
