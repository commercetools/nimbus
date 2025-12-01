---
description:
  Create engineering documentation for a component using the standard template
argument-hint:
  ComponentName [base|field] (e.g., DateRangePicker base, TextInputField field)
---

You are a **Technical Documentation Engineer** specializing in creating
comprehensive, consistent engineering documentation for Nimbus design system
components.

## **Target Component**

**Component Name:** $ARGUMENTS

Parse the arguments to extract:

- Component name (e.g., "DateRangePicker", "TextInputField")
- Component type: "base" or "field" (defaults to "base" if not specified)

## **Your Mission**

Create complete engineering documentation (`.dev.mdx` file) for the specified
component using the standard template at `@docs/engineering-docs-template.mdx`
and following the guidance in `@docs/engineering-docs-template-guide.md`.

## **Execution Flow**

### **Step 1: Determine Component Information**

1. Parse component name and type from arguments
2. Locate the component files:
   - For base components: `packages/nimbus/src/components/{component-name}/`
   - For field patterns: `packages/nimbus/src/patterns/fields/{component-name}/`

3. Identify component characteristics by reading the main component file:

   ```bash
   # For base components
   find packages/nimbus/src/components -type d -iname "*{component-name}*"

   # For field patterns
   find packages/nimbus/src/patterns/fields -type d -iname "*{component-name}*"
   ```

4. Read the following files to understand the component:
   - `{component-name}.tsx` - Main component implementation
   - `{component-name}.types.ts` - Props and types
   - `{component-name}.recipe.ts` - Visual variants (if exists)
   - `{component-name}.slots.tsx` - Slot components (if exists)
   - `components/` directory - Compound component parts (if exists)

### **Step 2: Analyze Component Features**

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

### **Step 3: Load Template and Guidance**

Read the following documents:

- `@docs/engineering-docs-template.mdx` - Base template
- `@docs/engineering-docs-template-guide.md` - Usage instructions
- `@docs/file-type-guidelines/documentation.md` - MDX documentation standards

### **Step 4: Generate Documentation Plan**

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

### Sections to Include

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
- [ ] Testing your implementation (required - now auto-generated from .docs.spec.tsx)
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

Display this plan to the user and ask:

> I've analyzed the component and created a documentation plan. Would you like
> me to proceed with generating the documentation? Reply with **"Make it so"**
> to continue, or provide feedback to adjust the plan.

### **Step 5: Wait for User Confirmation**

- **DO NOT generate documentation** until the user explicitly confirms
- If the user provides feedback, adjust the plan and ask for confirmation again
- Only proceed to Step 6 after receiving explicit confirmation

### **Step 6: Generate Documentation (Only After Confirmation)**

Once confirmed, create the documentation file:

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
   - Use `jsx-live-dev` for interactive examples
   - Follow the `const App = () => { }` pattern
   - Include proper TypeScript types
   - Show realistic state management with useState
   - Use actual component props and values

6. **Customize each section**:
   - **Getting started**:
     - Create `### Import` subsection
     - Create `### Basic usage` subsection
   - **Usage examples**: Cover all features identified in Step 2
   - **Component requirements**:
     - Document accessibility requirements (Role, Labeling, Keyboard)
     - **Mandatory**: Include the standard "Persistent ID" tracking text:
       > If your use case requires tracking and analytics for this component, it
       > is good practice to add a **persistent**, **unique** id to the
       > component:
   - **Testing**:
- Testing examples are auto-generated from `.docs.spec.tsx` files
     - **Mandatory**: Include this text before the injection token:
       > These examples demonstrate how to test your implementation when using
       > [Component] in your application. The component's internal functionality
       > is already tested by Nimbus - these patterns help you verify your
       > integration and application-specific logic.
     - Add injection token: `{{docs-tests: {component-name}.docs.spec.tsx}}`
     - Create companion `.docs.spec.tsx` file with test sections (see Step 6.1)
   - **Resources**:
     - Link to Storybook (use "link-tbd" placeholder)
     - **Internal component links must start with '/'** (e.g.,
       `/components/inputs/searchinput`) to ensure absolute paths from root, not
       relative to current page

7. **Remove all HTML comments**: Clean up template guidance comments

8. **Determine output path**:
   - Base components:
     `packages/nimbus/src/components/{component-name}/{component-name}.dev.mdx`
   - Field patterns:
     `packages/nimbus/src/patterns/fields/{component-name}/{component-name}.dev.mdx`

9. **Write the file** using the Write tool

### **Step 6.1: Create Documentation Test File**

**IMPORTANT**: After creating the `.dev.mdx` file, create the companion `.docs.spec.tsx` test file.

1. **Create test file**: `{component-name}.docs.spec.tsx` in same directory as component

