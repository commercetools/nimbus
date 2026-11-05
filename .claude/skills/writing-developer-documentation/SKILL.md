---
description: Create, update, or validate developer-facing MDX documentation files
argument-hint: create|update|validate ComponentName [base|field] [details]
---

# Writing Developer Documentation Skill

You are a Nimbus developer documentation specialist. This skill helps you
create, update, or validate developer-facing MDX documentation files
(`{component}.dev.mdx`) and their companion test files
(`{component}.docs.spec.tsx`) that provide implementation guidance, API
references, and code patterns.

**Note**: If you're creating a NEW component, consider using
`/propose-component` instead. This skill is for:

- Creating standalone developer documentation
- Updating existing documentation
- Being invoked by higher-level commands or agents

## Critical Requirements

**Developer documentation is for engineers.** Focus on implementation details,
code examples, API documentation, and technical patterns—NOT design rationale or
visual guidelines.

**Test files are MANDATORY.** Every `.dev.mdx` file MUST have a companion
`.docs.spec.tsx` test file with JSDoc tags for documentation injection.

## Mode Detection

Parse the request to determine the operation:

- **create** - Generate new developer documentation file AND test file
- **update** - Enhance existing documentation, add examples, update API docs,
  update test files
- **validate** - Check documentation compliance with guidelines including test
  files

If no mode is specified, default to **create**.

### Why These Modes Matter

- **create** mode: You MUST build the entire file + test companion. The test
  file is MANDATORY because the documentation build process injects test
  examples via `{{docs-tests:}}` injection token (see Testing section). Without
  it, the build fails.

- **update** mode: You enhance existing docs. If the test file doesn't exist,
  you MUST create it—this is not optional for the documentation system to work.

- **validate** mode: You check compliance. This prevents shipping incomplete or
  broken docs that would fail the build pipeline.

### Component Type Detection

Parse arguments to extract:

- Component name (e.g., "DateRangePicker", "TextInputField")
- Component type: "base" or "field" (defaults to "base" if not specified)

Examples:

- `create DateRangePicker` → base component
- `create DateRangePicker base` → base component (explicit)
- `create TextInputField field` → field pattern
- `update DateRangePicker` → base component
- `validate TextInputField field` → field pattern

## Required Research (All Modes)

Do not read whole guideline files. Read only the sections listed here. To find a section, run `rg -n '^## ' <file>` for its line numbers, then use the Read tool with `offset` and `limit`.

**Before implementation, read these sections:**

1. `docs/file-type-guidelines/documentation.md`, section `## Overview`
2. `docs/file-type-guidelines/documentation.md`, section `## Code Examples`
3. `docs/jsdoc-standards.md`, section `## Documentation Test Tags (for .docs.spec.tsx files)`. Pay special attention to @docs-section, @docs-title, @docs-description, @docs-order tags.

4. **Review** component implementation files for API understanding:
   - `{component-name}.tsx` - Main component implementation
   - `{component-name}.types.ts` - Props and types
   - `{component-name}.recipe.ts` - Visual variants (if exists)
   - `{component-name}.slots.tsx` - Slot components (if exists)
   - `components/` directory - Compound component parts (if exists)
   - `{component-name}.stories.tsx` - Existing usage examples

5. **Check** similar documentation:

   ```bash
   ls packages/nimbus/src/components/*/*.dev.mdx
   ls packages/nimbus/src/components/*/*.docs.spec.tsx
   ```

   (for base components, or `ls packages/nimbus/src/patterns/fields/*/*` for
   field patterns)

**Read these sections only when the task needs them:**

| Task | Section to read |
| --- | --- |
| Props tables | `docs/file-type-guidelines/documentation.md`, `## Props Documentation` |
| Accessibility section | `docs/file-type-guidelines/documentation.md`, `## Accessibility Documentation` |
| Example patterns | `docs/file-type-guidelines/documentation.md`, `## Common Patterns from Nimbus Components` |
| Validating a file | `docs/file-type-guidelines/documentation.md`, `## Validation Checklist` |
| JSDoc on component props | `docs/jsdoc-standards.md`, `## Component Props JSDoc (Required)` |

