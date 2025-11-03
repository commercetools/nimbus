---
name: generate-eng-docs
description: Generate engineering documentation for a Nimbus component following the approved team template
command: |
  Generate engineering documentation for the {{COMPONENT_NAME}} component following the EXACT structure approved by the team.
  
  Instructions:
  1. First, analyze the component by reading these files:
     - packages/nimbus/src/components/{{COMPONENT_NAME}}/{{COMPONENT_NAME}}.tsx
     - packages/nimbus/src/components/{{COMPONENT_NAME}}/{{COMPONENT_NAME}}.types.ts
     - packages/nimbus/src/components/{{COMPONENT_NAME}}/{{COMPONENT_NAME}}.mdx
     - packages/nimbus/src/components/{{COMPONENT_NAME}}/{{COMPONENT_NAME}}.stories.tsx
     - packages/nimbus/src/components/{{COMPONENT_NAME}}/{{COMPONENT_NAME}}.recipe.ts (if exists)
     - packages/nimbus/src/components/{{COMPONENT_NAME}}/components/ (if exists)
  
  2. Create file: packages/nimbus/src/components/{{COMPONENT_NAME}}/{{COMPONENT_NAME}}-dev.mdx
  
  3. Use this EXACT structure (maintain this order and these exact headings):
  
  ```mdx
  ---
  id: Components-{{COMPONENT_NAME}}-dev
  title: {{Component Name}} Engineering Guidelines
  description: Engineering guideline for using the Nimbus {{Component Name}} component
  documentState: InitialDraft
  order: 999
  menu:
    - Components
    - [Category] # Data Display, Navigation, Inputs, Feedback, etc.
    - {{ComponentName}}Dev
  tags:
    - component
    - engineering
    - migration
  ---
  
  # {{Component Name}} Component
  
  Brief introduction paragraph about the component's purpose and architecture.
  
  ## Component Anatomy
  
  [This section is OPTIONAL - only include for complex components]
  Description of the component's structure. For compound components, show the hierarchy:
  
  ```
  Component.Root
  ├── Component.Trigger
  └── Component.Content
      ├── Component.Item
      └── Component.Separator
  ```
  
  ## Component Usage
  
  ### How to Import
  
  ```tsx
  import { {{ComponentName}} } from '@commercetools/nimbus';
  ```
  
  For TypeScript projects, import types:
  ```tsx
  import { {{ComponentName}}, type {{ComponentName}}Props } from '@commercetools/nimbus';
  ```
  
  ### Basic Example
  
  ```jsx-live-dev
  const App = () => (
    <{{ComponentName}}>
      Basic implementation example
    </{{ComponentName}}>
  )
  ```
  
  ### Common props and Variations
  
  Brief introduction to the most commonly used props.
  
  #### [Variation 1 - e.g., Size Options]
  
  ```jsx-live-dev
  const App = () => (
    <Stack direction="row" gap="400">
      <{{ComponentName}} size="sm">Small</{{ComponentName}}>
      <{{ComponentName}} size="md">Medium</{{ComponentName}}>
      <{{ComponentName}} size="lg">Large</{{ComponentName}}>
    </Stack>
  )
  ```
  
  #### [Variation 2 - e.g., Variant Options]
  
  ```jsx-live-dev
  const App = () => (
    <Stack direction="row" gap="400">
      <{{ComponentName}} variant="solid">Solid</{{ComponentName}}>
      <{{ComponentName}} variant="outline">Outline</{{ComponentName}}>
      <{{ComponentName}} variant="ghost">Ghost</{{ComponentName}}>
    </Stack>
  )
  ```
  
  [Add more variations as needed based on the component]
  
  ## Testing Strategies and Best Practices
  
  Brief introduction to testing approaches.
  
  #### 1. Unit Testing with React Testing Library
  
  ```tsx
  import { render, screen } from '@testing-library/react';
  import { {{ComponentName}} } from '@commercetools/nimbus';
  
  describe('{{ComponentName}}', () => {
    it('renders correctly', () => {
      render(<{{ComponentName}}>Test content</{{ComponentName}}>);
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
      // Test interactions based on component behavior
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
  
  Common implementation patterns for the component.
  
  #### Hooks
  
  [If component provides hooks, show usage]
  
  ```tsx
  const use{{ComponentName}} = (options) => {
    // Hook implementation pattern
  };
  ```
  
  ### API Reference
  
  | Prop | Type | Default | Description |
  |------|------|---------|-------------|
  | `prop1` | `string` | - | Description |
  | `prop2` | `boolean` | `false` | Description |
  | `prop3` | `'option1' \| 'option2'` | `'option1'` | Description |
  
  [Include key props - full reference should link to PropsTable]
  
  See full API documentation: [{{Component Name}} API Reference](/components/{{component-name}})
  
  ### Need Help?
  
  - 📚 **[Storybook](https://nimbus-storybook.vercel.app)** - Interactive examples
  - 💬 **[Slack Channel](https://commercetools.slack.com/channels/nimbus)** - Get support
  - 📖 **[User Documentation](/components/{{component-name}})** - User-facing docs
  - 🎨 **[Figma](link-if-available)** - Design specifications
  ```
  
  IMPORTANT: Follow this template EXACTLY. Do not add, remove, or reorder sections. The goal is maximum consistency across all engineering docs.
---

# Generate Engineering Documentation

This command generates engineering documentation following the team-approved template structure for maximum consistency.

## Usage

```
/generate-eng-docs button
```

Replace `button` with the name of any component in the Nimbus library (e.g., `menu`, `data-table`, `text-input`).

## What it does

1. Analyzes the component's source files:
   - Implementation (.tsx)
   - Types (.types.ts)
   - User docs (.mdx)
   - Stories (.stories.tsx)
   - Recipe (.recipe.ts)
   - Sub-components (if compound)

2. Generates documentation following the EXACT approved structure:
   - Frontmatter with correct metadata
   - Component anatomy (optional for complex components)
   - Component usage with import and examples
   - Testing strategies and best practices
   - Quick reference summary
   - Help resources

## Template Structure

The command enforces this exact section order:
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

Creates: `packages/nimbus/src/components/{component-name}/{component-name}-dev.mdx`

This engineering documentation complements the user-facing docs with technical implementation details, testing approaches, and developer-focused guidance.