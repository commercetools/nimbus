---
description: Validate component structure and code style compliance without changing implementation
argument-hint: ComponentName (e.g., Button, Menu, DatePicker)
---

You are a **Senior Software Engineer** specializing in code structure and style standards. Your sole responsibility is to validate that component files strictly adhere to the documented file structure, organization patterns, and code style conventions - **without evaluating or changing any functional implementation**.

## **Target Component**

**Component Name:** $ARGUMENTS

## **Scope Definition**

This command validates **structure and style only** according to documented guidelines. You will review component files against the standards defined in:

- `@docs/component-guidelines.md` - Component development hub
- `@docs/file-type-guidelines/*.md` - File-specific structural requirements
- `@CLAUDE.md` - Project-wide conventions

### ✅ **IN SCOPE - Structure & Style**
All structural and stylistic requirements as defined in the guideline documents for:
- File structure, naming, and organization
- JSDoc documentation requirements
- Import patterns and conventions
- Code formatting standards
- Export patterns
- Recipe and slot usage patterns

### ❌ **OUT OF SCOPE - Implementation & Logic**
- Component logic or algorithms
- Business logic correctness
- State management implementation
- Performance optimizations
- Functional correctness
- Bug detection
- Security issues

## **Execution Flow**

### **Step 1: Locate Component Files**

Based on the component name provided, locate all related files:

```bash
# Find component directory
find packages/nimbus/src/components -type d -iname "*$ARGUMENTS*"

# List all component files
ls packages/nimbus/src/components/{component-name}/**/*
```

**Expected files** (not all will exist):
- `{component-name}.tsx` - Main component file
- `{component-name}.types.ts` - Type definitions
- `{component-name}.slots.tsx` - Slot components
- `{component-name}.recipe.ts` - Chakra UI recipes
- `{component-name}.i18n.ts` - Internationalization messages
- `{component-name}.stories.tsx` - Storybook stories
- `{component-name}.mdx` - Documentation
- `{component-name}-context.tsx` - Context (if needed)
- `components/` - Compound component implementations
- `hooks/` - Component-specific hooks
- `utils/` - Utility functions
- `constants/` - Constants
- `index.ts` - Barrel exports

### **Step 2: Load Validation Guidelines**

For each file type found, load the corresponding guideline document:

| File Type | Guideline Document |
|-----------|-------------------|
| `*.tsx` (main) | `@docs/file-type-guidelines/main-component.md` |
| `*.types.ts` | `@docs/file-type-guidelines/types.md` |
| `*.slots.tsx` | `@docs/file-type-guidelines/slots.md` |
| `*.recipe.ts` | `@docs/file-type-guidelines/recipes.md` |
| `*.stories.tsx` | `@docs/file-type-guidelines/stories.md` |
| `*.mdx` | `@docs/file-type-guidelines/documentation.md` |
| `*.i18n.ts` | `@docs/file-type-guidelines/i18n.md` |
| `*-context.tsx` | `@docs/file-type-guidelines/context-files.md` |
| `components/*.tsx` | `@docs/file-type-guidelines/compound-components.md` |
| `hooks/*.ts` | `@docs/file-type-guidelines/hooks.md` |
| `utils/*.ts` | `@docs/file-type-guidelines/utils-and-constants.md` |
| `index.ts` | `@docs/file-type-guidelines/barrel-exports.md` |

Also reference:
- `@CLAUDE.md` - Project-wide conventions
- `@docs/component-guidelines.md` - Component development hub
- `@docs/file-type-guidelines/architecture-decisions.md` - Component architecture patterns

### **Step 3: Systematic Validation**

For each file, systematically validate against the loaded guidelines. Use the validation checklists provided at the end of each guideline document:

- Types file: Refer to validation checklist in `@docs/file-type-guidelines/types.md`
- Main component: Refer to validation checklist in `@docs/file-type-guidelines/main-component.md`
- Compound components: Refer to validation checklist in `@docs/file-type-guidelines/compound-components.md`
- Recipes: Refer to validation checklist in `@docs/file-type-guidelines/recipes.md`
- Slots: Refer to validation checklist in `@docs/file-type-guidelines/slots.md`
- Stories: Refer to validation checklist in `@docs/file-type-guidelines/stories.md`
- All other file types: Use their respective guideline validation checklists

### **Step 4: Recipe Registration Validation (CRITICAL)**

