# Writing Slots Validation Report Format

### Validation Report Format

**Status rule** (the same in every validation report):
- `FAIL` if any MUST item fails.
- `WARNING` if no MUST item fails and a SHOULD item fails.
- `PASS` if no item fails.

Items that cannot be checked in read-only mode are listed under Not verified. They do not change the status.

```markdown
## Slot Components Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### Slot Type: [Standard Recipe | Slot Recipe]

### Slot Count: [1 | Multiple]

### Files Reviewed

- Slots file: `{component}.slots.tsx`
- Recipe file: `{component}.recipe.ts`
- Types file: `{component}.types.ts`

### ✅ Compliant

[List passing checks]

### ❌ Violations (MUST FIX)

- [Violation with guideline reference and line number]

### ⚠️ Warnings (SHOULD FIX)

- [Non-critical improvements]

### Slot Components Found

- [List slot components with their types and annotations]

### Missing Return Type Annotations

- [List components without SlotComponent annotation]

### Missing Type Exports

- [List components without corresponding type exports]

### Recommendations

- [Specific improvements needed]
```
