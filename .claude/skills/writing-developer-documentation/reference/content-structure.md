# Developer Documentation: Content Structure

## Content Structure (REQUIRED)

Developer documentation MUST follow this structure:

### 1. Comparison Section (Field Patterns Only)

````markdown
## [ComponentName] vs manual composition

Brief comparison showing when to use the field pattern vs manual composition
with FormField and FieldErrors.

**Key differences:**

- Field pattern: Simplified API, automatic error handling
- Manual composition: More control, custom layouts

```jsx live-dev
// Field pattern example
const App = () => (
  <ComponentNameField label="Field Label" errors={["Error message"]} />
);
```
````

```jsx live-dev
// Manual composition example
const App = () => (
  <FormField label="Field Label">
    <ComponentName />
    <FieldErrors errors={["Error message"]} />
  </FormField>
);
```

````

### 2. Getting Started

```markdown
## Getting started

### Import

```tsx
import { ComponentName, type ComponentNameProps } from '@commercetools/nimbus';
````

### Basic usage

Brief description of the component's core functionality from implementation
perspective.

```jsx live-dev
const App = () => (
  <ComponentName onPress={() => alert("Pressed")}>Basic Example</ComponentName>
);
```

````

### 3. Library-Specific Section (If Applicable)

For components using external libraries (e.g., `@internationalized/date`):

```markdown
## Working with [LibraryName]

Explanation of external library concepts, types, and patterns.

### Type imports

```tsx
import { CalendarDate } from '@internationalized/date';
````

### Common conversions

Show conversion patterns between native types and library types.

````

### 4. Usage Examples

```markdown
## Usage examples

### Feature category 1

Description of this feature/variant with implementation context.

```jsx live-dev
const App = () => (
  <Stack direction="row" gap="400">
    <ComponentName variant="option1">Option 1</ComponentName>
    <ComponentName variant="option2">Option 2</ComponentName>
  </Stack>
)
````

### Feature category 2

Description with technical details.

```jsx live-dev
const App = () => {
  const [value, setValue] = useState("");

  return <ComponentName value={value} onChange={setValue} />;
};
```

````

### 5. Component Requirements

```markdown
## Component requirements

### Accessibility

The ComponentName component handles most accessibility requirements internally via React Aria.

- **Labeling**: Ensure the component has proper labels or aria-label
- **Role**: Explains ARIA role and semantic meaning
- **Focus management**: How focus is handled

If your use case requires tracking and analytics for this component, it is good practice to add a **persistent**, **unique** id:

```tsx
const PERSISTENT_ID = "component-action-id";

export const Example = () => (
  <ComponentName id={PERSISTENT_ID}>Content</ComponentName>
);
````

#### Keyboard navigation

The component supports full keyboard interaction:

- `Tab`: Description of Tab behavior
- `Enter` or `Space`: Description of activation
- `Arrow Keys`: Description of navigation (if applicable)
- `Escape`: Description of dismissal (if applicable)

````

### 6. Form Integration (Field Patterns Only)

```markdown
## Form integration

### With Formik

```jsx live-dev
const App = () => {
  const formik = useFormik({
    initialValues: { fieldName: '' },
    onSubmit: (values) => console.log(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <ComponentNameField
        name="fieldName"
        label="Field Label"
        value={formik.values.fieldName}
        onChange={formik.handleChange}
        errors={formik.errors.fieldName}
        touched={formik.touched.fieldName}
      />
    </form>
  );
}
````

### Error handling

Show FieldErrors integration and touched state patterns.

````

### 7. API Reference

```markdown
## API reference

<PropsTable id="ComponentName" />
````

### 8. Common Patterns

````markdown
## Common patterns

### Pattern name

Description of common implementation pattern or use case.

```jsx live-dev
const App = () => {
  // Implementation showing the pattern
  return <ComponentName>Pattern Example</ComponentName>;
};
```
````

### Another pattern

Description of alternative approach or advanced usage.

```jsx live-dev
const App = () => {
  // More complex example
  return <ComponentName>Advanced Pattern</ComponentName>;
};
```

````

### 9. Testing Your Implementation (REQUIRED)

```markdown
## Testing your implementation

These examples demonstrate how to test your implementation when using [Component] within your application. As the component's internal functionality is already tested by Nimbus, these patterns help you verify your integration and application-specific logic.

{{docs-tests: {component-name}.docs.spec.tsx}}
````

**CRITICAL**: The `{{docs-tests:}}` injection token pulls test examples from the
`.docs.spec.tsx` file at build time.

### 10. Resources

```markdown
## Resources

- [Storybook examples](link-tbd)
- [React Aria Documentation](https://react-spectrum.adobe.com/react-aria/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Related Component](/components/category/component) (if applicable)
- [FormField](/patterns/forms/form-field) (field patterns only)
- [FieldErrors](/patterns/forms/field-errors) (field patterns only)
```

**IMPORTANT**: Internal component links MUST start with '/' (e.g.,
`/components/inputs/searchinput`) to ensure absolute paths from root.
