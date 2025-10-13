# Unit Testing Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Stories](./stories.md)

## Purpose

Unit test files (`{component-name}.test.tsx` or `{utility-name}.test.ts`) provide fast, isolated testing of component behavior and utility functions using JSDOM. Unit tests complement Storybook interaction tests by focusing on implementation details, edge cases, and non-visual behavior.

## When to Use

### Create Unit Tests When:

- Testing **implementation details** not visible in Storybook
- Verifying **accessibility attributes** (ARIA, data attributes)
- Testing **edge cases and error conditions**
- Testing **utility functions and helpers**
- Testing **React hooks** in isolation
- Testing **conditional rendering logic**
- Testing **prop combinations** efficiently

### Unit Tests vs Storybook Tests

| Aspect | Unit Tests | Storybook Tests |
|--------|------------|-----------------|
| **Environment** | JSDOM (fast, simulated) | Real browser (slow, accurate) |
| **Purpose** | Implementation verification | Visual behavior & interactions |
| **Speed** | Very fast (~ms per test) | Slower (~seconds per story) |
| **Focus** | Props, state, logic | UI, user flows, visual states |
| **Coverage** | Edge cases, error handling | Happy paths, user scenarios |
| **Required** | For complex components | For ALL interactive components |

**Best Practice**: Write both unit tests and Storybook tests. They serve different purposes and complement each other.

## Testing Infrastructure

### Test Configuration

The project uses **Vitest** with two separate test projects:

```typescript
// vitest.config.ts - Root orchestrator
export default defineConfig({
  test: {
    projects: [
      "./vitest.storybook.config.ts",  // Browser-based Storybook tests
      "./vitest.unit.config.ts",        // JSDOM-based unit tests
    ],
  },
});
```

### Unit Test Configuration

```typescript
// vitest.unit.config.ts
export default defineConfig({
  test: {
    name: "unit",
    environment: "jsdom",                                    // Use JSDOM instead of real browser
    include: ["src/**/*.{test,spec}.{ts,tsx}"],            // Test file patterns
    exclude: ["src/**/*.stories.{ts,tsx}", "node_modules"], // Exclude Storybook tests
    globals: true,                                          // Enable global test APIs
    setupFiles: ["./src/test/unit-test-setup.ts"],         // Setup file runs before tests
  },
});
```

### Test Setup File

```typescript
// src/test/unit-test-setup.ts
import "./setup-jsdom-polyfills";  // JSDOM polyfills for Chakra UI
import "@testing-library/jest-dom"; // Custom matchers (toBeInTheDocument, etc.)
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup DOM after each test
afterEach(() => {
  cleanup();
});
```

### JSDOM Polyfills

The `setup-jsdom-polyfills.ts` file provides essential browser APIs missing in JSDOM:

- `structuredClone` - Required by Chakra UI for theme configuration
- `window.matchMedia` - Required for responsive design and color mode
- `ResizeObserver` - Required for responsive components
- `IntersectionObserver` - Required for lazy loading and viewport tracking
- `Element.prototype.scrollTo/scrollIntoView` - Required for focus management
- `requestAnimationFrame` - Required for animations and transitions

**Consumer Usage**: These polyfills are exported for use in consuming applications:

```typescript
// jest.config.js
module.exports = {
  setupFiles: ['@commercetools/nimbus/setup-jsdom-polyfills']
};

// vitest.config.ts
export default defineConfig({
  test: {
    setupFiles: ['@commercetools/nimbus/setup-jsdom-polyfills']
  }
});
```

## File Structure

### Basic Test File

```typescript
// component-name.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { ComponentName } from "./component-name";

describe("ComponentName", () => {
  describe("Base behavior", () => {
    it("renders with children", () => {
      render(<ComponentName>Test content</ComponentName>);

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });
  });

  describe("Props", () => {
    it("forwards data attributes", () => {
      render(<ComponentName data-testid="test">Content</ComponentName>);

      const element = screen.getByTestId("test");
      expect(element).toHaveAttribute("data-testid", "test");
    });
  });

  describe("Interactions", () => {
    it("handles click events", async () => {
      const onPress = vi.fn();
      render(<ComponentName onPress={onPress}>Click me</ComponentName>);

      await userEvent.click(screen.getByRole("button"));

      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});
```

