# Developer Documentation: Test File Structure

## Documentation Test File Structure (MANDATORY)

**MANDATORY**: Every `.dev.mdx` file MUST have a companion `.docs.spec.tsx` test file. The testing section in the MDX uses an injection token that pulls from this file at build time.

### File Structure

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
````

### JSDoc Tags (REQUIRED)

- `@docs-section` - Unique ID for section
- `@docs-title` - Display title
- `@docs-description` - Brief description
- `@docs-order` - Sort order (0 for setup, 1+ for tests)

### Test Patterns to Include

Based on component features:

- Basic rendering (always)
- Interactions (if interactive)
- Controlled mode (if supports value/onChange)
- States (disabled, invalid, readonly, required - if component has these props)
- Component-specific features

### Critical Rules

- ✅ Every `render()` must wrap with `<NimbusProvider>`
- ✅ Import NimbusProvider from `@commercetools/nimbus`
- ✅ Use `vi.fn()` for mocks (not `jest.fn()`)
- ✅ Use `userEvent.setup()` for interactions
- ✅ Base test names on component features, not generic patterns

### Consumer Implementation Tests

Consumer Implementation Tests (`.docs.spec.tsx`) are **working code examples**
consumers can copy to test components in their apps.

See [Testing Strategy Guide](../../../../docs/file-type-guidelines/testing-strategy.md) for
rules.

### Verify Tests

```bash
pnpm test:unit {component-name}.docs.spec.tsx
```
