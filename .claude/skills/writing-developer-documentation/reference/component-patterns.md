# Developer Documentation: Component Patterns

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
