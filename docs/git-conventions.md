# Git Conventions

## Base Branch

The default branch is `main`. All feature branches should be created from
`main`.

## Branch Naming

```
<TICKET-KEY>-<short-slug>
```

- Use the ticket key as prefix (e.g., `CRAFT-2118`)
- Follow with a dash-separated slug derived from the ticket summary
- Keep the slug concise (3-5 words max)
- Use lowercase for the slug portion
- Use dashes (`-`) as separators, never slashes (`/`)

Examples:

- `CRAFT-2118-color-tokens-wcag-docs`
- `CRAFT-1234-add-toast-component`
- `CRAFT-5678-fix-menu-keyboard-nav`

## Commit Messages

Use [conventional commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

<optional body>

<TICKET-KEY>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### Types

- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `refactor` — code change that neither fixes a bug nor adds a feature
- `test` — adding or updating tests
- `chore` — maintenance (deps, CI, tooling)

### Rules

- **scope**: component or area affected (e.g., `button`, `tokens`, `i18n`)
- **description**: concise summary of what changed
- **body**: optional, for additional context on why
- **footer**: always include the ticket key for traceability
- Split logically independent changes into separate commits
- Each commit should be atomic and pass lint/typecheck independently

## Test Commands

| Command                         | Purpose                                                |
| ------------------------------- | ------------------------------------------------------ |
| `pnpm test`                     | Run all tests (unit + Storybook)                       |
| `pnpm test:dev`                 | Run all tests against source files (no build required) |
| `pnpm test:dev <files/folders>` | Run specific tests against source (use for TDD)        |
| `pnpm test:unit`                | Run only unit tests (JSDOM, fast)                      |
| `pnpm test:storybook`           | Run only Storybook tests (browser, slower)             |
| `pnpm test:storybook:dev`       | Run Storybook tests against source files               |
