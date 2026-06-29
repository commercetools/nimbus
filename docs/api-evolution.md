# API Evolution: Versioning, Deprecation & Breaking Changes

Nimbus is consumed by other teams. The whole job of this document is the hard
part: **moving fast without breaking consumers.** It defines what the public API
is, how it's versioned, how to change it additively, and — when you truly must
break something — how to do it safely.

[← Back to Component Guidelines](./component-guidelines.md)

Related: [Changeset Conventions](./changeset-conventions.md) (how to write the
release note + the bump-type table) ·
[Public API Prop Naming](./naming-conventions.md#public-api-prop-naming-consumer-contract)
· Component Lifecycle States (ADR-0003, in the docs app).

## The public API surface (what consumers depend on)

A change is "breaking" only relative to the **public** surface. That surface is:

- **Exported components** from `@commercetools/nimbus` (and the published
  packages) and their compound parts (`Component.Part`).
- **Documented props** on those components, and their accepted value types.
- **Exported TypeScript types** (`{Component}Props`, etc.).
- **Design tokens** exported from `@commercetools/nimbus-tokens`.

NOT part of the contract (change freely): internal file structure, slot/recipe
implementation, `data-slot`/class names, non-exported types, and anything not
reachable from a package entry point.

## Versioning

- The published packages — `@commercetools/nimbus`, `-tokens`, `-icons`, `-mcp`,
  `-design-token-ts-plugin` — are **version-locked** (a `fixed` group in
  `.changeset/config.json`): they always share one version and bump together.
- The library is **post-1.0** (currently `3.x`), so standard semver applies:
  **major** = breaking, **minor** = additive, **patch** = fix. The precise
  definition of each lives in the
  [Changeset bump-type table](./changeset-conventions.md#bump-type) — that table
  is the source of truth; don't restate it elsewhere.
- Releases are automated by **changesets** (`.github/workflows/release.yml`):
  merged changesets accumulate on a "Version Packages" PR; merging it publishes
  to npm (OIDC trusted publishing) and creates GitHub releases. Per-PR `canary`
  snapshots are available for pre-release testing.
- **Every consumer-affecting PR needs a changeset.** No changeset ⇒ no release
  note ⇒ silent change. See [Changeset Conventions](./changeset-conventions.md).

## Additive-first: the default that keeps you fast

Most evolution should never reach a consumer as a break. Prefer, in order:

1. **Add** a new optional prop / variant / component (minor). Default it to the
   current behavior so existing usage is untouched.
2. **Widen** a type (make a prop optional, accept more values) — additive
   (minor).
3. **Deprecate** the old shape while keeping it working (minor) — see below.
4. **Remove** the deprecated shape — breaking, major only — see below.

If you can express the change as steps 1–3, you do not need a major. Reserve
breaking changes for when carrying the old behavior is genuinely untenable.

## Deprecating a prop or component

This is how you change direction without breaking anyone. The established
pattern in this codebase (`button.types.ts`, `money-input.types.ts`):

1. **Keep the old prop working** — leave it in the props type (often grouped,
   e.g. `NativePropsWithAriaEquivalents`) so existing code still compiles and
   behaves the same.
2. **Add a `@deprecated` JSDoc tag that names the replacement and why**, so it
   shows up struck-through in consumers' editors:
   ```ts
   /**
    * @deprecated Use `onPress` instead — it provides unified press handling
    * across mouse, touch, and keyboard.
    */
   onClick?: ...;
   ```
3. **Ship it as a `minor`** with a changeset that tells consumers what to
   migrate to.
4. **Remove only in a future major**, with a migration note (below).

Notes:

- Today, deprecations are **type-level** (`@deprecated` JSDoc). A runtime
  dev-only warning is optional and encouraged for high-traffic props, per the
  Component Lifecycle States ADR (ADR-0003) — but is not yet a shipped
  convention, so don't assume one exists.
- The same applies to a whole component: mark it `@deprecated` with the
  successor, keep it exported until the next major.

## Breaking changes (major) — the last resort

A change is breaking if a consumer must edit working code to upgrade (removed or
renamed export/prop, narrowed type, newly-required prop, changed default that
alters output, raised peer-dependency floor). When one is unavoidable:

1. **Deprecate first** in a prior minor whenever possible (give consumers a
   window where both old and new work).
2. **Bump `major`** and write the changeset as a migration instruction, not a
   changelog line — say exactly what to change. See
   [Changeset Conventions → Migration notes](./changeset-conventions.md#what-to-include).
3. **Add a migration guide** for anything beyond a trivial rename (see below).

## Migration guides

For a major with non-trivial consumer impact, add a guide under
`docs/migrations/`, named `{from}-to-{to}.md` (e.g. `3-to-4.md` for a v3 → v4
major):

- What changed and **why** (one short paragraph).
- A **before → after** code example per breaking item.
- A find-and-replace / checklist a consumer can follow mechanically.

Link it from the major changeset. Keep it consumer-facing — no internal
rationale. (The `@commercetools/uikit → nimbus` mapping in the MCP server is a
separate, org-internal migration aid, not an intra-Nimbus version guide.)

## Quick decision guide

| You are…                                          | Bump  | Extra requirement                           |
| ------------------------------------------------- | ----- | ------------------------------------------- |
| Adding an optional prop / variant / component     | minor | changeset                                   |
| Making a required prop optional / widening a type | minor | changeset                                   |
| Replacing a prop with a better one                | minor | keep old + `@deprecated`; changeset         |
| Removing a previously-deprecated prop/component   | major | migration note (+ guide if non-trivial)     |
| Renaming/removing an export, narrowing a type     | major | deprecate first if possible; migration note |
| Fixing a bug with no API change                   | patch | changeset                                   |
