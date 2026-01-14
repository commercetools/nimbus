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

**Requirement**: You MUST have Node.js >= 22.10 installed. If you need to
install or update, use nvm: `nvm install 22` (installs v22.14.0+)

### Step 2: Check pnpm Version

```bash
pnpm --version
```

**Requirement**: You MUST have pnpm >= 10 installed. If you need to install or
update, run: `npm install -g pnpm@latest`

**Note**: If pnpm is not installed, you MUST skip Steps 3-5 (they depend on
pnpm).

### Step 3: Check Dependencies Installed

```bash
pnpm install
```

**Requirement**: This command MUST exit successfully (exit code 0). If it fails,
you SHOULD check the error output and resolve any dependency issues.

### Step 4: Check OpenSpec Installed

```bash
pnpm exec openspec --version
```

**Requirement**: This command MUST return a version number. If OpenSpec is
missing, you SHOULD run `pnpm install` (openspec is a devDependency).

### Step 5: Check Playwright Chromium

First, check Playwright is installed:

```bash
pnpm exec playwright --version
```

Then verify Chromium browser is installed:

```bash
pnpm exec playwright install --list
```

Look for a line containing `chromium-` in the Browsers section. If it's missing,
you MUST install the browser.

**Requirement**: You MUST have both the Playwright package installed AND
Chromium browser available in the list. If Chromium is missing, run:
`pnpm playwright:install`

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
