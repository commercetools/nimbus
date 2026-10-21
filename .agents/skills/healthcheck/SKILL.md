---
name: healthcheck
description: Check that the local repository setup is correct (Node, pnpm, dependencies, OpenSpec, Playwright). Use when the setup seems broken or after cloning.
---

You are performing a **healthcheck** of the Nimbus repository to verify it is
correctly set up for development.

## Execution Flow

Run each check in sequence. If a critical check fails (Node.js or pnpm), skip
dependent checks.

### Step 1: Check Node.js Version

First, read the required version from `.nvmrc` in the repo root. Then check the
installed version:

```bash
node --version
```

**Requirement**: You MUST have Node.js >= the version specified in `.nvmrc`. If
you need to install or update, use nvm: `nvm install` (reads from `.nvmrc`
automatically)

### Step 2: Check pnpm Version

Read the required pnpm version from the `engines.pnpm` field in `package.json`.
Then check the installed version:

```bash
pnpm --version
```

**Requirement**: You MUST have pnpm >= the version specified in `package.json`
engines. If you need to install or update, run: `npm install -g pnpm@latest`

**Note**: If pnpm is not installed, you MUST skip Steps 3-5 (they depend on
pnpm).

### Step 3: Check Dependencies Installed

```bash
pnpm install
```

**Requirement**: This command MUST exit successfully (exit code 0). If it fails,
you SHOULD check the error output and resolve any dependency issues.

### Step 4: Check OpenSpec Installed

Read the required OpenSpec version from `@fission-ai/openspec` in the `tooling`
catalog in `pnpm-workspace.yaml`. Then check the installed version:

```bash
pnpm exec openspec --version
```

**Requirement**: You MUST have OpenSpec >= the version specified in the
`pnpm-workspace.yaml` catalog. If OpenSpec is missing, you SHOULD run
`pnpm install` (openspec is a devDependency).

### Step 5: Check Playwright Chromium

Read the required Playwright version from the `tooling` catalog in
`pnpm-workspace.yaml`. Then check the installed version:

```bash
pnpm exec playwright --version
```

Then verify Chromium browser is installed:

```bash
pnpm exec playwright install --list
```

Look for a line containing `chromium-` in the Browsers section. If it's missing,
you MUST install the browser.

**Requirement**: You MUST have Playwright >= the version specified in the
`pnpm-workspace.yaml` catalog AND Chromium browser available in the list. If
Chromium is missing, run: `pnpm playwright:install`

## Output Format

After running all checks, output a summary table. Read version requirements from
their source files:

- **Node.js**: Read from `.nvmrc`
- **pnpm**: Read from `package.json` engines.pnpm field
- **OpenSpec**: Read from `@fission-ai/openspec` in `pnpm-workspace.yaml`
  tooling catalog
- **Playwright**: Read from `playwright` in `pnpm-workspace.yaml` tooling
  catalog

```markdown
## 🏥 Nimbus Healthcheck

| Check                               | Status           |
| ----------------------------------- | ---------------- |
| Node.js >= {from .nvmrc}            | ✅ v24.12.0      |
| pnpm >= {from package.json}         | ✅ v10.12.3      |
| Dependencies                        | ✅               |
| OpenSpec >= {from pnpm-workspace}   | ✅ v0.16.0       |
| Playwright >= {from pnpm-workspace} | ❌ Not installed |
```

(Replace `{from ...}` placeholders with actual versions read from those files)

Where status is either:

- `✅ vX.X.X` (for version checks that pass)
- `✅` (for existence checks that pass)
- `❌ Missing` or `❌ vX.X.X (requires >= Y.Y)` (for failures)

### Issues Section

If any checks failed, add an "Issues Found" section with fix commands:

```markdown
### ❌ Issues Found

- **Check name**: Run `fix command` to resolve
```

### Success Section

If ALL checks pass, add an engaging success message:

```markdown
### 🚀 All Systems Go!

Your Nimbus dev environment is ready. Fire it up with:

\`\`\`bash pnpm start \`\`\`

This launches the docs site at http://localhost:5173 and Storybook at
http://localhost:6006. Happy building!
```

## Important Notes

- You MUST run checks sequentially since some depend on others
- You MUST always show the full results table even if some checks fail
- You SHOULD provide clear, copy-pasteable fix commands for any failures
- You SHOULD end on a positive note when everything passes

## RFC 2119 Key Words

- **MUST** / **REQUIRED** / **SHALL** - Absolute requirement
- **MUST NOT** / **SHALL NOT** - Absolute prohibition
- **SHOULD** / **RECOMMENDED** - Should do unless valid reason not to
- **SHOULD NOT** / **NOT RECOMMENDED** - Should not do unless valid reason
- **MAY** / **OPTIONAL** - Truly optional
