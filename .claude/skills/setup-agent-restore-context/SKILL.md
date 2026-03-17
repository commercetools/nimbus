---
name: setup-agent-restore-context
description: Set up the restore-context hook so skills can survive /clear and /compact. Detects .claude/ vs .agents/ layout automatically.
disable-model-invocation: false
allowed-tools: Bash, Grep, Glob, Read, Edit, Write
---

# Setup Restore Context

Set up a generic `SessionStart` hook that re-injects context after `/clear` or
`/compact`. Any skill that writes a `.agent-restore-context-<name>` file in the
project root will have its contents automatically injected into the fresh
conversation.

## How It Works

1. Skills write `.agent-restore-context-<skill-name>` files with resume prompts.
2. A `SessionStart` hook with matcher `clear|compact` runs `agent-restore-context.sh`.
3. The script globs for `.agent-restore-context-*` and outputs their contents.
4. The model receives that output and follows the resume instructions.
5. Skills manage their own file lifecycle (write/delete).

## Process

### 1. Detect Layout

Determine which configuration layer the project uses:

| Check                       | Layout   | Skills directory  |
| --------------------------- | -------- | ----------------- |
| `.agents/` directory exists | `agents` | `.agents/skills/` |
| Only `.claude/` exists      | `claude` | `.claude/skills/` |

Settings files always live under `.claude/` regardless of layout.

### 2. Check if Already Configured

Read `.claude/settings.json` and `.claude/settings.local.json` (if it exists).
Search both for `restore-context`. If found in either file, report that the hook
is already configured and stop.

### 3. Locate the Hook Script

The script is at `<skills-dir>/setup-agent-restore-context/resources/agent-restore-context.sh`
(using the skills directory from step 1).

Verify the script exists and is executable. If not executable, run `chmod +x`.

### 4. Register the Hook

Ask the user:

> "Should I add the restore-context hook to `.claude/settings.json`
> (shared/committed) or `.claude/settings.local.json` (local only)?"

Compute the script path relative to the project root (from step 3), then merge
the following into the chosen file's `hooks` object. Do **not** overwrite
existing hooks — add to or create the `SessionStart` array:

```json
{
  "SessionStart": [
    {
      "matcher": "clear|compact",
      "hooks": [
        {
          "type": "command",
          "command": "bash <skills-dir>/setup-agent-restore-context/resources/agent-restore-context.sh"
        }
      ]
    }
  ]
}
```

### 5. Add Gitignore Entry

Check `.gitignore` for `.agent-restore-context-*`. If not present, append:

```
# Restore context files (used by skills to survive /clear and /compact)
.agent-restore-context-*
```

### 6. Confirm

Report to the user:

- Where the hook was registered (which settings file)
- The path to the script
- That any skill can now write `.agent-restore-context-<name>` files to use
  this pattern

## Guidelines

- Always read target files before modifying them
- Do not create `.agents/` or `.agents/skills/` directories — only use them if
  they already exist
- This skill is idempotent — safe to run multiple times