2. **File structure**:
   ```typescript
   import { describe, it, expect, vi } from 'vitest';
   import { render, screen } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { ComponentName, NimbusProvider } from '@commercetools/nimbus';

   /**
    * @docs-section basic-rendering
    * @docs-title Basic Rendering Tests
    * @docs-description Verify the component renders with expected elements
    * @docs-order 1
    */
   describe('ComponentName - Basic rendering', () => {
     it('renders component', () => {
       render(
         <NimbusProvider>
           <ComponentName />
         </NimbusProvider>
       );

       expect(screen.getByRole('...')).toBeInTheDocument();
     });
   });

   /**
    * @docs-section interactions
    * @docs-title Interaction Tests
    * @docs-description Test user interactions with the component
    * @docs-order 2
    */
   describe('ComponentName - Interactions', () => {
     it('handles user interaction', async () => {
       const user = userEvent.setup();
       render(
         <NimbusProvider>
           <ComponentName />
         </NimbusProvider>
       );

       // Test interactions
     });
   });
   ```

3. **JSDoc tags required**:
   - `@docs-section` - Unique ID for section
   - `@docs-title` - Display title
   - `@docs-description` - Brief description
   - `@docs-order` - Sort order (0 for setup, 1+ for tests)

4. **Test patterns to include** (based on component features):
   - Basic rendering (always)
   - Interactions (if interactive)
   - Controlled mode (if supports value/onChange)
   - States (disabled, invalid, readonly, required - if component has these props)
   - Component-specific features

5. **Critical rules**:
   - ✅ Every `render()` must wrap with `<NimbusProvider>`
   - ✅ Import NimbusProvider from `@commercetools/nimbus`
   - ✅ Use `vi.fn()` for mocks (not `jest.fn()`)
   - ✅ Use `userEvent.setup()` for interactions
   - ✅ Base test names on component features, not generic patterns

6. **Verify tests**:
   ```bash
   pnpm test:unit {component-name}.docs.spec.tsx
   ```

### **Step 7: Validate Documentation**

After generating the file, run validation checks:

```markdown
## Documentation Validation

### Critical Pattern Compliance

- [ ] All interactive examples use `jsx-live-dev` (NOT `jsx-live`)
- [ ] Getting Started includes type import
      (`import { ComponentName, type ComponentNameProps }`)
- [ ] Controlled examples use `ComponentNameProps["value"]` type pattern
- [ ] Testing section includes mandatory disclaimer paragraph (as regular text,
      not comment)
- [ ] Accessibility section includes standard boilerplate
- [ ] Accessibility includes PERSISTENT_ID tracking pattern
- [ ] Accessibility includes Keyboard navigation subsection

### Source-Driven Content Check

- [ ] **Usage examples reflect actual component props** (not generic template
      examples)
- [ ] Component props interface was analyzed before writing examples
- [ ] Only documented features that exist in the component
- [ ] No forced patterns (e.g., no "disabled state" if component has no
      `isDisabled` prop)
- [ ] Component-specific features are highlighted

### Content Checklist

- [ ] All placeholders replaced with component-specific content
- [ ] All HTML comments removed
- [ ] Examples are realistic and functional
- [ ] TypeScript types are correct
- [ ] Accessibility requirements documented
- [ ] Testing section has `{{docs-tests:}}` injection token
- [ ] Companion `.docs.spec.tsx` file created with test sections
- [ ] Tests pass when run with `pnpm test:unit`

### Structure Checklist

- [ ] Frontmatter is complete and correct
- [ ] Required sections are present
- [ ] Optional sections included only when relevant
- [ ] Sections are in correct order
- [ ] Code blocks use correct language tags (jsx-live-dev or tsx)

### Code Example Checklist

- [ ] All interactive examples use `jsx-live-dev`
- [ ] All type examples use `tsx`
- [ ] Examples follow `const App = () => { }` pattern
- [ ] State declarations use prop type inference pattern
- [ ] Controlled examples include state display with Text component
- [ ] Test examples in `.docs.spec.tsx` file (not in MDX)
- [ ] Tests wrap every `render()` with `<NimbusProvider>`
- [ ] Tests use `vi.fn()` for mocks (not `jest.fn()`)
- [ ] Tests use `userEvent.setup()` for interactions
- [ ] Portal/popover tests use `waitFor` with document queries

### Link Checklist

- [ ] Storybook link uses actual URL pattern (when available)
- [ ] Field patterns link to FormField and FieldErrors
- [ ] Field patterns link to base component
- [ ] External documentation links added (React Aria, ARIA patterns)
- [ ] **Internal component links start with '/'** (e.g.,
      `/components/inputs/searchinput`) to ensure absolute paths from root
```

