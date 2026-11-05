# Validation Report Format

## Validation Report Format

When validation completes, you MUST provide a report in this format:

**Status rule** (the same in every validation report):
- `FAIL` if any MUST item fails.
- `WARNING` if no MUST item fails and a SHOULD item fails.
- `PASS` if no item fails.

Items that cannot be checked in read-only mode are listed under Not verified. They do not change the status.

```markdown
## Main Component Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### Component Architecture

- **Type**: [Single | Compound]
- **Pattern**: [Simple Single | Complex Single | Simple Compound | Complex
  Compound]
- **React Aria Integration**: [Hook-based | Component-based | Hybrid | None]

### Files Reviewed

- Main component: `packages/nimbus/src/components/{component}/{component}.tsx`
- Types file: `packages/nimbus/src/components/{component}/{component}.types.ts`
- Slots file: `packages/nimbus/src/components/{component}/{component}.slots.tsx`
  (if applicable)
- Recipe file:
  `packages/nimbus/src/components/{component}/{component}.recipe.ts` (if
  applicable)
- i18n file: `packages/nimbus/src/components/{component}/{component}.i18n.ts`
  (if applicable)

---

### ✅ Compliant (X of N)

N is the item count from `reference/validation-checklist.md`, counted as described in its last section.

**Category 1: File Structure & Architecture**

- [✓] Item description
- [✓] Item description

**Category 2: Component Type & Pattern**

- [✓] Item description

[Continue for every category in the checklist]

---

### ❌ Violations (MUST FIX)

**Category X: [Category Name]**

- **Line X**: [Violation description]
  - **Guideline**: [Specific guideline reference from docs]
  - **Fix**: [How to resolve]

**Category Y: [Category Name]**

- **Line Y**: [Violation description]
  - **Guideline**: [Specific guideline reference from docs]
  - **Fix**: [How to resolve]

---

### ⚠️ Warnings (SHOULD FIX)

**Category X: [Category Name]**

- **Line X**: [Non-critical improvement suggestion]
  - **Recommendation**: [Why this should be improved]

---

### 💡 Recommendations

1. **Priority 1** (Critical for compliance):
   - [Recommendation with specific action]

2. **Priority 2** (Important for best practices):
   - [Recommendation with specific action]

3. **Priority 3** (Nice to have improvements):
   - [Recommendation with specific action]

---

### 📚 Reference Components

Similar components for pattern reference:

- **[Component name]** (`path/to/component.tsx`) - [Reason: e.g., "Similar
  complexity, good ref forwarding example"]
- **[Component name]** (`path/to/component.tsx`) - [Reason: e.g., "Compound
  pattern with context management"]

---

### Next Steps

1. Fix all ❌ violations first (MUST requirements)
2. Address ⚠️ warnings (SHOULD requirements)
3. Consider 💡 recommendations
4. Re-run validation: `/writing-main-component validate {ComponentName}`
5. Verify build: `pnpm --filter @commercetools/nimbus build`
```

---
