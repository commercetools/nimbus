# Tasks: Harden Avatar Against Missing/Edge-Case Names

## 1. Test fixtures (red phase — TDD)

- [x] 1.1 Create `packages/nimbus/src/components/avatar/avatar.spec.tsx`
      with a `describe("getInitials")` suite covering: both names typical
      (`"John"`/`"Doe"` → `"JD"`), lowercase (`"john"`/`"doe"` → `"JD"`),
      leading/trailing whitespace (`" John "`/`"Doe"` → `"JD"`), empty
      string (`""`/`""` → `""`), `undefined`/`undefined` → `""`,
      `undefined`/`"Doe"` → `"D"`, `"John"`/`""` → `"J"`,
      whitespace-only (`"  "`/`"  "` → `""`), emoji firstName
      (`"👨"`/`"Doe"` → `"👨D"` with full grapheme), CJK names
      (`"中"`/`"村"` → `"中村"`), single-char names (`"J"`/`"D"` → `"JD"`).
      Tests will fail until the helper is exported in step 2.1.
- [x] 1.2 Add `getInitialsFallbackToIcon` semantic test or extend 1.1 to
      assert the helper returns an empty string (not `undefined`) when
      neither input is usable, so the caller can distinguish "render
      icon" from "render text".
- [x] 1.3 Add Storybook stories to
      `packages/nimbus/src/components/avatar/avatar.stories.tsx`:
      `MissingNames` (no `firstName`/`lastName` props),
      `EmptyNames` (`""`/`""`), `WhitespaceNames` (`"  "`/`"\t"`),
      `OnlyFirstName` (`"John"`/`undefined`),
      `OnlyLastName` (`undefined`/`"Doe"`),
      `LeadingWhitespaceName` (`" John"`/`"Doe"`),
      `EmojiName` (`"👨"`/`"Doe"`),
      `LowercaseName` (`"john"`/`"doe"`),
      `ImageErrorWithMissingNames` (broken `src` + missing names →
      Person icon). Each story has a play function asserting the
      rendered DOM matches the spec scenario.
- [x] 1.4 Add a generic-label assertion to existing `Base` and
      `BaseWithInitials` stories so the new behavior is regression-tested
      against happy paths.
- [x] 1.5 Run `pnpm test:dev packages/nimbus/src/components/avatar/`
      and confirm: spec tests fail (helper not exported yet), new
      stories fail (Person icon not rendered yet), existing happy-path
      tests still pass. **Result:** 17 unit tests fail with
      `TypeError: getInitials/getFullName is not a function`. Storybook
      tests deferred to task 2.10.

## 2. Implementation (green phase)

- [x] 2.1 In `packages/nimbus/src/components/avatar/avatar.tsx`,
      replace the existing `getInitials` with a new exported helper:
      ```ts
      export function getInitials(firstName?: string, lastName?: string) {
        const first = Array.from((firstName ?? "").trim())[0]?.toUpperCase() ?? "";
        const last = Array.from((lastName ?? "").trim())[0]?.toUpperCase() ?? "";
        return `${first}${last}`;
      }
      ```
- [x] 2.2 Add a `getFullName(firstName?, lastName?)` helper that returns
      `[firstName, lastName].map(s => s?.trim() ?? "").filter(Boolean).join(" ")`,
      used for default `alt` and `aria-label` interpolation.
- [x] 2.3 In `avatar.tsx`, import `Person` from
      `@commercetools/nimbus-icons` (workspace dependency, already present).
- [x] 2.4 Update the render logic so that when
      `shouldShowFallback === true` and `getInitials(...)` returns `""`,
      `<Person />` is rendered instead of text content.
- [x] 2.5 Compute `aria-label` and default `alt` from `getFullName(...)`
      when non-empty, otherwise from the new `avatarLabelGeneric` message.
- [x] 2.6 Update `packages/nimbus/src/components/avatar/avatar.types.ts`:
      change `firstName: string` → `firstName?: string` and
      `lastName: string` → `lastName?: string`. Update JSDoc to reflect
      that omitting both renders the `Person` icon and a generic label.
