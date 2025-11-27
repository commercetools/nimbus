# Unit Testing Guidelines

[← Back to Index](../component-guidelines.md) |
[Previous: Stories](./stories.md)

## Purpose

Unit test files (`{utility-name}.spec.ts` or `{hook-name}.spec.ts`) provide fast, isolated testing of **utility functions and React hooks** using JSDOM. Unit tests are exclusively for non-component logic.

**IMPORTANT**: All component behavior, interactions, and visual states are tested in Storybook stories with play functions. Unit tests are reserved for utilities and hooks only.

## When to Use

Unit tests are used for:

- **Utility functions and helpers** - Pure functions, formatters, validators, data transformers
- **React hooks** - Custom hooks tested in isolation with `renderHook`
- **Business logic** - Calculations, algorithms, data processing
- **Validation functions** - Input validators, schema validators
- **Helper modules** - String manipulation, date formatting, number formatting
- **Documentation examples** - Consumer-facing test patterns (in `.docs.spec.tsx` files)

**For component behavior testing**: Use Storybook stories with play functions to test all component interactions, visual states, and accessibility.

### Documentation Tests (`.docs.spec.tsx`)

A special category of unit tests used for engineering documentation:

- **Purpose**: Provide real, working test examples for consumers
- **Location**: Colocated with components (e.g., `text-input.docs.spec.tsx`)
- **Integration**: Automatically injected into `.dev.mdx` documentation at build time
- **Workflow**: Write once, used in both test suite AND documentation

See [Engineering Documentation Test Integration](../engineering-docs-validation.md) for complete details.

### Unit Tests vs Storybook Tests vs Documentation Tests

| Aspect | Unit Tests | Storybook Tests | Documentation Tests |
|--------|------------|-----------------|---------------------|
| **Environment** | JSDOM (fast, simulated) | Real browser (accurate) | JSDOM (consumer-friendly) |
| **Purpose** | Utility/hook logic verification | Component behavior & interactions | Consumer test examples |
| **Speed** | Very fast (~ms per test) | Slower (~seconds per story) | Very fast (~ms per test) |
| **Focus** | Pure functions, hooks | UI, user flows, visual states, a11y | Integration patterns, public API |
| **Use For** | Utilities, hooks | ALL components | Documentation examples |
| **File Pattern** | `*.spec.{ts,tsx}` | `*.stories.tsx` | `*.docs.spec.tsx` |
| **Audience** | Internal developers | Internal developers | External consumers |

**Testing Strategy**:
- **Nimbus internal testing**: Storybook stories test all component behavior
- **Consumer documentation**: `.docs.spec.tsx` tests demonstrate integration patterns
- **Utility testing**: Standard `.spec.ts` files test helper functions and hooks

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
    include: ["src/**/*.spec.{ts,tsx}"],                    // Test file patterns
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

### Basic Test File for Utility Functions

```typescript
// format-currency.spec.ts
import { describe, it, expect } from "vitest";
import { formatCurrency } from "./format-currency";

describe("formatCurrency", () => {
  describe("USD formatting", () => {
    it("formats whole numbers", () => {
      expect(formatCurrency(1000, "USD")).toBe("$1,000.00");
    });

    it("formats decimals", () => {
      expect(formatCurrency(1234.56, "USD")).toBe("$1,234.56");
    });

    it("handles negative values", () => {
      expect(formatCurrency(-500, "USD")).toBe("-$500.00");
    });
  });

  describe("Edge cases", () => {
    it("handles zero", () => {
      expect(formatCurrency(0, "USD")).toBe("$0.00");
    });

    it("handles very large numbers", () => {
      expect(formatCurrency(1000000000, "USD")).toBe("$1,000,000,000.00");
    });
  });
});
```

### Basic Test File for React Hooks

```typescript
// use-pagination.spec.ts
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "./use-pagination";

describe("usePagination", () => {
  describe("Initialization", () => {
    it("starts at page 1 by default", () => {
      const { result } = renderHook(() => usePagination({ totalPages: 10 }));

      expect(result.current.currentPage).toBe(1);
    });

    it("respects defaultPage option", () => {
      const { result } = renderHook(() =>
        usePagination({ totalPages: 10, defaultPage: 5 })
      );

      expect(result.current.currentPage).toBe(5);
    });
  });

  describe("Navigation", () => {
    it("navigates to next page", () => {
      const { result } = renderHook(() => usePagination({ totalPages: 10 }));

      act(() => {
        result.current.goToNext();
      });

      expect(result.current.currentPage).toBe(2);
    });

    it("does not go beyond last page", () => {
      const { result } = renderHook(() => usePagination({ totalPages: 10 }));

      act(() => {
        result.current.goToPage(10);
        result.current.goToNext();
      });

      expect(result.current.currentPage).toBe(10);
    });
  });
});
```

## Testing Patterns

### Test Organization

Use nested `describe` blocks to organize tests by feature area:

