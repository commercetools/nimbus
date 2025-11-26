# Engineering Documentation Test Integration

This guide explains how test code examples in engineering documentation (`.dev.mdx` files) are automatically kept up-to-date using real, executable tests.

## Overview

Engineering documentation (`.dev.mdx` files) includes test code examples showing consumers how to test components. These examples are now **automatically generated from real test files**, ensuring they're always valid and up-to-date.

## How It Works

### The Inverted Strategy

Instead of extracting tests from documentation, we **inject tests into documentation** at build time:

1. **Tests live in `.docs.spec.tsx` files** - Real, executable test files colocated with components
2. **Tests run with normal test suite** - No special CLI workflow needed
3. **Build extracts test sections** - TypeScript AST parser finds tagged sections
4. **Documentation generated** - Test code injected into MDX at build time

**Key Benefit:** Tests are the source of truth. Documentation is derived from working tests.

## Writing Documentation Tests

### 1. Create Test File

Create a `.docs.spec.tsx` file alongside your component:

```
text-input/
├── text-input.tsx
├── text-input.types.ts
├── text-input.dev.mdx          # Developer guide
├── text-input.docs.spec.tsx    # NEW: Tests for documentation
└── text-input.stories.tsx      # Storybook tests
```

### 2. Tag Test Sections with JSDoc

Use JSDoc tags to mark test sections for documentation:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput, NimbusProvider } from '@commercetools/nimbus';

/**
 * @docs-section basic-rendering
 * @docs-title Basic Rendering Tests
 * @docs-description Verify the component renders with expected elements
 * @docs-order 1
 */