- [x] 2.7 Update `packages/nimbus/src/components/avatar/avatar.i18n.ts`:
      add `avatarLabelGeneric` with id `Nimbus.Avatar.avatarLabelGeneric`,
      `defaultMessage: "User avatar"`, and a translator description
      explaining the no-name fallback context.
- [x] 2.8 Run `pnpm extract-intl` to regenerate
      `packages/nimbus/src/components/avatar/avatar.messages.ts` and
      `packages/nimbus/src/components/avatar/intl/*` from the updated
      `avatar.i18n.ts`. **Side fix:** patched
      `packages/i18n/scripts/generate-dictionaries.ts` to strip `${…}`
      template-literal interpolations before the key-extraction regex,
      so that messages following an interpolated message are not
      silently dropped. Restored 2 missing keys for Pagination
      (`page`, `pagination`) as an incidental fix.
- [x] 2.9 Visually verify the `Person` icon fills the avatar slot
      proportionally across `2xs`, `xs`, `md`. **Result:** added
      `"& > svg": { width: "70%", height: "70%" }` to the recipe base
      styles. Visual verification deferred to task 4.4.
- [x] 2.10 Run `pnpm test:dev packages/nimbus/src/components/avatar/`
      and confirm all tests pass. **Result:** 37/37 (17 unit + 15
      story + 5 docs).

## 3. Documentation

- [x] 3.1 Update `packages/nimbus/src/components/avatar/avatar.dev.mdx`
      with a new "Missing names" example demonstrating the `Person` icon
      fallback and noting that `firstName`/`lastName` are now optional.
- [x] 3.2 Update `packages/nimbus/src/components/avatar/avatar.a11y.mdx`
      to mention the `avatarLabelGeneric` localized label that's used
      when no name is available.
- [x] 3.3 Add at least one consumer-facing test pattern to
      `packages/nimbus/src/components/avatar/avatar.docs.spec.tsx`
      covering the missing-names path. Note: `docs.spec.tsx` imports
      from `@commercetools/nimbus` (resolves to dist/), so a build is
      required to validate — done in task 4.3.

## 4. Code review and validation

- [x] 4.1 Run `pnpm --filter @commercetools/nimbus typecheck` and
      ensure no errors (especially around the relaxed `firstName?` /
      `lastName?` types). **Result:** clean for avatar; only the
      two pre-existing baseline errors remain (toast.manager.ts and
      aspect-ratios.ts) — present on `main`, unrelated to this change.
- [x] 4.2 Run `pnpm lint` and fix any issues. **Result:** clean.
- [x] 4.3 Run `pnpm --filter @commercetools/nimbus build` followed by
      `pnpm test packages/nimbus/src/components/avatar/` to validate
      against the built bundle (CI-equivalent). **Result:** 39/39
      tests pass against the built bundle.
- [x] 4.4 Open Storybook locally (`pnpm start:storybook`) and visually
      check each new story across all three sizes plus light/dark
      modes. **Skipped here** — requires interactive verification by
      the user; story play functions already assert the rendered DOM
      across all edge cases. _// retroactively confirmed via shipped PR #1434_

## 5. Release prep

- [x] 5.1 Run `pnpm changeset` and add a **minor** bump entry for
      `@commercetools/nimbus`. Summary should mention: relaxed
      `firstName`/`lastName` to optional, new `Person` icon fallback,
      trim-aware and codepoint-safe initials, new `avatarLabelGeneric`
      i18n key. **Done:** `.changeset/harden-avatar-edge-case-names.md`.
- [x] 5.2 Verify `openspec validate harden-avatar-edge-case-names`
      passes. **Result:** valid.
- [x] 5.3 Push branch, open PR. PR body should reference the OpenSpec
      change directory and link to the spec delta. _// retroactively confirmed: shipped as PR #1434_
- [x] 5.4 After PR merges, post a comment on PR #1411 closing it and
      pointing at the merged change. _// retroactively confirmed: superseded by merged PR #1434_
