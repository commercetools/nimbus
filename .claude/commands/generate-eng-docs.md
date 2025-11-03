---
name: generate-eng-docs
description:
  Generate engineering documentation for a Nimbus component or pattern following the
  approved team template
command: |
  Generate engineering documentation for the {{NAME}} {{TYPE}} following the EXACT structure approved by the team.
  
  Determine the type by checking:
  - If path contains 'patterns/', then TYPE = 'pattern'
  - If path contains 'components/', then TYPE = 'component'
  - Default to 'component' if not specified

  Instructions:
  1. First, analyze the {{TYPE}} by reading these files:
     For components:
     - packages/nimbus/src/components/{{NAME}}/{{NAME}}.tsx
     - packages/nimbus/src/components/{{NAME}}/{{NAME}}.types.ts
     - packages/nimbus/src/components/{{NAME}}/{{NAME}}.mdx
     - packages/nimbus/src/components/{{NAME}}/{{NAME}}.stories.tsx
     - packages/nimbus/src/components/{{NAME}}/{{NAME}}.recipe.ts (if exists)
     - packages/nimbus/src/components/{{NAME}}/components/ (if exists)
     
     For patterns:
     - packages/nimbus/src/patterns/{{CATEGORY}}/{{NAME}}/{{NAME}}.tsx
     - packages/nimbus/src/patterns/{{CATEGORY}}/{{NAME}}/{{NAME}}.types.ts
     - packages/nimbus/src/patterns/{{CATEGORY}}/{{NAME}}/{{NAME}}.mdx
     - packages/nimbus/src/patterns/{{CATEGORY}}/{{NAME}}/{{NAME}}.stories.tsx
     - Any other relevant files in the pattern directory

  2. Create file: 
     - For components: packages/nimbus/src/components/{{NAME}}/{{NAME}}-dev.mdx
     - For patterns: packages/nimbus/src/patterns/{{CATEGORY}}/{{NAME}}/{{NAME}}-dev.mdx

  3. Use this EXACT structure (maintain this order and these exact headings):

  ```mdx
  ---
  id: {{TYPE_CAPITALIZED}}-{{NAME}}-dev
  title: {{Name}} Engineering Guidelines
  description: Engineering guideline for using the Nimbus {{Name}} {{TYPE}}
  documentState: InitialDraft
  order: 999
  menu:
    - {{TYPE_CAPITALIZED}}
    - [Category] # For components: Data Display, Navigation, Inputs, Feedback, etc.
                # For patterns: Fields, Layouts, Complex Interactions, etc.
    - {{Name}}Dev
  tags:
    - {{TYPE}}
    - engineering
    - migration
  ---

  # {{Name}} {{TYPE_CAPITALIZED}}

  Brief introduction paragraph about the {{TYPE}}'s purpose and architecture.

  ## {{TYPE_CAPITALIZED}} Anatomy

  [This section is OPTIONAL - only include for complex {{TYPE}}s]
  Description of the {{TYPE}}'s structure. For compound {{TYPE}}s, show the hierarchy:

  ```
  Component.Root
  ├── Component.Trigger
  └── Component.Content
      ├── Component.Item
      └── Component.Separator
  ```

  ## {{TYPE_CAPITALIZED}} Usage

  ### How to Import

  ```tsx
  import { {{Name}} } from '@commercetools/nimbus';
  ```

  For TypeScript projects, import types:
  ```tsx
  import { {{Name}}, type {{Name}}Props } from '@commercetools/nimbus';
  ```

  ### Basic Example

  ```jsx-live-dev
  const App = () => (
    <{{Name}}>
      Basic implementation example
    </{{Name}}>
  )
  ```

  ### Common props and Variations

  Brief introduction to the most commonly used props.

  #### [Variation 1 - e.g., Size Options]

  ```jsx-live-dev
  const App = () => (
    <Stack direction="row" gap="400">
      <{{Name}} size="sm">Small</{{Name}}>
      <{{Name}} size="md">Medium</{{Name}}>
      <{{Name}} size="lg">Large</{{Name}}>
    </Stack>
  )
  ```

  #### [Variation 2 - e.g., Variant Options]

  ```jsx-live-dev
  const App = () => (
    <Stack direction="row" gap="400">
      <{{Name}} variant="solid">Solid</{{Name}}>
      <{{Name}} variant="outline">Outline</{{Name}}>
      <{{Name}} variant="ghost">Ghost</{{Name}}>
    </Stack>
  )
  ```

  [Add more variations as needed based on the {{TYPE}}]

  ## Testing Strategies and Best Practices

  Brief introduction to testing approaches.

  #### 1. Unit Testing with React Testing Library

  ```tsx
  import { render, screen } from '@testing-library/react';
  import { {{Name}} } from '@commercetools/nimbus';

  describe('{{Name}}', () => {
    it('renders correctly', () => {
      render(<{{Name}}>Test content</{{Name}}>);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });
  });
  ```

  #### 2. Storybook Integration for Testing

  Leverage existing stories for visual testing:

  ```tsx
  export const InteractionTest: Story = {
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      // Test interactions based on {{TYPE}} behavior
    },
  };
  ```

  #### 3. Regression tests

  **[Placeholder for regression test strategy]**
  - Visual regression with Chromatic
  - Behavior regression with interaction tests
  - API contract testing

  ### 4. Accessibility requirements

  - Keyboard navigation: [Describe keyboard patterns]
  - Screen reader support: [Describe announcements]
  - ARIA attributes: [List key ARIA attributes]
  - Color contrast: Meets WCAG AA standards

  ## Quick Reference Summary

  ### Design Guidelines

  - [Key design principle 1]
  - [Key design principle 2]
  - [Key design principle 3]

  ### Code Patterns

  Common implementation patterns for the {{TYPE}}.

  #### Hooks

  [If {{TYPE}} provides hooks, show usage]

  ```tsx
  const use{{Name}} = (options) => {
    // Hook implementation pattern
  };
  ```

  ### API Reference

  <PropsTable id="{{Name}}" />

  ### Need Help?

  - 📚 **[Storybook](https://nimbus-storybook.vercel.app)** - Interactive examples
  - 💬 **[Slack Channel](https://commercetools.slack.com/channels/nimbus)** - Get support
  - 📖 **[User Documentation](/{{TYPE}}s/{{NAME_KEBAB}})** - User-facing docs
  - 🎨 **[Figma](link-if-available)** - Design specifications
  ```

  IMPORTANT: Follow this template EXACTLY. Do not add, remove, or reorder sections. The goal is maximum consistency across all engineering docs.
