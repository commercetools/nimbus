## Why

Figma Code Connect mappings (`*.figma.tsx`) are published to Figma by hand. The
published state falls behind the repo, so Figma Dev Mode and the Figma MCP show
outdated Nimbus code (FEC-1450, cause 1). Broken mappings are only found when
someone runs `figma connect publish` locally. For example, a placeholder node
crashed validation and nobody noticed. No workflow in `.github/workflows/` runs
the Figma CLI today. Tracked in FEC-1473.

## What Changes

- New GitHub Actions workflow that publishes the Code Connect mappings to Figma
  when a change to a `*.figma.tsx` file is merged to `main`, following
  Figma's documented CI setup
  (https://developers.figma.com/docs/code-connect/ci-cd/).
- The same workflow runs `figma connect publish --dry-run` on pull requests
  that change a `*.figma.tsx` file, so invalid mappings fail before merge.
- Pull requests from forks get no repository secrets. For them the check is
  skipped with a visible note instead of failing.
- Both jobs first test `FIGMA_ACCESS_TOKEN` with a small read request to the
  Figma file. If Figma rejects the token (expired, revoked, missing scope), the
  job fails with a message that states Figma's HTTP code and error text and
  explains how to create a new token and where to store it.
- The token is a repository secret `FIGMA_ACCESS_TOKEN` (not an environment
  secret). For now it is a personal access token created only for CI, with the
  scopes "Code Connect: Write" and "File content: Read". A plan access token is
  a follow-up.
- Documentation of the workflow, the token and its renewal in the
  contributor docs.

## Capabilities

### New Capabilities

- `figma-code-connect-ci`: Continuous publishing and validation of Figma Code
  Connect mappings in GitHub Actions, including the token check and its error
  message.

### Modified Capabilities

None.

## Impact

- **New file:** `.github/workflows/code-connect.yml`.
- **Repository settings:** a new repository secret `FIGMA_ACCESS_TOKEN` (added
  manually by a maintainer).
- **Docs:** a short section on Code Connect publishing and token renewal (in
  `docs/`, next to the other CI docs).
- **No package changes:** no runtime code, no public API, no changeset.
  `.figma.tsx` files are not bundled.
- **External system:** Figma. Publishing changes what Figma Dev Mode and the
  Figma MCP show for the NIMBUS design system file (`AvtPX6g7OGGCRvNlatGOIY`).
- **Not covered:** detecting a valid but wrong node (FEC-1472, point 7) and
  detecting outdated mappings (FEC-1214).