describe('TextInput - Basic rendering', () => {
  it('renders input element', () => {
    render(
      <NimbusProvider>
        <TextInput placeholder="Enter text" />
      </NimbusProvider>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with placeholder text', () => {
    render(
      <NimbusProvider>
        <TextInput placeholder="Email" />
      </NimbusProvider>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });
});

/**
 * @docs-section interactions
 * @docs-title Interaction Tests
 * @docs-description Test user interactions with the component
 * @docs-order 2
 */
describe('TextInput - Interactions', () => {
  it('updates value when user types', async () => {
    const user = userEvent.setup();
    render(
      <NimbusProvider>
        <TextInput placeholder="Type here" />
      </NimbusProvider>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello World');

    expect(input).toHaveValue('Hello World');
  });
});
```

### 3. Add Injection Token to MDX

In your `.dev.mdx` file, add a single token where tests should appear:

```mdx
## Testing your implementation

These examples demonstrate how to test your implementation when using ComponentName in your application.

{{docs-tests: component-name.docs.spec.tsx}}

## Additional testing considerations

[Manual content about edge cases, patterns, etc.]
```

### 4. Build Documentation

When you build docs, test sections are automatically extracted and injected:

```bash
pnpm build:docs
```

The build process:
1. Finds `{{docs-tests:}}` tokens in MDX
2. Locates companion `.docs.spec.tsx` file
3. Parses TypeScript AST
4. Extracts sections with JSDoc tags
5. Generates markdown sections with code blocks
6. Cleans code (removes test infrastructure)
7. Injects into documentation

## JSDoc Tag Reference

### Required Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `@docs-section` | Unique identifier for the section | `@docs-section basic-rendering` |
| `@docs-title` | Display title in documentation | `@docs-title Basic Rendering Tests` |
| `@docs-description` | Brief description of what tests demonstrate | `@docs-description Verify component renders correctly` |
| `@docs-order` | Sort order in documentation (lower = earlier) | `@docs-order 1` |

### Example Usage

```typescript
/**
 * @docs-section controlled-mode
 * @docs-title Testing Controlled Mode
 * @docs-description Test controlled component behavior
 * @docs-order 3
 */
describe('Component - Controlled mode', () => {
  // Tests here
});
```

## Code Transparency

The build process shows **full, unmodified test code** in documentation. What you write in `.docs.spec.tsx` files is exactly what consumers see.

### What Consumers See

All code is preserved as-is, including:

✅ **Complete test setup:**
- `renderWithProvider()` helper function
- `NimbusProvider` imports
- `ReactNode` type imports
- All test infrastructure

✅ **Full context:**
- Exact imports you use
- Helper functions defined
- Complete, copy-paste ready examples

### Example

**In test file (what you write):**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextInput, NimbusProvider } from '@commercetools/nimbus';

describe('Tests', () => {
  it('works', () => {
    render(
      <NimbusProvider>
        <TextInput placeholder="Test" />
      </NimbusProvider>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
```

**In documentation (what consumers see):**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextInput, NimbusProvider } from '@commercetools/nimbus';

describe('Tests', () => {
  it('works', () => {
    render(
      <NimbusProvider>
        <TextInput placeholder="Test" />
      </NimbusProvider>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
```

**Result:** Exactly the same! No transformations, no hidden setup. Complete transparency.

## Best Practices

### ✅ DO

- **Keep examples simple and focused** - One concept per test section
- **Use realistic test patterns** - Show what consumers would actually write
- **Include common testing scenarios** - Basic rendering, interactions, states
- **Wrap every render with `<NimbusProvider>`** - Shows consumers the required setup explicitly
- **Group related tests** - Use describe blocks with clear names
- **Order logically** - Use `@docs-order` to sequence from simple to complex
- **Be explicit about boilerplate** - Don't hide setup requirements in helpers

### ❌ DON'T

- **Include overly complex test setups** - Keep examples accessible
- **Use internal implementation details** - Focus on public API
- **Add test utilities not available to consumers** - Stick to standard libraries
- **Skip JSDoc tags** - All required tags must be present
- **Duplicate test logic** - One source of truth in `.docs.spec.tsx`

## File Naming Convention

| File Type | Purpose | Example |
|-----------|---------|---------|
| `.docs.spec.tsx` | Tests for documentation examples | `text-input.docs.spec.tsx` |
| `.spec.tsx` | Internal unit tests (not shown in docs) | `text-input.spec.tsx` |
| `.stories.tsx` | Storybook interaction tests | `text-input.stories.tsx` |

**Note:** `.docs.spec.tsx` tests are discovered automatically by Vitest and run with the normal test suite.

## Running Tests

Documentation tests run normally with existing commands:

```bash
# Run all tests (includes docs tests)
pnpm test

# Run only unit tests (includes docs tests)
pnpm test:unit

# Run specific docs test file
pnpm test:unit text-input.docs.spec.tsx

# Run in watch mode
pnpm test:unit --watch
```

**No special CLI workflow needed!**

## Verification Checklist

When creating or updating documentation tests:

- [ ] Test file named `{component}.docs.spec.tsx`
- [ ] File colocated with component
- [ ] All describe blocks have JSDoc tags (`@docs-section`, `@docs-title`, `@docs-description`, `@docs-order`)
- [ ] Every `render()` call wraps component with `<NimbusProvider>`
- [ ] NimbusProvider imported from `@commercetools/nimbus`
- [ ] MDX file has `{{docs-tests: filename}}` token
- [ ] Tests pass when run with `pnpm test:unit`
- [ ] Documentation builds without errors
- [ ] Generated docs show full code including provider (no cleaning)

## Troubleshooting

### Tests Fail Locally

**Issue:** Tests fail with "useContext returned undefined" errors

**Solution:** Ensure every `render()` call wraps the component with `<NimbusProvider>`:

```typescript
// ✅ Correct - Provider wrapper included
describe('Tests', () => {
  it('works', () => {
    render(
      <NimbusProvider>
        <Component />
      </NimbusProvider>
    );
  });
});

// ❌ Wrong - Missing provider
describe('Tests', () => {
  it('works', () => {
    render(<Component />); // Will fail with context error!
  });
});
```

### Documentation Not Updating

**Issue:** Changes to test file don't appear in docs

**Solution:**
1. Rebuild nimbus-docs-build package: `pnpm --filter @commercetools/nimbus-docs-build build`
2. Rebuild documentation: `pnpm build:docs`
3. Restart dev server if running

### Token Not Replaced

**Issue:** `{{docs-tests:}}` token appears in documentation

**Possible causes:**
- Test file not found (check filename matches exactly)
- No sections found (add `@docs-section` JSDoc tags)
- Syntax error in test file (run tests to verify)

**Debug:**
```bash
# Check console output during docs build for warnings
pnpm build:docs

# Look for messages like:
# "Test file not found: ..."
# "No test sections found in ..."
```

### Code Appears Malformed

**Issue:** Generated code has syntax errors

**Solution:**
- Verify test file has valid JSX syntax
- Ensure all imports are valid
- Run tests to confirm code is executable

## Migration from Old System

If migrating from the HTML comment tag system:

1. **Extract test code** from `<!-- test:validate -->` tags in `.dev.mdx`
2. **Create `.docs.spec.tsx`** file with extracted tests
3. **Add JSDoc tags** to each describe block
4. **Wrap all render calls** with `<NimbusProvider>` explicitly
5. **Add NimbusProvider import** to imports
6. **Replace test sections** in MDX with `{{docs-tests: filename}}`
7. **Verify** tests pass and docs build correctly

## Example: Complete TextInput Implementation

See `packages/nimbus/src/components/text-input/` for a complete reference:

- `text-input.docs.spec.tsx` - Test file with 5 sections, 14 tests
- `text-input.dev.mdx` - Uses `{{docs-tests: text-input.docs.spec.tsx}}`
- Generated docs at `apps/docs/src/data/routes/components-inputs-textinput.json`

## Benefits

✅ **Always up-to-date** - Tests ARE the examples
✅ **Type-safe** - TypeScript catches API changes
✅ **IDE support** - Full autocomplete and type checking
✅ **No duplication** - Single source of truth
✅ **Normal workflow** - Tests run with `pnpm test`
✅ **Build-time validation** - Missing tests fail docs build
✅ **Clean examples** - Infrastructure removed automatically

---

Last updated: January 2025