## Testing Patterns

### Test Organization

Use nested `describe` blocks to organize tests by feature area:

```typescript
describe("Button", () => {
  describe("Base", () => {
    // Basic rendering and element tests
  });

  describe("Disabled", () => {
    // Disabled state tests
  });

  describe("AsLink", () => {
    // Polymorphic component tests
  });

  describe("WithRef", () => {
    // Ref forwarding tests
  });
});
```

### Test Utilities

Import from the centralized test utilities module:

```typescript
import { render, screen, userEvent, waitFor, within } from "@/test/utils";
```

**Key utilities**:

- `render` - Automatically wraps components with `NimbusProvider`
- `renderWithoutProvider` - Original RTL render without provider
- `screen` - Query the entire document
- `userEvent` - Simulate user interactions (preferred over fireEvent)
- `waitFor` - Wait for async operations
- `within` - Query within a specific element

### Custom Render Function

The custom `render` function automatically wraps components with `NimbusProvider`:

```typescript
// src/test/utils.tsx
const renderWithProvider = (ui: ReactNode, options?: RenderOptions) => {
  return rtlRender(<NimbusProvider>{ui}</NimbusProvider>, options);
};

export { renderWithProvider as render };
```

**Usage**:

```typescript
// ✅ Automatically includes NimbusProvider
render(<Button>Click me</Button>);

// ✅ Use renderWithoutProvider if NimbusProvider is not needed
import { renderWithoutProvider } from "@/test/utils";
renderWithoutProvider(<PureComponent />);
```

## Common Test Patterns

### Testing Component Rendering