```typescript
describe("formatDate", () => {
  describe("ISO format", () => {
    // ISO date formatting tests
  });

  describe("Locale-specific", () => {
    // Locale formatting tests
  });

  describe("Edge cases", () => {
    // Invalid dates, null handling
  });
});

describe("useDebounce", () => {
  describe("Basic functionality", () => {
    // Standard debounce behavior
  });

  describe("Cleanup", () => {
    // Unmount and cleanup tests
  });

  describe("Edge cases", () => {
    // Rapid updates, zero delay
  });
});
```

### Test Utilities

For hook testing, use React Testing Library's `renderHook`:

```typescript
import { renderHook, act, waitFor } from "@testing-library/react";
```

**Key utilities**:

- `renderHook` - Renders a hook in a test component
- `act` - Wraps state updates for proper React lifecycle
- `waitFor` - Wait for async operations
- `cleanup` - Automatically called after each test

**Usage**:

```typescript
// ✅ Basic hook testing
const { result } = renderHook(() => useCustomHook());
expect(result.current.value).toBe(expectedValue);

// ✅ Hook with state updates
const { result } = renderHook(() => useCounter());
act(() => {
  result.current.increment();
});
expect(result.current.count).toBe(1);

// ✅ Async hook testing
const { result } = renderHook(() => useFetchData());
await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});
```

## Common Test Patterns

### Testing Pure Utility Functions

```typescript
// format-price.spec.ts
import { describe, it, expect } from "vitest";
import { formatPrice } from "./format-price";

describe("formatPrice", () => {
  it("formats positive numbers", () => {
    expect(formatPrice(1234.56)).toBe("$1,234.56");
  });

  it("formats negative numbers", () => {
    expect(formatPrice(-1234.56)).toBe("-$1,234.56");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });

  it("rounds to two decimals", () => {
    expect(formatPrice(1234.567)).toBe("$1,234.57");
  });
});
```

### Testing Functions with Side Effects

```typescript
// logger.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logError } from "./logger";

describe("logError", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("logs error message", () => {
    logError("Test error");

    expect(consoleErrorSpy).toHaveBeenCalledWith("Test error");
  });

  it("logs error with context", () => {
    logError("Test error", { userId: "123" });

    expect(consoleErrorSpy).toHaveBeenCalledWith("Test error", {
      userId: "123",
    });
  });
});
```

### Testing React Hooks - State Management

```typescript
// use-toggle.spec.ts
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToggle } from "./use-toggle";

describe("useToggle", () => {
  it("initializes with false by default", () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current.value).toBe(false);
  });

  it("initializes with provided value", () => {
    const { result } = renderHook(() => useToggle(true));

    expect(result.current.value).toBe(true);
  });

  it("toggles value", () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.value).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.value).toBe(false);
  });

  it("sets value directly", () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current.setValue(true);
    });

    expect(result.current.value).toBe(true);
  });
});
```

### Testing React Hooks - Side Effects

```typescript
// use-local-storage.spec.ts
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./use-local-storage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reads initial value from localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    expect(result.current[0]).toBe("stored-value");
  });

  it("uses default value when key not found", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "default-value")
    );

    expect(result.current[0]).toBe("default-value");
  });

  it("updates localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(localStorage.getItem("test-key")).toBe(JSON.stringify("updated"));
  });
});
```

### Testing React Hooks - Cleanup

```typescript
// use-interval.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useInterval } from "./use-interval";

describe("useInterval", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls callback at specified interval", () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("cleans up interval on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useInterval(callback, 1000));

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1); // Not called again after unmount
  });
});
```

### Testing Validation Functions

```typescript
// validate-email.spec.ts
import { describe, it, expect } from "vitest";
import { validateEmail } from "./validate-email";

describe("validateEmail", () => {
  it("accepts valid email addresses", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("first.last@domain.co.uk")).toBe(true);
    expect(validateEmail("user+tag@example.com")).toBe(true);
  });

  it("rejects invalid email addresses", () => {
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("notanemail")).toBe(false);
    expect(validateEmail("@example.com")).toBe(false);
    expect(validateEmail("user@")).toBe(false);
  });

  it("handles edge cases", () => {
    expect(validateEmail(null as any)).toBe(false);
    expect(validateEmail(undefined as any)).toBe(false);
  });
});
```


## Async Testing

### When to Use `waitFor`

Use `waitFor` when testing asynchronous operations in hooks or utilities:

```typescript
// use-fetch-data.spec.ts
it("loads data asynchronously", async () => {
  const { result } = renderHook(() => useFetchData("/api/data"));

  expect(result.current.isLoading).toBe(true);

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.data).toBeDefined();
});
```

### Testing Async Utilities

