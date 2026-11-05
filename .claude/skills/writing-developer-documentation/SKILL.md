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

Before implementation, you MUST research in parallel:

1. **Read** documentation guidelines:

   ```bash
   cat docs/file-type-guidelines/documentation.md
   ```

2. **Read** JSDoc standards for test sections:

   ```bash
   cat docs/jsdoc-standards.md
   ```

   Pay special attention to @docs-section, @docs-title, @docs-description,
   @docs-order tags

3. **Review** component implementation files for API understanding:
   - `{component-name}.tsx` - Main component implementation
   - `{component-name}.types.ts` - Props and types
   - `{component-name}.recipe.ts` - Visual variants (if exists)
   - `{component-name}.slots.tsx` - Slot components (if exists)
   - `components/` directory - Compound component parts (if exists)
   - `{component-name}.stories.tsx` - Existing usage examples

4. **Check** similar documentation:

   ```bash
   ls packages/nimbus/src/components/*/*.dev.mdx
   ls packages/nimbus/src/components/*/*.docs.spec.tsx
   ```

   (for base components, or `ls packages/nimbus/src/patterns/fields/*/*` for
   field patterns)

5. **Also read** for comprehensive reference:
   - `@docs/engineering-docs-template.mdx` for base template structure
   - `@docs/engineering-docs-template-guide.md` for detailed usage instructions
   - `@docs/engineering-docs-validation.md` for validation criteria

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

### Validation Report Format

```markdown
## Developer Documentation Validation: {ComponentName}

### Status: [✅ PASS | ❌ FAIL | ⚠️ WARNING]

### Files Reviewed

- Documentation file: `{component}.dev.mdx`
- Test file: `{component}.docs.spec.tsx`
- Types file: `{component}.types.ts`
- Guidelines: `docs/file-type-guidelines/documentation.md`

### ✅ Compliant

[List passing checks]

### ❌ Violations (MUST FIX)

- [Violation with guideline reference and line number]

### ⚠️ Warnings (SHOULD FIX)

- [Non-critical improvements]

### Test File Status

- Test file exists: [Yes/No]
- Test sections present: [List @docs-section IDs]
- Tests are functional: [Pass/Fail]
- JSDoc tags complete: [Yes/No/Partial]

### Technical Quality Assessment

- Code examples: [Functional | Needs fixes | Non-functional]
- API documentation: [Complete | Partial | Missing]
- Implementation patterns: [Comprehensive | Adequate | Insufficient]
- Accessibility guidance: [Detailed | Basic | Missing]
- Test coverage: [Complete | Partial | Missing]

### Recommendations

- [Specific improvements needed]
```

## Common Patterns by Component Type

### Form Components

**MUST document:**

- Controlled vs uncontrolled usage
- onChange handler signature
- Validation patterns
- Error state handling
- Form integration examples (Formik for field patterns)
- Ref forwarding (if applicable)

**MUST test:**

- Basic rendering with label
- Value changes (controlled mode)
- Error state display
- Form submission

### Interactive Components

**MUST document:**

- Event handlers (onPress, onClick, etc.)
- Keyboard interaction implementation
- Focus management
- State management patterns
- Disabled state handling

**MUST test:**

- Basic rendering
- User interactions (click, press, etc.)
- Keyboard interactions
- Disabled state

### Compound Components

**MUST document:**

- Component hierarchy and structure
- Context usage
- Props for each sub-component
- Composition patterns
- Common configurations

**MUST test:**

- Basic compound structure rendering
- Sub-component interactions
- Context propagation
- Invalid compositions (negative tests)

### Overlay Components

**MUST document:**

- Open/close state management
- Controlled vs uncontrolled
- Focus restoration
- Portal behavior
- Dismissal patterns
- Positioning options

**MUST test:**

- Opening and closing
- Focus management
- Dismissal (ESC, outside click)
- Portal rendering (use `waitFor` with document queries)

## Special Cases

### Compound Components

For compound components (e.g., Menu.Root, Menu.Item):

- Show the compound structure in examples
- Document each part's purpose
- Show composition patterns
- Include proper TypeScript types for all parts
- Test each sub-component independently and together

### Field Pattern Components

For field patterns (e.g., TextInputField):

- Include comparison section at the top
- Show form integration with Formik
- Document error handling with FieldErrors
- Show touched state handling
- Link to base component and FormField
- Test error display and form integration

### Components with External Libraries

For components using external libraries (e.g., @internationalized/date):

- Add dedicated "Working with [Library]" section explaining library concepts
- Show type imports and usage
- Demonstrate conversion patterns
- Link to library documentation
- Test library-specific value handling

### Dynamic Collections

For components supporting `items` prop (e.g., Select, ListBox):

- Document `items` vs static children
- Provide examples of dynamic data mapping
- Explain the render prop pattern:
  `<Component items={items}>{(item) => ...}</Component>`
- Test both static and dynamic rendering

## Reference Examples by Component Type

When generating documentation, reference these patterns based on component type:

### Simple Components (Button, Badge, TextInput)

**Best Reference**:
`packages/nimbus/src/components/text-input/text-input.dev.mdx`

- Minimal library dependencies
- Standard usage examples
- Clear accessibility guidance
- Focus: Visual variants, states (if applicable), controlled/uncontrolled modes

### Compound Components (Select, Menu)

**Best Reference**: `packages/nimbus/src/components/select/select.dev.mdx`

- Multiple sub-components
- Option groups and dynamic rendering
- Portal content testing
- Focus: Compound structure, composition patterns, keyboard navigation

### Components with External Libraries (DatePicker, DateRangePicker)

**Best Reference**:
`packages/nimbus/src/components/date-range-picker/date-range-picker.dev.mdx`

- "Working with [library]" section
- Library-specific types and conversions
- External library documentation links
- Focus: Library integration, type conversions, special value handling

### Field Patterns (TextInputField, DateRangePickerField)

**Best Reference**:
`packages/nimbus/src/patterns/fields/date-range-picker-field/date-range-picker-field.dev.mdx`
or
`packages/nimbus/src/patterns/fields/text-input-field/text-input-field.dev.mdx`

- Comparison section (field vs manual composition)
- Error handling with FieldErrors
- Form integration with Formik
- Links to base component and FormField
- Focus: Form patterns, error handling, validation

**IMPORTANT**: These are references for structure and patterns, NOT content.
Always generate examples based on the specific component's actual features and
props.

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

- **MUST** / **REQUIRED** / **SHALL** - Absolute requirement
- **MUST NOT** / **SHALL NOT** - Absolute prohibition
- **SHOULD** / **RECOMMENDED** - Should do unless valid reason not to
- **SHOULD NOT** / **NOT RECOMMENDED** - Should not do unless valid reason
- **MAY** / **OPTIONAL** - Truly optional

---

**Execute developer documentation operation for: $ARGUMENTS**
