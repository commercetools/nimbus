# File Review Protocol

MANDATORY: When asked to review ANY file in this codebase, you MUST follow this
protocol:

## Step 1: Identify File Type

Determine the file type by extension and location:

- `*.mdx` → Documentation file
- `*.stories.tsx` → Storybook stories
- `*.spec.tsx` or `*.spec.ts` → Unit tests
- `*.recipe.ts` → Chakra UI recipe
- `*.slots.tsx` → Slot components
- `*.types.ts` → Type definitions
- `*.i18n.ts` → Internationalization messages
- `{component-name}.tsx` → Main component file
- `index.ts` → Barrel exports (public API)
- `*/utils/*.ts` → Utility functions
- `*/hooks/*.ts` → React hooks
- `*/constants/*.ts` → Constants and configuration

## Step 2: Load Corresponding Guidelines

IMMEDIATELY read the appropriate guidelines document:

- MDX files → `/docs/file-type-guidelines/documentation.md`
- Stories → `/docs/file-type-guidelines/stories.md`
- Unit tests → `/docs/file-type-guidelines/unit-testing.md`
- Recipes → `/docs/file-type-guidelines/recipes.md`
- Slots → `/docs/file-type-guidelines/slots.md`
- Types → `/docs/file-type-guidelines/types.md`
- i18n → `/docs/file-type-guidelines/i18n.md`
- Main components → `/docs/file-type-guidelines/main-component.md`
- Barrel exports (index.ts) → `/docs/file-type-guidelines/barrel-exports.md`
- Context files → `/docs/file-type-guidelines/context-files.md`
- Utils/Constants → `/docs/file-type-guidelines/utils-and-constants.md`
- Hooks → `/docs/file-type-guidelines/hooks.md`

## Step 3: Run Validation Checklist

SYSTEMATICALLY check each item in the validation checklist found at the end of
each guidelines document. Report ALL violations.

## Step 4: Report Compliance Status

ALWAYS provide structural compliance feedback FIRST:

- ✅ Compliant items
- ❌ Violations with specific references to guidelines
- ⚠️ Warnings for non-critical issues

ONLY AFTER completing steps 1-4 should you provide content or quality feedback.

## Example Review Response Format

When reviewing a file, structure your response as:

```
## File Type: [identified type]
## Guidelines Document: [path to guidelines]

### Structural Compliance Check:
✅ Has required frontmatter
❌ Uses Storybook imports (violation of documentation.md line 129)
❌ Missing PropsTable component (required per documentation.md line 234)

### Required Fixes:
1. Remove all @storybook/blocks imports
2. Convert Canvas blocks to jsx-live
3. Add PropsTable component

### Content Review:
[Only provided after structural issues are addressed]
```