**When you create a new file, also read:**

- `@docs/engineering-docs-template.mdx` for base template structure
- `@docs/engineering-docs-template-guide.md` for detailed usage instructions
- `@docs/engineering-docs-validation.md` for validation criteria

---

## File Structure

### Documentation File Location

Developer documentation files MUST be located at:

**Base components:**

```
packages/nimbus/src/components/{component}/{component}.dev.mdx
```

**Field patterns:**

```
packages/nimbus/src/patterns/fields/{component}/{component}.dev.mdx
```

### Test File Location (MANDATORY)

Documentation test files MUST be located alongside the component:

**Base components:**

```
packages/nimbus/src/components/{component}/{component}.docs.spec.tsx
```

**Field patterns:**

```
packages/nimbus/src/patterns/fields/{component}/{component}.docs.spec.tsx
```

### Required Frontmatter

```yaml
---
title: ComponentName Component # Use "Component" for base, "Pattern" for field
tab-title: Implementation # REQUIRED: Tab label (always "Implementation")
tab-order: 3 # REQUIRED: Tab position (always 3 for dev docs)
---
```

**Note**: Developer docs use minimal frontmatter because they appear as tabs,
not standalone pages.

## Content Structure (REQUIRED)

Write each section in the order and format given in `reference/content-structure.md`. List its sections with `rg -n '^##' .claude/skills/writing-developer-documentation/reference/content-structure.md`.

## Code Examples (jsx live-dev Blocks)

Follow the rules for `jsx live-dev` blocks in `reference/code-examples.md`.

## Documentation Test File Structure (MANDATORY)

Build the `.docs.spec.tsx` file to the structure in `reference/test-file-structure.md`.

## Create Mode

### Step 1: Determine Component Information

1. Parse component name and type from arguments
2. Locate the component files:
   - For base components: `packages/nimbus/src/components/{component-name}/`
   - For field patterns: `packages/nimbus/src/patterns/fields/{component-name}/`

3. Identify component characteristics by reading files:

   ```bash
   # For base components
   find packages/nimbus/src/components -type d -iname "*{component-name}*"

   # For field patterns
   find packages/nimbus/src/patterns/fields -type d -iname "*{component-name}*"
   ```

### Step 2: Analyze Component Features

**CRITICAL: This step determines what examples to create. Be thorough and
source-driven.**

1. **Read the component's TypeScript props interface**
   (`{component-name}.types.ts`):
   - Identify ALL props and their types
   - Note which features actually exist (size?, variant?, isDisabled?,
     isInvalid?, isReadOnly?, etc.)
   - Understand controlled/uncontrolled patterns (value/defaultValue/onChange)
   - Identify unique props specific to this component

2. **Read the component implementation** (`{component-name}.tsx`):
   - Identify React Aria integration (look for
     `import ... from 'react-aria-components'`)
   - Note external library dependencies (e.g., `@internationalized/date`)
   - Understand keyboard interactions and accessibility patterns
   - Note compound component structure if applicable

3. **Read existing Storybook stories** (`{component-name}.stories.tsx`) if
   available:
   - See what features are already demonstrated
   - Understand common use cases
   - Note edge cases and variations

**Analysis Checklist:**

- [ ] Size variants exist? (Look for `size?` prop in types)
- [ ] Visual variants exist? (Look for `variant?` prop in types)
- [ ] Dynamic collections? (Look for `items` prop)
- [ ] Slots/Adornments? (Look for `leadingElement`, `trailingElement`, `icon`)
- [ ] Component-specific unique props identified
- [ ] External libraries documented (check imports)
- [ ] Compound structure analyzed (check for namespace exports)
- [ ] Controlled/uncontrolled modes supported? (check for value/defaultValue)
- [ ] State props identified (isDisabled?, isInvalid?, isReadOnly?, isLoading?,
      etc.)