```typescript
// async-validator.spec.ts
it("validates data asynchronously", async () => {
  const result = await validateAsync({ email: "test@example.com" });

  expect(result.isValid).toBe(true);
  expect(result.errors).toHaveLength(0);
});

it("handles validation errors", async () => {
  const result = await validateAsync({ email: "invalid" });

  expect(result.isValid).toBe(false);
  expect(result.errors).toContain("Invalid email format");
});
```

## Mocking

### Mocking Functions

```typescript
import { vi } from "vitest";

// Mock callback in utility function
it("calls callback with processed data", () => {
  const callback = vi.fn();
  processData([1, 2, 3], callback);

  expect(callback).toHaveBeenCalledTimes(3);
  expect(callback).toHaveBeenCalledWith(1);
});
```

### Mocking Modules

```typescript
// Mock external API module
vi.mock("./api-client", () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: "123", name: "Test User" })),
}));

// Mock browser APIs
vi.mock("./browser-storage", () => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
}));
```

### Mocking Timers

```typescript
import { vi, beforeEach, afterEach } from "vitest";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("delays function execution", () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 1000);

    debounced();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
```

## Best Practices

### Test Structure

- **Use descriptive test names** - Test names should clearly state what is being tested
- **One assertion per test** - Keep tests focused on a single behavior
- **Arrange-Act-Assert pattern** - Structure tests clearly:
  1. Arrange: Set up test data and dependencies
  2. Act: Execute the function or hook
  3. Assert: Verify the expected outcome

```typescript
it("formats currency with proper decimals", () => {
  // Arrange
  const amount = 1234.5;
  const currency = "USD";

  // Act
  const result = formatCurrency(amount, currency);

  // Assert
  expect(result).toBe("$1,234.50");
});
```

### Testing Pure Functions

- **Focus on inputs and outputs** - Pure functions are deterministic
- **Test edge cases** - Null, undefined, empty values, extremes
- **Test boundary conditions** - Min/max values, zero, negative numbers
- **Avoid implementation details** - Test behavior, not how it's implemented

```typescript
describe("clamp", () => {
  it("returns value within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to minimum", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps to maximum", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
```

### Testing Hooks

- **Use renderHook** - Proper React lifecycle handling
- **Wrap state updates in act** - Ensures proper batching
- **Test cleanup** - Verify useEffect cleanup functions run
- **Test dependencies** - Ensure hooks respond to prop/state changes

```typescript
it("cleans up on unmount", () => {
  const cleanup = vi.fn();
  const { unmount } = renderHook(() => useCustomEffect(cleanup));

  unmount();

  expect(cleanup).toHaveBeenCalled();
});
```

### Avoid Snapshots

Snapshot tests are fragile and provide little value:

```typescript
// ❌ Avoid: Snapshot testing
expect(result).toMatchSnapshot();

// ✅ Preferred: Specific assertions
expect(result.status).toBe("success");
expect(result.data).toHaveLength(3);
expect(result.errors).toBeUndefined();
```

## Running Tests

### Command Line

```bash
# Run all tests (both unit and Storybook)
pnpm test

# Run only unit tests
pnpm test --project unit

# Run specific test file
pnpm test button.spec.tsx

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
pnpm test src/components/button/button.spec.tsx
```

## Coverage

### Test Coverage Focus

Unit tests should cover these areas for utilities and hooks:

- **Happy path** - Normal usage scenarios and expected inputs
- **Edge cases** - Null, undefined, empty values, boundary conditions
- **Error states** - Invalid inputs and error handling paths
- **Async behavior** - Loading states, success cases, and error cases
- **Side effects** - Cleanup functions, subscriptions, timers
- **Return values** - All possible return types and states
- **Hook lifecycle** - Mounting, updating, unmounting behavior

**Scope**: Unit tests are for utility functions and React hooks. Component behavior is tested in Storybook stories with play functions.

## Related Guidelines

- [Stories](./stories.md) - Storybook interaction tests for components
- [Hooks](./hooks.md) - Hook implementation patterns
- [Utils and Constants](./utils-and-constants.md) - Utility function patterns

## Validation Checklist

- [ ] Test file exists with `.spec.ts` or `.spec.tsx` extension
- [ ] File located alongside utility or hook being tested
- [ ] **Testing utilities or hooks only** (components use Storybook stories)
- [ ] Uses `describe` blocks to organize tests by feature area
- [ ] Test names clearly describe behavior being tested
- [ ] Uses `renderHook` for testing hooks
- [ ] State updates wrapped in `act` for hooks
- [ ] Edge cases covered (null, undefined, empty values)
- [ ] Error handling tested
- [ ] Async behavior properly handled with `waitFor`
- [ ] Cleanup tested for hooks with side effects
- [ ] Tests focus on behavior, not implementation
- [ ] Uses specific assertions instead of snapshots
- [ ] Mocks used appropriately for external dependencies
- [ ] Timers mocked when testing debounce/throttle/intervals

---

[← Back to Index](../component-guidelines.md) |
[Previous: Stories](./stories.md)
