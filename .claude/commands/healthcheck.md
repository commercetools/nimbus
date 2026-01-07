---
description: Check if the repo is set up correctly
---

You are performing a **healthcheck** of the Nimbus repository to verify it is
correctly set up for development.

## Execution Flow

Run each check in sequence. If a critical check fails (Node.js or pnpm), skip
dependent checks.

### Step 1: Check Node.js Version

```bash
node --version
```

**Requirement**: >= 22.10 **Fix if missing/outdated**: Install Node.js v22.14.0+
via nvm: `nvm install 22`

### Step 2: Check pnpm Version

```bash
pnpm --version
```

**Requirement**: >= 10 **Fix if missing**: `npm install -g pnpm@latest`

If pnpm is not installed, skip Steps 3-5 (they depend on pnpm).

### Step 3: Check Dependencies Installed

```bash
pnpm install
```

**Requirement**: Command exits successfully (exit code 0) **Fix if fails**:
Check error output and resolve dependency issues

### Step 4: Check OpenSpec Installed

```bash
pnpm exec openspec --version
```

**Requirement**: Command returns a version number **Fix if missing**: Run
`pnpm install` (openspec is a devDependency)

### Step 5: Check Playwright Chromium

First, check Playwright is installed:

```bash
pnpm exec playwright --version
```

Then verify Chromium browser is installed:

```bash
pnpm exec playwright install --list
```

Look for a line containing `chromium-` in the Browsers section. If missing, the
browser needs to be installed.

**Requirement**: Playwright package installed AND Chromium browser available in
the list **Fix if missing**: `pnpm playwright:install`

## Output Format

After running all checks, output a summary table:

```markdown
## 🏥 Nimbus Healthcheck

| Check               | Status           |
| ------------------- | ---------------- |
| Node.js >= 22.10    | ✅ v22.14.0      |
| pnpm >= 10          | ✅ v10.12.3      |
| Dependencies        | ✅               |
| OpenSpec            | ✅ v0.16.0       |
| Playwright Chromium | ❌ Not installed |
```

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

- Run checks sequentially since some depend on others
- Always show the full results table even if some checks fail
- Provide clear, copy-pasteable fix commands for any failures
- End on a positive note when everything passes