---

# Generate Engineering Documentation

This command generates engineering documentation following the team-approved
template structure for maximum consistency. It works for both components and
patterns.

## Usage

### For Components:
```
/generate-eng-docs button
```

### For Patterns:
```
/generate-eng-docs fields/date-range-picker-field
```

Replace the argument with:
- Component name (e.g., `button`, `menu`, `data-table`)
- Pattern path (e.g., `fields/date-range-picker-field`, `layouts/card-grid`)

## What it does

1. Automatically detects whether it's a component or pattern based on the path

2. Analyzes the source files:

   - Implementation (.tsx)
   - Types (.types.ts)
   - User docs (.mdx)
   - Stories (.stories.tsx)
   - Recipe (.recipe.ts) - for components
   - Sub-components (if compound)
   - Any pattern-specific files

3. Generates documentation following the EXACT approved structure:
   - Frontmatter with correct metadata
   - Component anatomy (optional for complex components)
   - Component usage with import and examples
   - Testing strategies and best practices
   - Quick reference summary
   - Help resources

## Template Structure

The command enforces this exact section order while adapting terminology
based on whether it's a component or pattern:

1. **Component Anatomy** (optional)
2. **Component Usage**
   - How to Import
   - Basic Example
   - Common props and Variations
3. **Testing Strategies and Best Practices**
   - Unit Testing
   - Storybook Integration
   - Regression tests
   - Accessibility requirements
4. **Quick Reference Summary**
   - Design Guidelines
   - Code Patterns
   - API Reference
   - Need Help?

## Output

Creates:
- Components: `packages/nimbus/src/components/{component-name}/{component-name}-dev.mdx`
- Patterns: `packages/nimbus/src/patterns/{category}/{pattern-name}/{pattern-name}-dev.mdx`

This engineering documentation complements the user-facing docs with technical
implementation details, testing approaches, and developer-focused guidance.
