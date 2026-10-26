## 1. Preparation

- [x] 1.1 On a clean checkout (fresh `pnpm install --frozen-lockfile`, no package build), run `pnpm exec figma connect publish --dry-run --exit-on-unreadable-files --skip-update-check` with a valid token. Record whether it passes; if it needs a build, switch Decision 2 in design.md to the shared `.github/actions/ci` action
- [x] 1.2 Confirm the token-check request (`GET /v1/files/AvtPX6g7OGGCRvNlatGOIY/nodes?ids=67:549&depth=1`) returns HTTP 200 with a token that has only "Code Connect: Write" and "File content: Read", and record the status and `err` text Figma returns for an expired or invalid token
- [x] 1.3 Maintainer: create a personal access token only for CI (scopes: Code Connect: Write, File content: Read), note its expiry date, and add it as the repository secret `FIGMA_ACCESS_TOKEN` (Settings → Secrets and variables → Actions) (created 2026-10-26, expires 2027-01-24)

## 2. Workflow

- [x] 2.1 Create `.github/workflows/code-connect.yml` with triggers: `pull_request` and `push` to `main`, both with the `paths` filter `packages/nimbus/src/components/**/*.figma.tsx` and `figma.config.json`, plus `workflow_dispatch`; set `permissions: contents: read`
- [x] 2.2 Add the shared setup steps (checkout, `pnpm/action-setup`, `actions/setup-node` with Node 24 and pnpm cache, `pnpm install --frozen-lockfile`), pinned to the same commit SHAs as `.github/actions/ci`
- [x] 2.3 Add the token-check step: empty secret → "FIGMA_ACCESS_TOKEN is not set…" error; non-200 → "FIGMA_ACCESS_TOKEN was rejected by Figma (HTTP <code>: <err>)…" error as a `::error::` annotation; token passed through `env` only, response body not printed
- [x] 2.4 Add the `validate` job (pull requests only): fork check first (`head.repo.full_name != github.repository` → `::notice::` and successful end), then the token check, then `pnpm exec figma connect publish --dry-run --exit-on-unreadable-files --skip-update-check`
- [x] 2.5 Add the `publish` job (push to `main` and `workflow_dispatch` on `main`): `concurrency` group `code-connect-publish` with `cancel-in-progress: false`, the token check, then `pnpm exec figma connect publish --exit-on-unreadable-files --skip-update-check`

## 3. Verification

- [ ] 3.1 Open a test PR from a branch in this repository that changes a `*.figma.tsx` file: the validate job passes and nothing is published
- [ ] 3.2 In the same PR, temporarily make a mapping read a property that does not exist: the validate job fails with the CLI error; revert
- [x] 3.3 Run the workflow once with an invalid token value (for example on a temporary branch with a placeholder secret, or by temporarily changing the secret): the job fails with the token error message and the token value does not appear in the log. Not run: the maintainer decided on 2026-10-26 that the local test of the extracted script (expired, invalid and empty token, no token in the output) is enough
- [ ] 3.4 Confirm that a PR without `*.figma.tsx` changes does not start the workflow
- [ ] 3.5 After merge, run the `publish` job once with `workflow_dispatch` and check in Figma Dev Mode that Card, Steps, Accordion and ChatMessage show the current snippets

## 4. Documentation

- [x] 4.1 Add `docs/figma-code-connect-ci.md`: what the workflow does, when it runs, the `FIGMA_ACCESS_TOKEN` repository secret and its scopes, how to renew the token (with the current expiry date), how to publish by hand (`workflow_dispatch`), fork PRs, and how to remove a mapping (`figma connect unpublish --node <url> --label <label>`)
- [x] 4.2 Link the new doc from `CLAUDE.md` next to the other CI docs (Chromatic, bundle size, package shape)
- [x] 4.3 Update `.claude/skills/nimbus-code-connect/SKILL.md` "Step 8: Publish (optional)": publishing happens in CI after merge; a manual publish is only needed for testing. Also fix the reference in Step 3, which says "Step 7 (Publish)"
- [x] 4.4 Run `pnpm openspec validate --all --strict`

## 5. Follow-up

- [x] 5.1 Create a Jira follow-up under FEC-368: replace the personal token with a plan access token (needs a Figma admin). Not needed (maintainer decision, 2026-10-26)
- [ ] 5.2 Answer the open question in design.md: does `publish` remove mappings for deleted `.figma.tsx` files? Update the docs with the result
