# Changeset Conventions

Changesets are **release notes for package consumers**. They land in the
published `CHANGELOG.md` and are read by developers upgrading the package, not
by internal reviewers of the PR.

## Audience

The reader is a developer integrating or upgrading `@commercetools/nimbus` (or
another workspace package). They want to know:

- What new features they can adopt
- What previously-broken behavior is now fixed
- What observable behavior changed (and whether they need to act)

They do **not** want a play-by-play of how the change was implemented.

## What to include

- **Features added** — new components, new props, new variants, new behaviors a
  consumer can opt into.
- **Bug fixes** — observable misbehavior that no longer happens. Describe the
  symptom, not the patch.
- **Behavior changes** — anything an existing consumer might notice rendering or
  behaving differently after upgrade.
- **Type contract changes** — props that became optional, types that were
  widened or narrowed, in terms of what the consumer can now write.
- **Migration notes** — when a change requires the consumer to act, say what to
  do (and link to docs if longer guidance is needed).

## What to skip

Implementation details belong in the PR description and the commit history. Keep
them out of the changeset. In particular, skip:

- Algorithm names and technical mechanics ("codepoint-safe", "trim-aware",
  "regex fix", "memoization")
- Internal type names, internal module structure, build-script changes
- Refactors that don't change observable behavior
- Test additions or coverage improvements
- Tooling or CI changes that don't affect consumers
- Incidental fixes to internal scripts — if the consumer-visible effect is worth
  mentioning (e.g., a component's TypeScript type now exposes previously-missing
  keys), describe **that** effect in one line; otherwise drop it entirely

If a piece of information has no effect on what a consumer sees, types, or runs,
it does not belong in the changeset.

## Format

Standard `changesets` frontmatter followed by a short, consumer-focused summary:

```md
---
"@commercetools/nimbus": minor
---

`Avatar`: `firstName` and `lastName` are now optional. Avatars with missing or
partial names render a generic person icon and a localized accessible label.

Names with leading/trailing whitespace and emoji or non-Latin characters now
produce correct initials.
```

Guidelines for the summary body:

- Lead with the component or feature name in backticks (e.g., `` `Avatar`:``,
  `` `Pagination`:``).
- One bullet per consumer-observable change. Multiple bullets are fine when a
  single changeset covers multiple unrelated improvements.
- Keep each bullet to one or two short sentences. Link to the docs site for
  anything longer.
- When a single changeset spans multiple components, group the bullets under
  per-component subheaders.

## Bump type

- **patch** — bug fix only. No API changes, no new behavior, no new exports.
- **minor** — new feature, new prop, new component, relaxed (widened) type
  contract, or any additive behavior change.
- **major** — breaking change: removed or renamed export, narrowed type, changed
  required props, raised peer-dependency version, or any change that requires
  consumer code edits to keep working.

When in doubt between `patch` and `minor`, prefer `minor` — it costs the
consumer nothing and signals the change clearly.
