## Context

- Code Connect mappings live in `packages/nimbus/src/components/**/*.figma.tsx`
  (59 `figma.connect` calls on `main`, 63 with PR #2097). `figma.config.json`
  at the repo root sets the `include` globs. PR #2097 adds `importPaths`, so
  snippets import from `@commercetools/nimbus`.
- The CLI is `@figma/code-connect` 1.5.3, a devDependency. It reads the token
  from `--token` or the `FIGMA_ACCESS_TOKEN` environment variable
  (`dist/commands/connect.js`: `cmd.token ?? process.env.FIGMA_ACCESS_TOKEN`).
  It also loads `.env` from the working directory with dotenv, which does not
  replace a variable that is already set.
- Today, publishing is manual. No workflow in `.github/workflows/` mentions
  Figma. The published state is older than the repo (FEC-1450, cause 1).
- Existing workflows pin actions by commit SHA and share setup through
  `.github/actions/ci` (pnpm, Node 24, `pnpm install`, full package build).
  `build-and-test.yml` runs every PR in a Playwright container.
- Figma's CI guide: "you can specify that you want to publish new files when
  any PR is merged to the main branch", and "For CI we recommend a Plan Access
  Token (PLANT) rather than a Personal Access Token (PAT)"
  (https://developers.figma.com/docs/code-connect/ci-cd/).
- GitHub: "secrets are not passed to the runner when a workflow is triggered
  from a forked repository", and environment secrets "are only available to
  workflow jobs that use the environment"
  (https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions,
  https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).

## Goals / Non-Goals

**Goals:**

- Publish Code Connect to Figma automatically after a relevant merge to `main`.
- Fail a pull request that would publish invalid Code Connect files.
- Make an expired or invalid token obvious, with instructions to fix it.
- Keep the workflow cheap: run only when Code Connect files change.

**Non-Goals:**

- Detecting a valid but wrong Figma node (FEC-1472, point 7).
- Detecting outdated mappings against Figma or code props (FEC-1214).
- Generating `.figma.tsx` files in CI (the generator stays a local tool).
- Creating the plan access token (needs a Figma admin; follow-up).

## Decisions

### 1. One new workflow file, `.github/workflows/code-connect.yml`

Two jobs: `validate` (pull requests) and `publish` (push to `main` and manual
`workflow_dispatch`).

Triggers use a `paths` filter:
`packages/nimbus/src/components/**/*.figma.tsx` and `figma.config.json`. The
config is included because `importPaths` and `include` change what is
published.

`workflow_dispatch` allows a manual publish, for example the first publish
after this lands, or after the token is renewed.

- *Alternative:* add steps to `build-and-test.yml`. **Rejected**, because it
  runs on every PR in a heavy Playwright container, and a Figma outage would
  then block unrelated PRs.
- *Alternative:* publish in `release.yml` after the npm release. **Rejected**:
  Code Connect-only changes (like PR #2097) have no changeset, so they would
  never start a release and never be published. Trade-off accepted: Dev Mode
  can show an API up to about a day before it is on npm (the Version Packages
  PR is merged by the daily `scheduled-release.yml`).

### 2. Light setup: install only, no package build

Steps: checkout, `pnpm/action-setup`, `actions/setup-node` (Node 24, pnpm
cache), `pnpm install --frozen-lockfile`, all pinned to the same SHAs as
`.github/actions/ci`. The CLI parses TypeScript source, so a build should not
be needed.

- *Risk:* parsing could depend on generated files (for example i18n
  `*.messages.ts`). Task 1.1 verifies this on a clean checkout. If parsing
  fails without a build, use the shared `.github/actions/ci` action instead
  (slower, but proven).
- *Verified (task 1.1):* on a clean shallow checkout made like
  `actions/checkout` does it, with `pnpm install --frozen-lockfile` and no
  build, the dry run with the files from PR #2097 passes: 62 docs, about 30
  seconds. The CLI parses all files on `main` too, but validation fails there:
  DropZone points at node `0-0` (the whole document), and the CLI stops with
  "Failed to to fetch node info: Error: Cannot create a string longer than
  0x1fffffe8 characters". PR #2097 fixes this node, so it must be merged
  before the first publish (Migration Plan).
- The CLI builds the source links from the git remote and `git branch -r`
  (`dist/connect/project.js`, fallback `master`). The refs that
  `actions/checkout` creates on `main` give
  `https://github.com/commercetools/nimbus/blob/main/...` (checked with
  `figma connect parse`).

### 3. Token check as the first step of both jobs

A shell step calls `GET https://api.figma.com/v1/files/AvtPX6g7OGGCRvNlatGOIY/nodes?ids=67:549&depth=1`
(the Button component set; with `depth=1` the response is about 430 KB instead
of 1.2 MB) with the header `X-Figma-Token: $FIGMA_ACCESS_TOKEN`. Figma's docs
say this endpoint "requires the `file_content:read` scope"
(https://developers.figma.com/docs/rest-api/file-endpoints/). The CLI's
validation calls the same endpoint (`dist/connect/validation.js`), so a token
that passes the check can also be validated by the CLI.

Answers recorded in task 1.2: a valid token gets HTTP 200; an expired token
gets HTTP 403 with `err` "Token expired"; an invalid or empty token gets HTTP
403 with `err` "Invalid token". Figma documents 403 as "The developer / OAuth
token is invalid or expired".

- If the secret is empty: fail with "FIGMA_ACCESS_TOKEN is not set. Add it as
  a repository secret (Settings → Secrets and variables → Actions)."
- If Figma does not answer (network error, HTTP 429 or 5xx): fail with "Figma
  did not answer the token check (HTTP <code>: <err>). This is not a token
  problem. Re-run the job later." A Figma outage must not make someone replace
  a valid token.
- For any other status that is not 200: read Figma's `err` field from the JSON
  body with `jq`, and fail with:
  "FIGMA_ACCESS_TOKEN was rejected by Figma (HTTP <code>: <err>). Create a new
  token in Figma → Settings → Security → Personal access tokens (scopes: Code
  Connect: Write, File content: Read) and update the repository secret
  FIGMA_ACCESS_TOKEN. Long-term: ask a Figma admin for a plan access token."
- The message is written as a `::error::` annotation, so it appears in the PR
  checks summary.
- The token is passed through `env`, never echoed, and only to the token check
  and the CLI step (not to `pnpm install`). curl reads the header from stdin,
  so the token is not in its argument list. GitHub masks secrets in logs. Only
  the status code and `err` are printed, not the response body.

- *Alternative:* let the CLI fail and parse its output. **Rejected**: the CLI's
  wording is not under our control, and it does not explain how to fix the
  token.

### 4. Pull requests from forks are skipped, not failed

The `validate` job checks `github.event.pull_request.head.repo.full_name ==
github.repository`. For forks, it writes a `::notice::` ("Code Connect
validation skipped: pull requests from forks get no repository secrets. A
maintainer can run the check after merge, or re-run it from a branch in this
repository.") and stops successfully. A missing secret on a same-repository PR
is a misconfiguration and fails (Decision 3).

### 5. Commands

- `validate`: `pnpm exec figma connect publish --dry-run --exit-on-unreadable-files --skip-update-check`
- `publish`: `pnpm exec figma connect publish --exit-on-unreadable-files --skip-update-check`

`--exit-on-unreadable-files` is what the CLI help recommends "for CI/CD".
`--skip-update-check` avoids a network call and noise in logs.

The `publish` job uses `concurrency: { group: code-connect-publish,
cancel-in-progress: false }`, so two merges never publish at the same time and
the later one always runs last.

Permissions: `contents: read` only.

### 6. Repository secret, not an environment secret

`FIGMA_ACCESS_TOKEN` is a repository secret, so both jobs can read it.

- *Alternative:* an environment (for example `figma`) restricted to `main`.
  **Rejected for now**, because the PR dry-run also needs the token. The
  token's rights are small (Code Connect write, file content read), which limits
  the damage if a same-repository branch misuses it.

### 7. Token type: personal now, plan token later

For now, a personal access token created only for CI, so renewing or revoking
a developer's local token does not break CI. Its limits: at most 90 days, and
it belongs to one person. A plan access token (up to one year, owned by the
plan) replaces it once a Figma admin creates one. The workflow does not change;
only the secret value does.

## Risks / Trade-offs

- [Personal token expires within 90 days] → Clear error message (Decision 3);
  record the expiry date in the docs and set a reminder; follow-up to switch to
  a plan token.
- [Token tied to one person] → Dedicated CI token; follow-up plan token.
- [Valid but wrong nodes are published] → Out of scope; FEC-1472, point 7.
- [Dev Mode can show an API before it is on npm] → Accepted (Decision 1).
- [Figma API outage fails PR checks] → Only PRs that change `*.figma.tsx` run
  the check; the error says to re-run it (Decision 3).
- [Collaborators with write access could read the secret from a branch
  workflow] → Small token scopes; switch to an environment with a branch rule
  if the PR check is ever dropped.
- [Publishing does not remove mappings for deleted `.figma.tsx` files] → Not
  verified. The CLI has a separate `unpublish` command. Documented as a manual
  step in the docs (Open Questions).

## Migration Plan

1. A maintainer creates the CI token and adds the repository secret
   `FIGMA_ACCESS_TOKEN`.
2. Merge PR #2097 first. Without it, validation fails on DropZone's node
   `0-0` (Decision 2).
3. Merge the workflow. Run `publish` once with `workflow_dispatch` to bring the
   published state up to date with `main`.
4. **Rollback:** disable or delete the workflow. Published mappings stay as
   they are; a maintainer can re-publish from any commit, or remove mappings
   with `figma connect unpublish`.

## Open Questions

- ~~Does `figma connect publish` need a package build on a clean checkout?~~
  No (task 1.1, Decision 2).
- Does `publish` remove mappings whose `.figma.tsx` file was deleted? If not,
  the docs describe `figma connect unpublish --node <url> --label <label>`.
- Who creates the plan access token, and when? (Figma admin; follow-up.)
