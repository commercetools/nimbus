# File Review Protocol

MANDATORY: When asked to review ANY file in this codebase, you MUST follow this
protocol:

## Step 1: Identify File Type

Determine the file type by extension and location:

- `*.mdx` → Documentation file
- `*.stories.tsx` → Storybook stories
- `*.recipe.tsx` → Chakra UI recipe
- `*.slots.tsx` → Slot components
- `*.types.ts` → Type definitions
- `*/utils/*.ts` → Utility functions
- `*/hooks/*.ts` → React hooks

## Step 2: Load Corresponding Guidelines

IMMEDIATELY read the appropriate guidelines document:

- MDX files → `/docs/file-type-guidelines/documentation.md`
- Stories → `/docs/file-type-guidelines/stories.md`
- Recipes → `/docs/file-type-guidelines/recipes.md`
- Slots → `/docs/file-type-guidelines/slots.md`
- Types → `/docs/file-type-guidelines/types.md`
- Utils → `/docs/file-type-guidelines/utils-and-constants.md`
- Hooks → `/docs/file-type-guidelines/hooks.md`
- Components → `/docs/file-type-guidelines/main-component.md`

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
