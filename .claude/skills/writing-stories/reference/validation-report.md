# Writing Stories Validation Report Format

### Validation Report Format

**Status rule** (the same in every validation report):
- `FAIL` if any MUST item fails.
- `WARNING` if no MUST item fails and a SHOULD item fails.
- `PASS` if no item fails.

Items that cannot be checked in read-only mode are listed under Not verified. They do not change the status.

```markdown
## Story Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### Files Reviewed

- Story file: `{component}.stories.tsx`
- Guidelines: `docs/file-type-guidelines/stories.md`

### ✅ Compliant

[List passing checks]

### ❌ Violations (MUST FIX)

- [Violation with guideline reference and line number]

### ⚠️ Warnings (SHOULD FIX)

- [Non-critical improvements]

### Test Coverage

- Required Stories: [X/Y present]
- Play Functions: [X/Y stories have tests]
- Interaction Testing: [Complete | Partial | Missing]
- Accessibility Testing: [Complete | Partial | Missing]

### Recommendations

- [Specific improvements needed]
```
