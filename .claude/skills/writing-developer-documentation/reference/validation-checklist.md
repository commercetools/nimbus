# Developer Documentation Validation Checklist

### Validation Checklist

You MUST validate against these requirements:

#### File Structure

- [ ] Documentation file location:
      `packages/nimbus/src/components/{component}/{component}.dev.mdx` (or
      patterns/fields for field patterns)
- [ ] Test file location:
      `packages/nimbus/src/components/{component}/{component}.docs.spec.tsx` (or
      patterns/fields for field patterns)
- [ ] Test file exists (MANDATORY)
- [ ] Frontmatter with title, tab-title, tab-order
- [ ] tab-title is "Implementation"
- [ ] tab-order is 3
- [ ] Title uses "Component" suffix for base, "Pattern" for field

#### Content Structure

- [ ] Comparison section present (field patterns only)
- [ ] Getting started section with import
- [ ] Basic usage example
- [ ] Library-specific section (if component uses external library)
- [ ] Usage examples section
- [ ] Component requirements section with accessibility
- [ ] Form integration section (field patterns only)
- [ ] API reference with PropsTable
- [ ] Common patterns section (recommended)
- [ ] Testing your implementation section with injection token
- [ ] Resources section

#### Code Examples

- [ ] Uses `jsx live-dev` blocks (NOT `jsx live`)
- [ ] NO import statements in example code
- [ ] Examples show implementation patterns
- [ ] State management demonstrated where relevant
- [ ] Event handlers shown
- [ ] Proper TypeScript types in non-live code (import examples)

#### Test File Validation

- [ ] `.docs.spec.tsx` file exists
- [ ] All test sections have JSDoc tags (@docs-section, @docs-title,
      @docs-description, @docs-order)
- [ ] Basic rendering tests present
- [ ] Interaction tests present (if component is interactive)
- [ ] All renders wrapped with `<NimbusProvider>`
- [ ] Uses `vi.fn()` for mocks (not `jest.fn()`)
- [ ] Uses `userEvent.setup()` for interactions
- [ ] Tests are functional (run `pnpm test:unit {component}.docs.spec.tsx`)

#### Source-Driven Content Check

- [ ] **Usage examples reflect actual component props** (not generic template
      examples)
- [ ] Component props interface was analyzed before writing examples
- [ ] Only documented features that exist in the component
- [ ] No forced patterns (e.g., no "disabled state" if component has no
      `isDisabled` prop)
- [ ] Component-specific features are highlighted

#### Critical Pattern Compliance

- [ ] All interactive examples use `jsx live-dev` (NOT `jsx live`)
- [ ] Getting Started includes type import
      (`import { ComponentName, type ComponentNameProps }`)
- [ ] Controlled examples use proper type patterns
- [ ] Testing section includes mandatory disclaimer paragraph (as regular text,
      not comment)
- [ ] Testing section has `{{docs-tests: {component-name}.docs.spec.tsx}}`
      injection token
- [ ] Accessibility section includes standard boilerplate
- [ ] Accessibility includes PERSISTENT_ID tracking pattern
- [ ] Accessibility includes Keyboard navigation subsection

#### Technical Focus

- [ ] Content is developer-focused (NOT design)
- [ ] Explains HOW to implement
- [ ] Props usage documented
- [ ] Event handlers explained
- [ ] Controlled/uncontrolled patterns shown
- [ ] Accessibility implementation detailed

#### API Documentation

- [ ] PropsTable component used correctly
- [ ] Component ID matches TypeScript export
- [ ] Additional prop documentation if needed
- [ ] Return types documented (for hooks)

#### Link Checklist

- [ ] Storybook link uses actual URL pattern (when available)
- [ ] Field patterns link to FormField and FieldErrors
- [ ] Field patterns link to base component
- [ ] External documentation links added (React Aria, ARIA patterns)
- [ ] **Internal component links start with '/'** (e.g.,
      `/components/inputs/searchinput`)

#### Code Quality

- [ ] Examples are functional and realistic
- [ ] State management follows best practices
- [ ] Event handlers use proper patterns
- [ ] Accessibility requirements clear
- [ ] Performance considerations mentioned
- [ ] Tests pass when run
