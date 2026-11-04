# Figma Code Connect CI

Nimbus maps its React components to the components in the NIMBUS design system
Figma file with
[Figma Code Connect](https://developers.figma.com/docs/code-connect/). The
mappings are the `*.figma.tsx` files in `packages/nimbus/src/components/`. Figma
Dev Mode and the Figma MCP server show the code from these mappings, but only
after the mappings are published to Figma.

The workflow
[`.github/workflows/code-connect.yml`](../.github/workflows/code-connect.yml)
publishes the mappings after a merge to `main` and checks them on pull requests.
This page explains when it runs, the token it needs, how to renew the token, and
how to publish or remove mappings by hand. The YAML comments are short and point
here.

> **Creating or changing a mapping?** Use the `nimbus-code-connect` skill
> (`.claude/skills/nimbus-code-connect/SKILL.md`). This page is only about
> publishing.

## When it runs

| Event                                                                  | Job        | What it does                                                 |
| ---------------------------------------------------------------------- | ---------- | ------------------------------------------------------------ |
| Pull request that changes a `*.figma.tsx` file or `figma.config.json`  | `validate` | `figma connect publish --dry-run`: checks, publishes nothing |
| Push to `main` that changes one of these files (a merged pull request) | `publish`  | `figma connect publish`: publishes all mappings              |
| Manual start on `main` (`workflow_dispatch`)                           | `publish`  | Same as above, whatever files changed                        |

Changes to other files do not start the workflow. The `paths` filter is
`packages/nimbus/src/components/**/*.figma.tsx` and `figma.config.json`. This
also leaves out the component files that a mapping imports. Build and Test
type-checks the mappings (`pnpm typecheck:strict` includes the `*.figma.tsx`
files), so a change that breaks an import in a mapping fails there.

Both jobs:

1. Install dependencies with `pnpm install --frozen-lockfile`. They do not build
   the packages, because the CLI reads the TypeScript source.
2. Check the token (see [The token check](#the-token-check)).
3. Run the Figma CLI, the root devDependency `@figma/code-connect`, with
   `--exit-on-unreadable-files` (a file that cannot be parsed fails the job) and
   `--skip-update-check`.

The CLI validates every mapping against the Figma file before it uploads. If
validation fails, the job fails and nothing is published.

A publish checks out the current `main`, not the commit that started the run,
and sends all its mappings, not only the changed ones. Without this, a re-run of
an older failed run would put older mappings back in Figma: a re-run uses "the
same `GITHUB_SHA` (commit SHA) and `GITHUB_REF` (git ref) of the original event"
([GitHub docs](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs)).
Two publish runs never run at the same time (concurrency group
`code-connect-publish`): a newer run waits until the running one has finished.
If a third run starts while one is waiting, GitHub cancels the waiting run and
the newest run takes its place
([GitHub docs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)).

### Do not make `validate` a required check

When the `paths` filter skips the workflow, GitHub keeps a required check in the
"Pending" state, and "a pull request that requires those checks to be successful
will be blocked from merging"
([GitHub docs](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)).
Most pull requests do not change a `*.figma.tsx` file, so a required `validate`
check would block them.

## Pull requests from forks

GitHub does not pass repository secrets to workflows started from a fork. For a
pull request from a fork, `validate` ends successfully without calling Figma and
shows this notice:

> Code Connect validation skipped: pull requests from forks get no repository
> secrets. A maintainer can run the check after merge, or re-run it from a
> branch in this repository.

To check the change before merge, a maintainer pushes the fork's branch to this
repository and opens a pull request from there. After merge, the `publish` job
validates the mappings again and fails if one is invalid.

## The token: `FIGMA_ACCESS_TOKEN`

| What        | Value                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------- |
| Secret      | Repository secret `FIGMA_ACCESS_TOKEN` (Settings → Secrets and variables → Actions)       |
| Token type  | Personal access token, created only for CI                                                |
| Scopes      | Code Connect: Write (`file_code_connect:write`), File content: Read (`file_content:read`) |
| Lifetime    | At most 90 days (Figma: "Max expiration of 90 days")                                      |
| **Expires** | **2027-01-24** (created 2026-10-26). Update this line every time the token is renewed.    |

It is a repository secret and not an environment secret, because both jobs need
it, including the dry run on pull requests. It is a token created only for CI,
so renewing or revoking a developer's own token does not break CI. The token is
passed only to the token check and the CLI step, never to `pnpm install`, and it
is never printed.

### The token check

Before the CLI runs, each job sends one read request to the Figma file
(`GET /v1/files/AvtPX6g7OGGCRvNlatGOIY/nodes?ids=67:549&depth=1`, the Button
component set). The CLI's validation calls the same endpoint. The job prints
only the HTTP status and Figma's error text, never the response body. Both jobs
use the same check, the composite action
[`.github/actions/check-figma-token`](../.github/actions/check-figma-token/action.yml),
which is also where the file key and node are set.

| Error in the job                                                        | Cause                                                            | What to do                                                          |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| `FIGMA_ACCESS_TOKEN is not set. …`                                      | The secret is missing or empty                                   | Add the secret (see [Renew the token](#renew-the-token))            |
| `FIGMA_ACCESS_TOKEN was rejected by Figma (HTTP 403: Token expired). …` | The token has expired                                            | [Renew the token](#renew-the-token)                                 |
| `FIGMA_ACCESS_TOKEN was rejected by Figma (HTTP 403: Invalid token). …` | The token was revoked, or the value is wrong                     | [Renew the token](#renew-the-token)                                 |
| `Figma could not find the file used for the token check (HTTP 404 …`    | The file key is wrong, or the token's owner cannot open the file | Check the file key in the action and the owner's access to the file |
| `Figma did not answer the token check (HTTP …). …`                      | Network error, HTTP 429 or 5xx                                   | Re-run the job later. The token is not the problem.                 |

### Renew the token

You need access to the NIMBUS design system file in Figma and admin access to
this repository (to change secrets).

1. In Figma, open the account menu in the top-left corner of the file browser
   and select **Settings** → **Security**.
2. In **Personal access tokens**, click **Generate new token**. Use a name that
   says what it is for, for example `nimbus-ci-code-connect`. Select the longest
   expiration and the scopes **Code Connect: Write** and **File content: Read**.
   Copy the token: Figma shows it only once.
3. In GitHub, open **Settings → Secrets and variables → Actions**, and update
   the repository secret `FIGMA_ACCESS_TOKEN` with the new token.
4. Start the workflow by hand on `main` (see
   [Publish by hand](#publish-by-hand)). The token check must pass.
5. Revoke the old token in Figma (**Settings → Security**).
6. Update the **Expires** line in the table above in a pull request, and set a
   reminder for one week before the new date.

Figma recommends a plan access token for CI: "For CI we recommend a Plan Access
Token (PLANT) rather than a Personal Access Token (PAT)"
([Figma docs](https://developers.figma.com/docs/code-connect/ci-cd/)). A plan
token can last up to 365 days, and a Figma organization admin creates it. When
you switch, only the secret value changes. Check that the token check passes
with the new token: Figma says that Figma CLI tokens "aren't general-purpose
REST API tokens"
([Figma docs](https://developers.figma.com/docs/rest-api/plan-access-tokens/)).
The CLI's validation calls the same endpoint as the token check, so it should
pass, but this is not verified yet.

## Publish by hand

To publish what is on `main`, for example after renewing the token, start the
workflow by hand:

- GitHub: **Actions → Figma Code Connect → Run workflow**, branch `main`.
- CLI: `gh workflow run code-connect.yml --ref main`

On any other branch, the `publish` job is skipped, so only `main` is ever
published from CI.

To test a mapping in Figma before merge, you can publish from your local
checkout. The CLI reads `FIGMA_ACCESS_TOKEN` from the environment or from a
`.env` file in the repository root (see `.env.template`):

```bash
# Check only, publishes nothing
pnpm exec figma connect publish --dry-run --exit-on-unreadable-files

# Publish
pnpm exec figma connect publish --exit-on-unreadable-files
```

A local publish changes what Figma shows for everyone. After the test, start the
workflow by hand on `main` to publish the state of `main` again. It is not
verified whether this removes mappings that exist only on your branch (see
[Remove a mapping](#remove-a-mapping)).

## When Figma rejects a mapping

Figma can accept the upload request but reject single mappings. The CLI then
only logs the rejected mappings and exits with code 0. The "Publish Code
Connect" step therefore searches the CLI log for these lines and fails with
"Figma rejected some Code Connect mappings":

- `Failed to upload to Figma, for React:` followed by the rejected mappings and
  the reason.
- `already have UI-created Code Connect mappings in Figma`: someone connected
  the component in the Figma UI. The CLI then suggests to "Re-run with --force
  to overwrite the existing UI-created mappings": publish once by hand from
  `main` with `--force`.

The other mappings in the same run are published. The search uses the log text
of `@figma/code-connect` 1.5.3. When you upgrade the CLI, check that these lines
still exist in its `dist/connect/upload.js`. If they change, the step passes
again when Figma rejects a mapping.

## Remove a mapping

It is not verified yet whether a publish removes the mapping of a deleted
`*.figma.tsx` file. To remove a mapping by hand:

```bash
pnpm exec figma connect unpublish --node "<Figma node URL>" --label React
```

The node URL is the URL in the deleted `figma.connect(...)` call (see the git
history). All Nimbus mappings use the label `React`.

## Related files

- `.github/workflows/code-connect.yml`: the workflow.
- `.github/actions/check-figma-token/action.yml`: the token check, used by both
  jobs.
- `figma.config.json`: which files the CLI parses (`include`), and how imports
  are written in the snippets (`importPaths`).
- `packages/nimbus/src/components/**/*.figma.tsx`: the mappings.
- `.claude/skills/nimbus-code-connect/SKILL.md`: generates the mappings.
