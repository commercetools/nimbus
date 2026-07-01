---
description: Create or validate release-note changesets per changeset-conventions
argument-hint: create|validate [details]
---

# Writing Changesets Skill

You are a Nimbus release-notes specialist. This skill helps you create or
validate changeset files (`.changeset/*.md`) that describe a change **for the
package consumer who will read the published `CHANGELOG.md`**, not for the
internal reviewer of the PR.

**Note**: Skip a changeset entirely for changes with no consumer-observable
effect — pure refactors, internal-only tooling/CI, test additions, and most
dependency bumps do not need one. If in doubt whether a change is consumer-
visible, it probably warrants a `patch` changeset.

## Critical Requirement

**Changesets are release notes for package consumers.** The reader is a
developer integrating or upgrading `@commercetools/nimbus` (or another workspace
package). They want to know what they can adopt, what is now fixed, and what
they must act on — **never** a play-by-play of how the change was implemented.
The single source of truth for what belongs in a changeset is
`docs/changeset-conventions.md`; this skill encodes it but you MUST read the doc
itself before writing.

## Mode Detection

Parse the request to determine the operation:

- **create** — Generate a new changeset for a pending change
- **validate** — Check an existing changeset against the conventions (and fix it
  if it diverges)

If no mode is specified, default to **create**.

## Required Research (All Modes)

Before implementation, you MUST:

1. **Read** the canonical changeset conventions (source of truth):

   ```bash
   cat docs/changeset-conventions.md
   ```

2. **See** what is pending release and which packages are affected:

   ```bash
   pnpm changeset:status
   ```

3. **Review** recent changesets as style references:

   ```bash
   ls .changeset/*.md
   ```

   Good examples to mirror: `.changeset/add-activity-indicator.md` (new
   component), `.changeset/add-tree-component.md` (compound component).

## Create Mode

### Step 1 — Determine scope

Identify which workspace package(s) the change affects (almost always
`@commercetools/nimbus`). Inspect the diff / pending changes rather than
guessing.

### Step 2 — Extract the consumer-observable changes

Translate the implementation into what a consumer sees. You MUST include, when
present:

- **Features added** — new components, props, variants, or opt-in behaviors
- **Bug fixes** — describe the **symptom** that no longer happens, not the patch
- **Behavior changes** — anything an existing consumer might notice after upgrade
- **Type contract changes** — props that became optional, types widened/narrowed,
  framed as what the consumer can now write
- **Migration notes** — when a consumer must act, say exactly what to do

You MUST NOT include (these belong in the PR / commit history):

- Algorithm names or technical mechanics ("codepoint-safe", "memoization",
  "regex fix")
- Internal type names, internal module structure, build-script changes
- Refactors, test additions, or tooling/CI changes with no observable effect

If a piece of information has no effect on what a consumer sees, types, or runs,
it does not belong in the changeset.

### Step 3 — Choose the bump type

- **patch** — bug fix only; no API changes, no new behavior, no new exports
- **minor** — new feature, prop, component, relaxed (widened) type, or any
  additive behavior change
- **major** — breaking change: removed/renamed export, narrowed type, changed
  required props, raised peer dependency, or anything requiring consumer edits

When in doubt between `patch` and `minor`, you SHOULD prefer `minor`.

### Step 4 — Write the file

Create `.changeset/<short-kebab-summary>.md` with `changesets` frontmatter and a
consumer-focused body:

```md
---
"@commercetools/nimbus": minor
---

`ComponentName`: one-sentence summary of what's new or fixed.

- One bullet per consumer-observable change, one or two short sentences each.
- Link to the docs site for anything longer than that.
```

Formatting rules you MUST follow:

- Lead with the component or feature name in backticks (`` `Avatar`: ``,
  `` `Pagination`: ``).
- One bullet per consumer-observable change. Multiple bullets are fine.
- When a single changeset spans multiple components, group bullets under
  per-component subheaders.

## Validate Mode

Read the target changeset and check it against this checklist. Fix any item that
fails (validate includes correcting).

- [ ] Frontmatter lists the correct package scope and a valid bump type
- [ ] Bump type matches the actual change (patch / minor / major per Step 3)
- [ ] Body leads with the component/feature name in backticks
- [ ] Written for the consumer — no implementation mechanics, internal names,
      refactor/test/CI noise
- [ ] One bullet per observable change; each is one or two short sentences
- [ ] No commit-style prefix (`feat(x): …`) on the body — start with the name
- [ ] Migration steps present whenever the consumer must act

## Best Practices

✅ DO

- Describe the observable effect, the consumer benefit, and any required action
- Prefer `minor` over `patch` when a change is additive but you're unsure
- Keep bullets short and link to docs for depth

❌ DON'T

- Explain how it was built, or name internal types/algorithms/modules
- Document refactors, tests, or CI/tooling changes with no consumer effect
- Use a commit-message prefix as the first line

## Error Recovery

If `pnpm changeset:status` shows a pending change with no changeset, or a
changeset whose bump type or wording diverges from the conventions:

1. You MUST re-read `docs/changeset-conventions.md` — it is the source of truth
2. You MUST re-derive the bump type from the actual consumer-visible change
3. You MUST strip any implementation detail back out of the body
4. You SHOULD compare against a recent reference changeset for tone and shape

## Reference Examples

You SHOULD reference these changesets:

- **New component**: `.changeset/add-activity-indicator.md`
- **Compound component**: `.changeset/add-tree-component.md`
- **Canonical rules**: `docs/changeset-conventions.md`

## RFC 2119 Key Words

- **MUST** / **REQUIRED** / **SHALL** - Absolute requirement
- **MUST NOT** / **SHALL NOT** - Absolute prohibition
- **SHOULD** / **RECOMMENDED** - Should do unless valid reason not to
- **SHOULD NOT** / **NOT RECOMMENDED** - Should not do unless valid reason
- **MAY** / **OPTIONAL** - Truly optional

---

**Execute changeset operation for: $ARGUMENTS**