- [ ] Form-related props noted (name?, errors?, touched?, etc.)

**Key Principle:** Let the component's actual features dictate the
documentation. Don't force standard patterns if they don't exist in the
component.

### Step 3: Generate Documentation Plan

Based on your analysis, create a documentation plan:

```markdown
## Documentation Plan for {ComponentName}

### Component Characteristics

- **Type**: [Base Component / Field Pattern]
- **Complexity**: [Simple / Slot-Based / Compound / Complex]
- **Size Variants**: [Yes: sm, md, lg / No]
- **Visual Variants**: [Yes: list variants / No]
- **External Libraries**: [None / @internationalized/date / other]
- **Controlled/Uncontrolled**: [Both / Controlled only / Uncontrolled only]
- **Key Features**: [List 3-5 main features or props]

### Files to Create

- [ ] `{component-name}.dev.mdx` - Engineering documentation
- [ ] `{component-name}.docs.spec.tsx` - Companion test file (MANDATORY)

### Sections to Include (in .dev.mdx)

Based on component type and features:

- [ ] Frontmatter (required)
- [ ] Comparison section (field patterns only)
- [ ] Getting started (required)
- [ ] Library-specific section (if applicable)
- [ ] Usage examples (required)
  - [ ] Size options
  - [ ] Visual variants
  - [ ] [Feature 1]
  - [ ] [Feature 2]
  - [ ] Uncontrolled mode
  - [ ] Controlled mode
- [ ] Component requirements (required)
- [ ] Form integration (field patterns only)
- [ ] API reference (required)
- [ ] Common patterns (recommended)
- [ ] Testing your implementation (required) - uses `{{docs-tests:}}` injection
      token
- [ ] Resources (required)

### Example Generation Strategy

- Import patterns from similar components
- Create realistic, production-ready examples
- Show proper state management
- Include TypeScript types
- Use Nimbus components (Stack, Text, Button)

### Reference Components

Similar components to reference for patterns:

- [List 1-2 similar components in the codebase]
```

Display this plan to the user.

### Step 4: Generate Documentation Files

Create the documentation file:

1. **Start with the template**: Copy content structure from
   `@docs/engineering-docs-template.mdx`

2. **Update frontmatter**:

   ```yaml
   ---
   title: {ComponentName} [Component/Pattern] # Use "Pattern" for fields, "Component" for others
   tab-title: Implementation
   tab-order: 3
   ---
   ```

3. **Remove inapplicable sections**:
   - Remove comparison section for base components
   - Remove library-specific sections if not needed
   - Remove form integration for base components

4. **Replace all placeholders**:
   - `[ComponentName]` → Actual component name
   - `[COMPONENT_DESCRIPTION]` → Brief description from types
   - `[FEATURE_NAME]` → Actual feature names
   - All code examples with component-specific examples

5. **Generate realistic code examples**:
   - Use `jsx live-dev` for interactive examples
   - Follow the `const App = () => { }` pattern
   - Include proper TypeScript types
   - Show realistic state management with useState
   - Use actual component props and values

6. **Customize each section**:
   - **Getting started**: Import subsection + Basic usage subsection
   - **Usage examples**: Cover all features identified in Step 2
   - **Component requirements**: Document accessibility requirements (Role,
     Labeling, Keyboard), include "Persistent ID" tracking text
   - **Testing**: Include mandatory disclaimer paragraph +
     `{{docs-tests: {component-name}.docs.spec.tsx}}` injection token
   - **Resources**: Link to Storybook (use "link-tbd" placeholder), internal
     links must start with '/'

7. **Remove all HTML comments**: Clean up template guidance comments

