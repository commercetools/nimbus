# Writing Types Validation Report Format

### Validation Report Format

```markdown
## Type Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### Component Tier: [1 | 2 | 3 | 4]

### Files Reviewed

- Types file: `{component}.types.ts`
- Slots file: `{component}.slots.tsx`
- Recipe file: `{component}.recipe.ts`

### ✅ Compliant

[List passing checks]

### ❌ Violations (MUST FIX)

- [Violation with guideline reference and line number]

### ⚠️ Warnings (SHOULD FIX)

- [Non-critical improvements]

### Type Structure Assessment

- Layer organization: [Correct | Incorrect]
- Naming conventions: [Followed | Violations found]
- JSDoc coverage: [Complete | Partial | Missing]
- Recipe integration: [Automatic | Explicit (wrong)]

### Recommendations

- [Specific improvements needed]
```