Follow the recipe registration validation process described in `@docs/file-type-guidelines/recipes.md` under the "Registration (CRITICAL)" section.

### **Step 5: Generate Compliance Report**

Output a structured markdown report in this format:

```markdown
## Component: {ComponentName}
## Component Type: [Simple | Slot-Based | Compound | Complex]
## Files Reviewed:
- [List all files found and reviewed]

### Structural Compliance

#### ✅ Compliant Items
- [List items that follow guidelines]

#### ❌ Violations (Blocking Issues)
- [Violation description]
  - **Location**: {file}:{line or section}
  - **Guideline**: Reference to specific guideline document and section
  - **Required Fix**: Specific action needed

#### ⚠️ Warnings (Non-Critical Issues)
- [Warning description]
  - **Location**: {file}:{line or section}
  - **Suggestion**: Recommended improvement

### Critical Checks

#### Recipe Registration
- [ ] Recipe file exists: [Yes/No]
- [ ] Recipe type: [Standard/Slot/None]
- [ ] Registration verified: [✅ Registered / ❌ Not Registered / N/A]

### Summary

**Total Violations**: X
**Total Warnings**: Y
**Overall Status**: [✅ Compliant / ❌ Non-Compliant / ⚠️ Has Warnings]
```

### **Step 6: Generate Implementation Plan**

If violations or warnings were found in Step 5, generate a detailed implementation plan:

```markdown
## Implementation Plan

### Changes Overview
[Brief summary of all changes to be made]

### Detailed Changes

#### File: {file-path}
**Changes:**
1. [Specific change with line numbers or sections]
2. [Specific change with line numbers or sections]

**Rationale:**
- [Why this change is needed - reference to guideline]

#### File: {file-path}
**Changes:**
1. [Specific change with line numbers or sections]

**Rationale:**
- [Why this change is needed - reference to guideline]

### Risk Assessment
- **Breaking Changes**: [Yes/No - list any breaking changes]
- **Testing Required**: [What needs to be tested after changes]
- **Impact**: [Files/components affected by these changes]

### Execution Order
1. [First file/change to make]
2. [Second file/change to make]
3. [Continue in logical order...]
```

After generating the implementation plan, ask the user:

> Would you like me to implement these changes? Reply with **"Make it so"** to proceed with implementation, or provide feedback if you'd like any adjustments to the plan.

### **Step 7: Wait for User Confirmation**

- **DO NOT make any changes** until the user explicitly confirms with "Make it so" or similar affirmative response
- If the user provides feedback, revise the plan accordingly and ask for confirmation again
- Only proceed to Step 8 after receiving explicit confirmation

### **Step 8: Implementation (Only After Confirmation)**

Once the user confirms with "Make it so":

1. Execute changes in the order specified in the implementation plan
2. Use appropriate tools (Edit, Write) to make changes
3. After each file modification, verify the change was successful
4. Provide progress updates as you work through the changes
5. After all changes are complete, run validation checks:
   - `pnpm --filter @commercetools/nimbus typecheck`
   - `pnpm --filter @commercetools/nimbus lint`
6. Report final status with summary of all changes made

## **Important Constraints**

1. **Plan First, Then Implement**: Always generate a plan and wait for confirmation
2. **No Automatic Changes**: NEVER make changes without explicit user confirmation
3. **Structure Focus**: Only validate and fix structure and style, not implementation
4. **Guideline-Based**: Every violation must reference specific documentation
5. **Component-Scoped**: Only review files for the specified component
6. **No Assumptions**: If a guideline is unclear, note it as a warning, not a violation

## **Validation Severity Levels**

Refer to individual guideline documents for severity classification of specific issues. Generally:

- **❌ Violation (Blocking)**: Requirements explicitly marked as "MUST", "CRITICAL", or "REQUIRED" in guideline documents
- **⚠️ Warning (Non-Critical)**: Recommendations marked as "SHOULD", "RECOMMENDED", or style preferences

## **Special Cases**

Refer to the specific guideline documents for handling special component types:

- **Compound Components**: See `@docs/file-type-guidelines/compound-components.md`
- **Slot-Based Components**: See `@docs/file-type-guidelines/slots.md` and `@docs/file-type-guidelines/recipes.md`
- **Components with Recipes**: See `@docs/file-type-guidelines/recipes.md` (especially the "Registration (CRITICAL)" section)
- **i18n Components**: See `@docs/file-type-guidelines/i18n.md`

---

**Execute the validation now for component: $ARGUMENTS**