8. **Determine output path**:
   - Base components:
     `packages/nimbus/src/components/{component-name}/{component-name}.dev.mdx`
   - Field patterns:
     `packages/nimbus/src/patterns/fields/{component-name}/{component-name}.dev.mdx`

9. **Write the `.dev.mdx` file** using the Write tool

10. **Create the companion `.docs.spec.tsx` test file** with:
    - Basic rendering tests (always)
    - Interaction tests (if interactive)
    - Controlled mode tests (if applicable)
    - State tests (disabled, invalid, etc. - if applicable)
    - Component-specific feature tests
    - All test sections with JSDoc tags (@docs-section, @docs-title,
      @docs-description, @docs-order)

11. **Write the `.docs.spec.tsx` file** using the Write tool

12. **Verify tests run**:
    ```bash
    pnpm test:unit {component-name}.docs.spec.tsx
    ```

### Step 5: Validation

After generating files, run validation checks (see Validate Mode section for
full checklist).

### Step 6: Summary Report

```markdown
## Documentation Created

**Component**: {ComponentName} **Type**: [Base Component / Field Pattern]

**Files Created**:

- `.dev.mdx`: {full-path-to-dev-mdx}
- `.docs.spec.tsx`: {full-path-to-docs-spec}

### Sections Included

- [List all sections included in .dev.mdx]

### Test Sections Created

- [List all test sections in .docs.spec.tsx with @docs-section IDs]

### Key Features Documented

- [List 3-5 main features]

### Code Examples

- Total interactive examples (jsx live-dev): X
- Total test sections (in .docs.spec.tsx): Y
- Total test cases: Z

### Next Steps

1. Review the generated documentation
2. Run tests: `pnpm test:unit {component-name}.docs.spec.tsx`
3. Build docs: `pnpm build:docs`
4. Test all interactive examples in the docs site
5. Update the Storybook link once available
6. Add any component-specific advanced patterns
```

## Update Mode

### Process

1. You MUST read the current documentation file (`.dev.mdx`)
2. You MUST read the current test file (`.docs.spec.tsx`)
3. You MUST identify gaps in implementation guidance
4. You SHOULD preserve existing code examples
5. You MUST maintain consistency with other developer docs
6. You MUST enhance with practical code patterns
7. If test file doesn't exist, create it (MANDATORY)
8. If test file exists, identify missing test patterns and add them

### Common Updates

- **Add missing examples** - New usage patterns, edge cases
- **Update API reference** - New props, changed behavior
- **Add common patterns** - Frequent implementation needs
- **Enhance accessibility docs** - Better a11y guidance
- **Improve code examples** - More realistic implementations
- **Add test cases** - Missing test patterns in `.docs.spec.tsx`
- **Update test sections** - Enhance existing test examples

## Validate Mode

### Validation Checklist

Run every item in `reference/validation-checklist.md`. Record each violation with its file and line. Write the report using `reference/validation-report.md`.

## Common Patterns by Component Type

Find the pattern that matches the component in `reference/component-patterns.md`. List its sections with `rg -n '^##' .claude/skills/writing-developer-documentation/reference/component-patterns.md`.

## Reference Examples by Component Type

Use the examples in `reference/examples.md` that match the component's complexity.

## Error Recovery

If validation fails:

1. You MUST check frontmatter fields (tab-title, tab-order, title suffix)
2. You MUST verify jsx live-dev blocks (not jsx live)
3. You MUST ensure PropsTable ID is correct
4. You MUST confirm import examples use correct package
5. You MUST check test file exists and has JSDoc tags
6. You MUST verify injection token is present in Testing section
7. You SHOULD review code examples for functionality
8. You SHOULD run tests to verify they pass

## RFC 2119 Key Words

MUST means required, SHOULD means recommended, and MAY means optional, as defined in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt). The full table is in `reference/rfc-2119.md`.

---

**Execute developer documentation operation for: $ARGUMENTS**
