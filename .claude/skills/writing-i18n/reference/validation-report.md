# Writing i18n Validation Report Format

### Validation Report Format

**Status rule** (the same in every validation report):
- `FAIL` if any MUST item fails.
- `WARNING` if no MUST item fails and a SHOULD item fails.
- `PASS` if no item fails.

Items that cannot be checked in read-only mode are listed under Not verified. They do not change the status.

```markdown
## i18n Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### i18n Assessment: [Required | Not Required]

### Files Reviewed

- i18n file: `{component}.i18n.ts`
- Component: `{component}.tsx`

### ✅ Compliant

[List passing checks]

### ❌ Violations (MUST FIX)

- [Violation with guideline reference and line number]

### ⚠️ Warnings (SHOULD FIX)

- [Non-critical improvements]

### Messages Found

- [List message IDs with their purpose]

### Missing i18n

- [List hardcoded strings that should be internationalized]

### Description Quality

- [Assess description clarity and completeness]

### Recommendations

- [Specific improvements needed]
```