```typescript
describe("Base rendering", () => {
  it("uses correct HTML element", () => {
    render(<Button data-testid="btn">Click me</Button>);

    const button = screen.getByTestId("btn");
    expect(button.tagName).toBe("BUTTON");
  });

  it("renders children", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

### Testing Props and Attributes

```typescript
describe("Props", () => {
  it("forwards data attributes", () => {
    render(<Button data-testid="test" data-custom="value">Button</Button>);

    const button = screen.getByTestId("test");
    expect(button).toHaveAttribute("data-custom", "value");
  });

  it("forwards ARIA attributes", () => {
    render(<Button aria-label="Close dialog">X</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Close dialog");
  });
});
```

### Testing Interactions

```typescript
describe("Interactions", () => {
  it("handles click events", async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Click me</Button>);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard navigation", async () => {
    render(<Button>Press me</Button>);

    await userEvent.tab();

    const button = screen.getByRole("button");
    expect(button).toHaveFocus();
  });

  it("activates with Enter key", async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Press Enter</Button>);

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("activates with Space key", async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Press Space</Button>);

    await userEvent.tab();
    await userEvent.keyboard(" ");

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Disabled State

```typescript
describe("Disabled", () => {
  it("prevents click events", async () => {
    const onPress = vi.fn();
    render(<Button isDisabled onPress={onPress}>Disabled</Button>);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(onPress).not.toHaveBeenCalled();
  });

  it("prevents focus", async () => {
    render(<Button isDisabled>Disabled</Button>);

    await userEvent.tab();

    const button = screen.getByRole("button");
    expect(button).not.toHaveFocus();
  });

  it("sets accessibility attributes", () => {
    render(<Button isDisabled data-testid="btn">Disabled</Button>);

    const button = screen.getByTestId("btn");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("data-disabled", "true");
  });
});
```

### Testing Polymorphic Components

```typescript
describe("AsLink", () => {
  it("renders as anchor element", () => {
    render(
      <Button as="a" href="/" data-testid="link">
        Link Button
      </Button>
    );

    const link = screen.getByTestId("link");
    expect(link.tagName).toBe("A");
  });
});

describe("WithAsChild", () => {
  it("renders custom child element", () => {
    render(
      <Button asChild data-testid="custom">
        <a href="/">Custom Link</a>
      </Button>
    );

    const link = screen.getByTestId("custom");
    expect(link.tagName).toBe("A");
  });
});
```

### Testing Ref Forwarding

```typescript
import { createRef } from "react";

describe("WithRef", () => {
  it("forwards ref to underlying element", () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Button</Button>);

    const button = screen.getByRole("button");
    expect(ref.current).toBe(button);
  });
});
```

### Testing Utility Functions

```typescript
// noop.test.ts
import { describe, it, expect, vi } from "vitest";
import { noop } from "./noop";

describe("noop", () => {
  it("is a function", () => {
    expect(typeof noop).toBe("function");
  });

  it("returns undefined", () => {
    const result = noop();
    expect(result).toBeUndefined();
  });

  it("does not throw when called", () => {
    expect(() => noop()).not.toThrow();
  });

  it("works as a callback", () => {
    const mockFn = vi.fn(noop);
    mockFn();
    expect(mockFn).toHaveBeenCalledOnce();
  });
});
```

## Querying Elements

### Query Priority

Follow Testing Library's query priority for better accessibility-focused tests:

1. **Accessible queries** (preferred):
   - `getByRole` - Queries by ARIA role
   - `getByLabelText` - Queries by label text
   - `getByPlaceholderText` - Queries by placeholder
   - `getByText` - Queries by text content

2. **Test ID queries** (fallback):
   - `getByTestId` - Queries by data-testid attribute

```typescript
// ✅ Preferred: Query by role
const button = screen.getByRole("button", { name: "Submit" });

// ✅ Good: Query by label
const input = screen.getByLabelText("Email address");

// ⚠️ Acceptable fallback: Query by test ID
const element = screen.getByTestId("custom-element");
```

### Query Variants

- `getBy*` - Throws if element not found (synchronous)
- `queryBy*` - Returns null if not found (for asserting non-existence)
- `findBy*` - Returns Promise, waits for element (async)

```typescript
// ✅ Assert element exists
expect(screen.getByRole("button")).toBeInTheDocument();

// ✅ Assert element does not exist
expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

// ✅ Wait for async element
const dialog = await screen.findByRole("dialog");
expect(dialog).toBeInTheDocument();
```

## Async Testing

### When to Use `waitFor`

Use `waitFor` when testing asynchronous behavior:

```typescript
it("shows loading state then content", async () => {
  render(<AsyncComponent />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("Content loaded")).toBeInTheDocument();
  });
});
```

### User Event (Async)

All `userEvent` methods are async and should be awaited:

```typescript
// ✅ Correct: await user interactions
await userEvent.click(button);
await userEvent.type(input, "text");
await userEvent.keyboard("{Enter}");
await userEvent.tab();

// ❌ Incorrect: missing await
userEvent.click(button); // Will cause timing issues
```

## Mocking

### Mocking Functions

```typescript
import { vi } from "vitest";

it("calls callback when clicked", async () => {
  const onClick = vi.fn();
  render(<Button onPress={onClick}>Click me</Button>);

  await userEvent.click(screen.getByRole("button"));

  expect(onClick).toHaveBeenCalledTimes(1);
});
```

### Mocking Modules

```typescript
// Mock external module
vi.mock("./external-module", () => ({
  externalFunction: vi.fn(() => "mocked value"),
}));

// Mock specific import
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));
```

## Best Practices

### Test Structure

- **Use descriptive test names** - Test names should clearly state what is being tested
- **One assertion per test** - Keep tests focused on a single behavior
- **Arrange-Act-Assert pattern** - Structure tests clearly:
  1. Arrange: Set up test data and render component
  2. Act: Perform the action being tested
  3. Assert: Verify the expected outcome

```typescript
it("disables button when isDisabled prop is true", () => {
  // Arrange
  const onPress = vi.fn();
  render(<Button isDisabled onPress={onPress}>Click me</Button>);

  // Act
  const button = screen.getByRole("button");
  button.click();

  // Assert
  expect(onPress).not.toHaveBeenCalled();
});
```

### Accessibility Testing

- **Test ARIA attributes** - Verify proper aria-* attributes
- **Test keyboard navigation** - Ensure Tab, Enter, Space work correctly
- **Test focus management** - Verify focus states and focus trapping
- **Test screen reader text** - Verify aria-label, aria-describedby

```typescript
describe("Accessibility", () => {
  it("has correct role", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("supports keyboard activation", async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Press me</Button>);

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");

    expect(onPress).toHaveBeenCalled();
  });

  it("announces disabled state", () => {
    render(<Button isDisabled data-testid="btn">Disabled</Button>);

    const button = screen.getByTestId("btn");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });
});
```

### Don't Test Implementation Details

Focus on behavior, not implementation:

```typescript
// ❌ Avoid: Testing internal state
expect(component.state.isOpen).toBe(true);

// ✅ Preferred: Test observable behavior
expect(screen.getByRole("dialog")).toBeInTheDocument();

// ❌ Avoid: Testing CSS classes
expect(button).toHaveClass("button--primary");

// ✅ Preferred: Test visual result via accessibility
expect(button).toHaveAttribute("data-variant", "primary");
```

### Avoid Snapshots for Components

Snapshot tests are fragile and provide little value for components:

```typescript
// ❌ Avoid: Snapshot testing
expect(container).toMatchSnapshot();

// ✅ Preferred: Specific assertions
expect(screen.getByRole("button")).toHaveAttribute("type", "button");
expect(screen.getByText("Click me")).toBeInTheDocument();
```

## Running Tests

### Command Line

```bash
# Run all tests (both unit and Storybook)
pnpm test

# Run only unit tests
pnpm test --project unit

# Run specific test file
pnpm test button.test.tsx

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

### Test Filtering

```bash
# Run tests matching pattern
pnpm test --testNamePattern="Button.*disabled"

# Run tests in specific file
pnpm test src/components/button/button.test.tsx
```

## Coverage

### What to Cover

- **Happy path** - Normal usage scenarios
- **Edge cases** - Boundary conditions, empty states
- **Error states** - Invalid props, error handling
- **Accessibility** - ARIA attributes, keyboard navigation
- **Interactions** - User events, state changes
- **Variants** - All visual and behavioral variants

### What NOT to Cover

- **Styling** - Visual appearance (use Storybook tests instead)
- **Third-party libraries** - Assume React Aria, Chakra UI work correctly
- **TypeScript types** - Type checking happens at compile time
- **Implementation details** - Internal state, private methods

## Related Guidelines

- [Stories](./stories.md) - Storybook interaction tests
- [Main Component](./main-component.md) - Component implementation
- [Hooks](./hooks.md) - Testing custom hooks

## Validation Checklist

- [ ] Test file exists with `.test.tsx` or `.test.ts` extension
- [ ] File located alongside component or utility being tested
- [ ] Imports from `@/test/utils` (includes NimbusProvider)
- [ ] Uses `describe` blocks to organize tests
- [ ] Test names clearly describe behavior being tested
- [ ] All user interactions use `userEvent` (not fireEvent)
- [ ] All `userEvent` calls are awaited
- [ ] Accessibility attributes tested (ARIA, data-* attributes)
- [ ] Keyboard navigation tested (Tab, Enter, Space)
- [ ] Disabled state tested (prevents interaction and focus)
- [ ] Queries follow accessibility priority (role, label, text)
- [ ] Tests focus on behavior, not implementation
- [ ] No snapshot tests for components
- [ ] Mocks used appropriately for callbacks and external modules

---

[← Back to Index](../component-guidelines.md) |
[Previous: Stories](./stories.md)
