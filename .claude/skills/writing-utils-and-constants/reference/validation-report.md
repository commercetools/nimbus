# Utils and Constants Validation Report Format

## Validation Report Format

```markdown
## Utils & Constants Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### Files Reviewed

- Utils dir: `packages/nimbus/src/components/{component}/utils/`
- Constants dir: `packages/nimbus/src/components/{component}/constants/` (if
  applicable)
- Main file scanned for inlined helpers:
  `packages/nimbus/src/components/{component}/{component}.tsx`

---

### ✅ Compliant (X of N)

N is the item count from `reference/validation-checklist.md` (see its last section).

[Per category breakdown]

---

### ❌ Violations (MUST FIX)

- **`{file}:{line}`**: [violation description]
  - **Guideline**: [reference to utils-and-constants.md section or this
    skill's checklist]
  - **Fix**: [how to resolve, including target file path]

---

### ⚠️ Warnings (SHOULD FIX)

[Same format as violations]

---

### Next Steps

1. Fix all ❌ violations first
2. Run tests: `pnpm test:dev packages/nimbus/src/components/{component}/utils/`
3. Re-validate: `writing-utils-and-constants validate {ComponentName}`
```

---
