# Engineering Documentation Test Validation

This guide explains how to validate test code examples in engineering documentation (`.dev.mdx` files) using automated CI checks.

## Overview

Engineering documentation (`.dev.mdx` files) includes test code examples showing consumers how to test components. To ensure these examples stay valid and up-to-date, we extract and run them automatically in CI.

## How It Works

### 1. Tag Test Blocks in Documentation

Wrap test code blocks with validation tags:

```mdx
## Testing your implementation

### Basic rendering tests

<!-- test:validate -->
\`\`\`tsx
import { render, screen } from '@testing-library/react';
import { TextInput } from '@commercetools/nimbus';

describe('TextInput - Basic rendering', () => {
  it('renders input element', () => {
    render(<TextInput placeholder="Enter text" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
\`\`\`
<!-- /test:validate -->
```

**Important**: Use `vi.fn()` instead of `jest.fn()` since we run tests with Vitest.

### 2. Run Validation

```bash
# Validate all .dev.mdx files
pnpm test:docs

# Validate specific file
pnpm test:docs --file=text-input.dev.mdx
```

### 3. What Happens

The validation script (`scripts/validate-docs-tests.ts`):

1. **Finds** all `.dev.mdx` files in the codebase
2. **Extracts** code blocks between `<!-- test:validate -->` tags
3. **Generates** a temporary test file with all extracted code
4. **Wraps** render calls with `NimbusProvider` automatically
5. **Runs** tests using Vitest
6. **Reports** results (pass/fail)

Example output:

```
🔍 Validating engineering documentation tests...

Found 12 file(s) to validate:

  ✓ packages/nimbus/src/components/text-input/text-input.dev.mdx - 5 test block(s)
  - packages/nimbus/src/components/button/button.dev.mdx - No tagged tests
  ...

Total: 5 test block(s) extracted

📝 Generated test file: packages/nimbus/src/test/docs-validation.generated.spec.tsx

🧪 Running extracted tests...

 ✓ TextInput - Basic rendering > renders input element
 ✓ TextInput - Basic rendering > renders with placeholder text
 ✓ TextInput - Basic rendering > renders with aria-label
 ✓ TextInput - Interactions > updates value when user types
 ✓ TextInput - Interactions > calls onChange callback with string value
 ...

✅ All documentation tests passed!
```

## Writing Test Examples

### Best Practices

✅ **DO:**
- Keep examples simple and focused
- Use realistic test patterns consumers would write
- Include common testing scenarios
- Use `vi.fn()` for mocks (Vitest)
- Group related tests in describe blocks with descriptive names

❌ **DON'T:**
- Include overly complex test setups
- Use internal implementation details
- Add test utilities not available to consumers
- Use `jest.fn()` (use `vi.fn()` instead)

### Example Structure

```tsx
<!-- test:validate -->
\`\`\`tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '@commercetools/nimbus';

describe('ComponentName - Feature description', () => {
  it('tests specific behavior', async () => {
    const user = userEvent.setup();
    render(<ComponentName prop="value" />);

    const element = screen.getByRole('role');
    await user.click(element);

    expect(element).toHaveTextContent('expected');
  });
});
\`\`\`
<!-- /test:validate -->
```

### What Gets Wrapped Automatically

The script automatically handles:

**✅ NimbusProvider wrapping:**
```tsx
// You write:
render(<TextInput placeholder="Test" />);

// Script transforms to:
renderWithProvider(<TextInput placeholder="Test" />);
// where renderWithProvider wraps in <NimbusProvider>
```

**✅ Rerender support:**
```tsx
// You write:
const { rerender } = render(<Component value="first" />);
rerender(<Component value="second" />);

// Script wraps both render and rerender calls
```

### What You Need to Handle

**Import statements:**
Always include all necessary imports in each test block:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '@commercetools/nimbus';
```

The script deduplicates imports across blocks automatically.

## Testing the Validation

### Test That It Works

Add a deliberately failing test to see validation catch it:

```tsx
<!-- test:validate -->
\`\`\`tsx
import { render, screen } from '@testing-library/react';
import { TextInput } from '@commercetools/nimbus';

describe('Broken example', () => {
  it('should fail', () => {
    render(<TextInput placeholder="Test" />);
    expect(screen.getByRole('button')).toBeInTheDocument(); // Wrong role!
  });
});
\`\`\`
<!-- /test:validate -->
```

Run `pnpm test:docs` - it should fail with a clear error message.

### Test That It Catches Stale Code

If you update a component's API but forget to update docs:

```tsx
// Old docs example (now broken):
render(<TextInput color="primary" />); // color prop removed

// Validation catches this:
❌ Property 'color' does not exist on type 'TextInputProps'
```

## CI Integration

### Add to GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build:packages
      - run: pnpm test:docs
```

### Pre-commit Hook (Optional)

```bash
# .husky/pre-commit
pnpm test:docs
```

## Rollout Strategy

### Phase 1: Pilot (Current)
- ✅ TextInput has tagged test blocks
- ✅ Script validates and passes
- Get feedback from team

### Phase 2: Expand
- Add tags to other complex components (Select, DatePicker, etc.)
- Tag pattern components (TextInputField, etc.)
- Test edge cases and complex scenarios

### Phase 3: Enforce
- Add to CI pipeline
- Make test:docs required for PR merges
- Document pattern in contribution guide

## Maintenance Benefits

✅ **Catches breaking changes** - API changes caught before release
✅ **Prevents stale examples** - Invalid code fails CI
✅ **Documents testing patterns** - Shows real, working test code
✅ **No duplication** - Tests ARE the documentation
✅ **Low overhead** - Just add tags to existing code
✅ **Fast feedback** - Run locally before committing

## Troubleshooting

### Tests Fail Locally

1. **Ensure packages are built:**
   ```bash
   pnpm build:packages
   ```

2. **Check generated file:**
   ```bash
   cat packages/nimbus/src/test/docs-validation.generated.spec.tsx
   ```

3. **Run test file directly:**
   ```bash
   pnpm vitest run packages/nimbus/src/test/docs-validation.generated.spec.tsx --project=unit
   ```

### Common Issues

**Issue**: `useContext returned undefined`
- **Cause**: Missing NimbusProvider wrapper
- **Fix**: Script should wrap automatically; check `renderWithProvider` function in generated file

**Issue**: `Cannot find module '@commercetools/nimbus'`
- **Cause**: Package not built
- **Fix**: Run `pnpm build:packages` first

**Issue**: Tests pass locally but fail in CI
- **Cause**: Missing build step in CI
- **Fix**: Ensure CI runs `pnpm build:packages` before `pnpm test:docs`

## Example: TextInput

See `packages/nimbus/src/components/text-input/text-input.dev.mdx` for a complete reference implementation with:
- ✅ 5 tagged test sections
- ✅ 14 individual test cases
- ✅ All tests passing

## Related Documentation

- [Component Guidelines](./component-guidelines.md) - Component development patterns
- [Unit Testing Guidelines](./file-type-guidelines/unit-testing.md) - Testing best practices
- [Stories Guidelines](./file-type-guidelines/stories.md) - Storybook test patterns

---

Last updated: January 2025
