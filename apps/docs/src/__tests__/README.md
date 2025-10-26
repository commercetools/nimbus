# Testing Documentation for Nimbus Docs App

This directory contains all tests for the Nimbus documentation application.

## Test Structure

```
src/__tests__/
├── unit/              # Fast unit tests for utilities and pure functions
├── integration/       # Integration tests for React components with routing
├── e2e/              # End-to-end tests with Playwright (real browser)
└── README.md         # This file
```

## Running Tests

### Unit & Integration Tests (Vitest)

```bash
# Run all unit and integration tests
pnpm test:unit

# Run tests in watch mode (auto-rerun on changes)
pnpm test:watch

# Run tests with UI (visual test runner)
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

### End-to-End Tests (Playwright)

```bash
# First time setup: Install Playwright browsers
pnpm playwright:install

# Run E2E tests (headless)
pnpm test:e2e

# Run E2E tests with UI (visual test runner)
pnpm test:e2e:ui

# Run E2E tests in headed mode (see browser)
pnpm test:e2e:headed
```

### All Tests

```bash
# Run all tests (unit, integration, and E2E)
pnpm test
```

## Test Types

### Unit Tests (`unit/`)

**Purpose**: Test individual functions, utilities, and pure logic in isolation.

**Characteristics**:
- Fast (runs in milliseconds)
- No external dependencies
- Uses JSDOM for DOM simulation
- No real browser needed

**Example**:
```typescript
// src/__tests__/unit/utils.spec.ts
describe("sluggify", () => {
  it("converts string to URL-safe slug", () => {
    expect(sluggify("Hello World")).toBe("hello-world");
  });
});
```

### Integration Tests (`integration/`)

**Purpose**: Test how multiple components work together, including React components with routing.

**Characteristics**:
- Moderate speed (runs in hundreds of milliseconds)
- Uses JSDOM for DOM simulation
- Tests component integration with React Router
- Uses @testing-library/react for component testing

**Example**:
```typescript
// src/__tests__/integration/routing.spec.tsx
it("renders home page on root path", () => {
  renderWithRouter("/");
  expect(screen.getByText("Home Page")).toBeInTheDocument();
});
```

### E2E Tests (`e2e/`)

**Purpose**: Test complete user workflows in a real browser environment.

**Characteristics**:
- Slower (runs in seconds)
- Uses real Chromium/Firefox/Safari browsers
- Tests actual user interactions
- Can test visual appearance, animations, etc.

**Example**:
```typescript
// src/__tests__/e2e/navigation.spec.ts
test("homepage loads successfully", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Nimbus/i);
});
```

## Writing Tests

### Unit Test Guidelines

1. **Test pure functions**: Focus on utilities, helpers, formatters
2. **One assertion per test**: Keep tests focused
3. **Use descriptive names**: Test name should describe behavior
4. **Test edge cases**: Empty strings, null, undefined, boundary values

Example:
```typescript
describe("stripMarkdown", () => {
  it("removes markdown bold syntax", () => {
    expect(stripMarkdown("**bold text**")).toBe("bold text");
  });

  it("handles empty string", () => {
    expect(stripMarkdown("")).toBe("");
  });
});
```

### Integration Test Guidelines

1. **Use NimbusProvider**: Wrap components in NimbusProvider for Nimbus components
2. **Use MemoryRouter**: For testing routing behavior
3. **Clean up**: Tests automatically clean up after each test
4. **Test user interactions**: Click, type, navigate

Example:
```typescript
function renderWithRouter(initialRoute = "/") {
  return render(
    <NimbusProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    </NimbusProvider>
  );
}
```

### E2E Test Guidelines

1. **Start dev server**: Playwright automatically starts the dev server
2. **Use page.goto()**: Navigate to routes
3. **Wait for elements**: Use `await expect()` with visibility checks
4. **Test critical paths**: Focus on user workflows
5. **Use descriptive selectors**: Prefer role-based selectors

Example:
```typescript
test("can navigate to component pages", async ({ page }) => {
  await page.goto("/");

  const componentLink = page.getByRole("link", { name: /components/i }).first();
  await componentLink.click();

  await page.waitForLoadState("networkidle");
  expect(page.url()).not.toBe("http://localhost:5173/");
});
```

## Test Setup Files

### `src/test/unit-test-setup.ts`

Sets up the test environment for unit and integration tests:
- Imports JSDOM polyfills
- Configures @testing-library/jest-dom matchers
- Sets up automatic cleanup after each test

### `src/test/setup-jsdom-polyfills.ts`

Provides polyfills for JSDOM environment:
- `structuredClone` - Required by Chakra UI
- `window.matchMedia` - Required for responsive design
- `ResizeObserver` - Required for responsive components
- `IntersectionObserver` - Required for lazy loading
- `Element.prototype.scrollTo/scrollIntoView` - Required for navigation
- `requestAnimationFrame` - Required for animations

## Coverage

Coverage reports show which code is tested:

```bash
# Generate coverage report
pnpm test:coverage

# View HTML report (opens in browser)
open coverage/index.html
```

**Coverage thresholds** (configured in `vitest.config.ts`):
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

## Debugging Tests

### Debugging Unit/Integration Tests

```bash
# Run tests with UI (best for debugging)
pnpm test:ui

# Run specific test file
pnpm test:unit src/__tests__/unit/utils.spec.ts

# Run tests matching pattern
pnpm test:unit --testNamePattern="sluggify"
```

### Debugging E2E Tests

```bash
# Run with UI (visual debugger)
pnpm test:e2e:ui

# Run in headed mode (see browser)
pnpm test:e2e:headed

# Run specific test file
pnpm test:e2e src/__tests__/e2e/navigation.spec.ts
```

## Best Practices

1. **Write tests as you code**: Don't wait until the end
2. **Test behavior, not implementation**: Focus on what users see
3. **Keep tests simple**: One concept per test
4. **Use meaningful assertions**: Clear expected vs actual values
5. **Test edge cases**: Empty, null, undefined, boundary values
6. **Avoid test interdependence**: Each test should be independent
7. **Use descriptive names**: Test names should explain what's being tested
8. **Clean up side effects**: Tests should not affect each other

## Common Issues

### Issue: Tests fail with "structuredClone is not defined"

**Solution**: The polyfill setup is working correctly if this doesn't happen. If it does, ensure `src/test/unit-test-setup.ts` is configured in `vitest.config.ts`.

### Issue: E2E tests can't connect to dev server

**Solution**:
1. Check if port 5173 is available
2. Ensure dev server starts successfully: `pnpm dev`
3. Check Playwright configuration in `playwright.config.ts`

### Issue: Coverage thresholds not met

**Solution**:
1. Write more tests for uncovered code
2. Adjust thresholds in `vitest.config.ts` if needed
3. Focus on critical paths first

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Nimbus Testing Guidelines](/docs/file-type-guidelines/unit-testing.md)
- [Nimbus Stories Guidelines](/docs/file-type-guidelines/stories.md)

---

**Happy Testing! 🧪**
