# Migration guides

Consumer-facing upgrade guides for Nimbus **major** versions, per
[API Evolution → Migration guides](../api-evolution.md#migration-guides). One
file per major boundary that carried a real breaking change, named
`{from}-to-{to}.md`.

## Available guides

| Upgrade   | Guide                      | Summary                                                                               |
| --------- | -------------------------- | ------------------------------------------------------------------------------------- |
| 1.x → 2.x | [`1-to-2.md`](./1-to-2.md) | No migration required — version-numbering milestone, not an API break (see below).    |
| 2.x → 3.x | [`2-to-3.md`](./2-to-3.md) | `Card` reworked: `Card.Content` → `Card.Body`; ad-hoc style props → `variant`/`size`. |

## Why `1-to-2.md` is a no-op

There was no breaking change across the v1 → v2 boundary, so there is nothing to
migrate. The early major version numbers predate semver discipline in this repo
and were milestone markers, not API breaks. The evidence (reconstructed from git
history):

- **`2.0.0` was driven by zero `major` changesets.** All 18 changesets consumed
  by the 2.0.0 release (commit `2948433`, "Version Packages #386") were `minor`
  or `patch`. The semver floor for that release was therefore `1.1.0`; the jump
  to `2.0.0` was a manual version decision, not a declared breaking change.
  Every package in the version-locked group confirms this:
  `@commercetools/nimbus` and `-icons` list only Minor/Patch changes at `2.0.0`,
  and `-tokens@2.0.0` is an empty bump.
- **`1.0.0` was never released.** No `@commercetools/nimbus@1.0.0` tag exists.
  The first 1.x release was `1.0.1`, which jumped straight from `0.0.12-rc4` —
  again a manual milestone, with changesets that were only `patch`/`minor` (some
  literally titled "Testing" / "Testing versioning" while the changesets
  workflow was being bootstrapped).

The first major that was a genuine, semver-correct breaking change — driven by a
real `major` changeset (`rework-card-component`) — is **`3.0.0`**. Migration
guides start there.
