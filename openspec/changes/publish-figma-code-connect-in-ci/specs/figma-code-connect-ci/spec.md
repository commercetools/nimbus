## ADDED Requirements

### Requirement: Publish Code Connect on merge to main

The repository SHALL publish the Figma Code Connect mappings to Figma when a
commit that changes a `packages/nimbus/src/components/**/*.figma.tsx` file or
`figma.config.json` is pushed to `main`. Publishing SHALL use
`figma connect publish --exit-on-unreadable-files`. Two publish runs SHALL NOT
run at the same time.

#### Scenario: Code Connect file changed on main

- **WHEN** a pull request that changes a `*.figma.tsx` file is merged to `main`
- **THEN** the publish job runs and publishes all Code Connect mappings to Figma

#### Scenario: Unrelated change on main

- **WHEN** a commit pushed to `main` changes no `*.figma.tsx` file and not
  `figma.config.json`
- **THEN** the publish job does not run

#### Scenario: Unreadable Code Connect file

- **WHEN** a Code Connect file on `main` cannot be parsed
- **THEN** the publish job fails and nothing is published

#### Scenario: Two merges in quick succession

- **WHEN** a second publish run starts while the first is still running
- **THEN** the second run waits until the first has finished, and then
  publishes

### Requirement: Manual publish

The publish job SHALL be startable by hand (`workflow_dispatch`) for `main`,
independent of which files changed.

#### Scenario: Maintainer starts a publish

- **WHEN** a maintainer starts the workflow by hand on `main`
- **THEN** the publish job runs and publishes all Code Connect mappings

### Requirement: Validate Code Connect on pull requests

The repository SHALL run `figma connect publish --dry-run
--exit-on-unreadable-files` for pull requests from branches in this repository
that change a `*.figma.tsx` file or `figma.config.json`, and SHALL fail the
check if validation fails. The check SHALL NOT publish anything.

#### Scenario: Valid Code Connect files

- **WHEN** a pull request changes a `*.figma.tsx` file and all Code Connect
  files are valid
- **THEN** the validate check passes and nothing is published to Figma

#### Scenario: Invalid Code Connect file

- **WHEN** a pull request changes a `*.figma.tsx` file so that it reads a Figma
  property that does not exist on its node
- **THEN** the validate check fails and shows the CLI's validation error

#### Scenario: Pull request without Code Connect changes

- **WHEN** a pull request changes no `*.figma.tsx` file and not
  `figma.config.json`
- **THEN** the validate check does not run

### Requirement: Skip validation for pull requests from forks

For pull requests from forked repositories, the validate job SHALL NOT fail
because the token is missing. It SHALL end successfully and SHALL show a notice
that explains why the check was skipped.

#### Scenario: Pull request from a fork

- **WHEN** a pull request from a forked repository changes a `*.figma.tsx` file
- **THEN** the validate job ends successfully without calling Figma, and shows
  the notice "Code Connect validation skipped: pull requests from forks get no
  repository secrets."

### Requirement: Token check with an actionable error

Before calling the Figma CLI, both jobs SHALL check `FIGMA_ACCESS_TOKEN` with a
read request to the NIMBUS design system Figma file. If the check fails, the
job SHALL fail with an error annotation that contains Figma's HTTP status code
and error text, and SHALL explain how to create a new token and where to store
it. The token value SHALL NOT appear in the log.

#### Scenario: Expired token

- **WHEN** Figma answers the token check with HTTP 401 and the error text
  "Token has expired"
- **THEN** the job fails with the error "FIGMA_ACCESS_TOKEN was rejected by
  Figma (HTTP 401: Token has expired). Create a new token in Figma → Settings →
  Security → Personal access tokens (scopes: Code Connect: Write, File content:
  Read) and update the repository secret FIGMA_ACCESS_TOKEN. Long-term: ask a
  Figma admin for a plan access token."

#### Scenario: Secret not set

- **WHEN** a job runs on `main` or on a pull request from this repository and
  `FIGMA_ACCESS_TOKEN` is empty
- **THEN** the job fails with the error "FIGMA_ACCESS_TOKEN is not set. Add it
  as a repository secret (Settings → Secrets and variables → Actions)."

#### Scenario: Valid token

- **WHEN** Figma answers the token check with HTTP 200
- **THEN** the job continues with the CLI step

### Requirement: Documented token renewal

The contributor documentation SHALL describe the Code Connect workflow, the
`FIGMA_ACCESS_TOKEN` repository secret, the required token scopes, how to
renew the token, and how to publish by hand.

#### Scenario: Token expired

- **WHEN** a contributor sees the token error in CI
- **THEN** the documentation tells them how to create a new token with the
  right scopes and where to update the secret