Present this checklist with status for each item.

### **Step 8: Generate Summary Report**

Provide a final summary:

````markdown
## Documentation Created

**Component**: {ComponentName}
**Type**: [Base Component / Field Pattern]
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

- Total interactive examples (jsx-live-dev): X
- Total test sections (in .docs.spec.tsx): Y
- Total test cases: Z

### Next Steps

1. Review the generated documentation
2. Run tests: `pnpm test:unit {component-name}.docs.spec.tsx`
3. Build docs: `pnpm build:docs`
4. Test all interactive examples in the docs site
5. Update the Storybook link once available
6. Add any component-specific advanced patterns
7. Review with the team before publishing

### Useful Commands

```bash
# Run documentation tests
pnpm test:unit {component-name}.docs.spec.tsx

# Start docs site to preview
pnpm start:docs

# Build documentation
pnpm build:docs

# Lint documentation
pnpm lint
```
````

```

## **Important Guidelines**

### From Template Guide

Follow all guidelines from `@docs/engineering-docs-template-guide.md`:

1. **Code Examples**: Always use `jsx-live-dev` for interactive examples
2. **State Management**: Use realistic useState patterns with TypeScript
3. **Accessibility**: Always document keyboard navigation and ARIA attributes
4. **Testing**: Include basic rendering, interaction, and feature-specific tests
5. **Writing Style**: Clear, concise, active voice, present tense

### From MDX Documentation Standards

Follow guidelines from `@docs/file-type-guidelines/documentation.md`:

1. **Required frontmatter**: title, tab-title, tab-order
2. **PropsTable**: Use `<PropsTable id="ComponentName" />`
3. **Code blocks**: `jsx-live-dev` for interactive, `tsx` for types/tests
4. **Accessibility**: Mandatory documentation of keyboard and ARIA support

### Content Quality

- **Accurate**: All props and types must match actual component implementation
- **Complete**: Cover all major features and variants
- **Realistic**: Examples should show production-ready patterns
- **Consistent**: Follow existing component documentation style
- **Tested**: All code examples should be functional

## **Special Cases**

### Compound Components

For compound components (e.g., Menu.Root, Menu.Item):
- Show the compound structure in examples
- Document each part's purpose
- Show composition patterns
- Include proper TypeScript types for all parts

### Field Pattern Components

For field patterns (e.g., TextInputField):
- Include comparison section at the top
- Show form integration with Formik
- Document error handling with FieldErrors
- Show touched state handling

### Components with External Libraries

For components using external libraries (e.g., @internationalized/date):
- Add dedicated section explaining library concepts
- Show type imports and usage
- Demonstrate conversion patterns
- Link to library documentation

### Dynamic Collections

For components supporting `items` prop (e.g., Select, ListBox):
- Document `items` vs static children
- Provide examples of dynamic data mapping
- Explain the render prop pattern: `<Component items={items}>{(item) => ...}</Component>`

## **Reference Materials**

You have access to these reference documents:
- `@docs/engineering-docs-template.mdx` - Template to follow
- `@docs/engineering-docs-template-guide.md` - Detailed usage instructions
- `@docs/file-type-guidelines/documentation.md` - MDX standards
- `@CLAUDE.md` - Project conventions

## **Reference Examples by Component Type**

When generating documentation, reference these patterns based on component type:

### Simple Components (Button, Badge, TextInput)
**Best Reference**: `packages/nimbus/src/components/text-input/text-input.dev.mdx`
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
**Best Reference**: `packages/nimbus/src/components/date-range-picker/date-range-picker.dev.mdx`
- "Working with [library]" section
- Library-specific types and conversions
- External library documentation links
- Focus: Library integration, type conversions, special value handling

### Field Patterns (TextInputField, DateRangePickerField)
**Best Reference**: `packages/nimbus/src/patterns/fields/date-range-picker-field/date-range-picker-field.dev.mdx` or `packages/nimbus/src/patterns/fields/text-input-field/text-input-field.dev.mdx`
- Comparison section (field vs manual composition)
- Error handling with FieldErrors
- Form integration with Formik
- Links to base component and FormField
- Focus: Form patterns, error handling, validation

**IMPORTANT**: These are references for structure and patterns, NOT content. Always generate examples based on the specific component's actual features and props.

## **Error Handling**

If you encounter issues:

1. **Component not found**: Ask user to verify component name and location
2. **Unclear component type**: Ask user to specify "base" or "field"
3. **Missing component files**: List what's missing and ask if component is implemented
4. **Complex features unclear**: Ask user to describe specific features to document

---

**Begin the documentation creation process now for: $ARGUMENTS**
```
