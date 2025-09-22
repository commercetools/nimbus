# Utilities and Constants Guidelines

[← Back to Index](../component-guidelines.md) | [Previous: Hooks](./hooks.md) |
[Next: Context Files →](./context-files.md)

## Purpose

The `utils/` and `constants/` directories contain helper functions, utilities,
configuration constants, and enums specific to a component. They help organize
non-React logic and static values.

## When to Use

### Create Utils When:

- **Pure functions** are needed (no React features)
- **Data transformation** or formatting logic
- **Validation** or parsing functions
- **Complex calculations** that don't need React
- **Helper functions** used multiple times

### Create Constants When:

- **Configuration values** need central management
- **Enums** or string literals are repeated
- **Default values** for complex structures
- **Keyboard shortcuts** or key codes
- **Regex patterns** for validation

### When Utils/Constants Aren't Needed:

- Logic requires React features (use hooks instead)
- Values are used only once
- Simple constants (keep in component file)

## Directory Structure

```
component-name/
├── component-name.tsx
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   ├── helpers.ts
│   └── index.ts
├── constants/
│   ├── defaults.ts
│   ├── enums.ts
│   ├── config.ts
│   └── index.ts
└── index.ts
```

## Utils Patterns

### Pure Helper Functions

```typescript
// utils/formatters.ts

/**
 * Format a date to display string
 * @param date - Date to format
 * @param locale - Locale for formatting
 * @returns Formatted date string
 */
export function formatDate(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Format currency value
 * @param value - Numeric value
 * @param currency - Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}
```

### Validation Functions

```typescript
// utils/validators.ts

/**
 * Validate email format
 * @param email - Email to validate
 * @returns Error message or undefined if valid
 */
export function validateEmail(email: string): string | undefined {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return "Email is required";
  }

  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }

  return undefined;
}

/**
 * Validate date range
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Error message or undefined if valid
 */
export function validateDateRange(
  startDate: Date,
  endDate: Date
): string | undefined {
  if (startDate > endDate) {
    return "Start date must be before end date";
  }

  return undefined;
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Strength level and message
 */
export function validatePasswordStrength(password: string): {
  strength: "weak" | "medium" | "strong";
  message: string;
} {
  if (password.length < 8) {
    return {
      strength: "weak",
      message: "Password must be at least 8 characters",
    };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const strength = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  if (strength < 2) {
    return {
      strength: "weak",
      message: "Add uppercase, numbers, or symbols",
    };
  }

  if (strength < 3) {
    return {
      strength: "medium",
      message: "Good password",
    };
  }

  return {
    strength: "strong",
    message: "Strong password",
  };
}
```

### Data Transformation

```typescript
// utils/transformers.ts

/**
 * Convert flat array to tree structure
 */
export function arrayToTree<T extends { id: string; parentId?: string }>(
  items: T[]
): TreeNode<T>[] {
  const map = new Map<string, TreeNode<T>>();
  const roots: TreeNode<T>[] = [];

  // Create nodes
  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  // Build tree
  items.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parentId) {
      const parent = map.get(item.parentId);
      parent?.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

/**
 * Group items by key
 */
export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      groups[groupKey] = groups[groupKey] || [];
      groups[groupKey].push(item);
      return groups;
    },
    {} as Record<string, T[]>
  );
}
```

### Utils Index File

```typescript
// utils/index.ts
export * from "./formatters";
export * from "./validators";
export * from "./transformers";
export * from "./helpers";
```

## Constants Patterns

### Configuration Constants

```typescript
// constants/config.ts

/**
 * Pagination configuration
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_VISIBLE_PAGES: 7,
  SIBLING_COUNT: 1,
} as const;

/**
 * Date picker configuration
 */
export const DATE_PICKER_CONFIG = {
  MIN_YEAR: 1900,
  MAX_YEAR: 2100,
  DEFAULT_FORMAT: "MM/dd/yyyy",
  WEEK_START_DAY: 0, // Sunday
  DISABLED_DAYS: [] as number[],
} as const;

/**
 * Form validation rules
 */
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_USERNAME_LENGTH: 20,
  MIN_AGE: 13,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;
```

### Enums and Types

```typescript
// constants/enums.ts

/**
 * Component size options
 */
export const SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
} as const;

export type Size = (typeof SIZES)[keyof typeof SIZES];

/**
 * Status indicators
 */
export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

/**
 * Keyboard keys
 */
export const KEYS = {
  ENTER: "Enter",
  ESCAPE: "Escape",
  SPACE: " ",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  TAB: "Tab",
  HOME: "Home",
  END: "End",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
} as const;
```

### Default Values

```typescript
// constants/defaults.ts

/**
 * Default select options when none provided
 */
export const DEFAULT_SELECT_OPTIONS = [
  { value: "", label: "Select an option" },
];

/**
 * Default table columns
 */
export const DEFAULT_TABLE_COLUMNS = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "created", label: "Created", sortable: true },
];

/**
 * Default color palette
 */
export const DEFAULT_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FECA57",
  "#FF9FF3",
] as const;
```

### Regex Patterns

```typescript
// constants/patterns.ts

/**
 * Common regex patterns for validation
 */
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
  PHONE_US: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  HEX_COLOR: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,

  // Credit card patterns
  VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
  MASTERCARD: /^5[1-5][0-9]{14}$/,
  AMEX: /^3[47][0-9]{13}$/,
} as const;
```

### Constants Index File

```typescript
// constants/index.ts
export * from "./config";
export * from "./enums";
export * from "./defaults";
export * from "./patterns";
```

## Examples from Nimbus

### RichTextInput Constants

```typescript
// rich-text-input/constants/editor-constants.ts
export const MARK_TYPES = {
  BOLD: "bold",
  ITALIC: "italic",
  UNDERLINE: "underline",
  STRIKETHROUGH: "strikethrough",
  CODE: "code",
} as const;

export const BLOCK_TYPES = {
  PARAGRAPH: "paragraph",
  HEADING_ONE: "heading-one",
  HEADING_TWO: "heading-two",
  BLOCK_QUOTE: "block-quote",
  LIST_ITEM: "list-item",
  NUMBERED_LIST: "numbered-list",
  BULLETED_LIST: "bulleted-list",
} as const;

export const HOTKEYS = {
  "mod+b": MARK_TYPES.BOLD,
  "mod+i": MARK_TYPES.ITALIC,
  "mod+u": MARK_TYPES.UNDERLINE,
  "mod+shift+s": MARK_TYPES.STRIKETHROUGH,
  "mod+`": MARK_TYPES.CODE,
} as const;
```

### Date Utils

```typescript
// date-picker/utils/date-helpers.ts
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}
```

## TypeScript Best Practices

### Type-Safe Constants

```typescript
// ✅ Good - type-safe with 'as const'
export const COLORS = {
  PRIMARY: "#007bff",
  SECONDARY: "#6c757d",
} as const;

type Color = (typeof COLORS)[keyof typeof COLORS];

```

### Pure Function Types

```typescript
// ✅ Good - explicit types
export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

```


## Testing Utils

```typescript
// utils/formatters.test.ts
import { formatCurrency, formatDate } from "./formatters";

describe("formatters", () => {
  describe("formatCurrency", () => {
    it("should format USD correctly", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });

    it("should handle different currencies", () => {
      expect(formatCurrency(1234.56, "EUR")).toBe("€1,234.56");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-15");
      expect(formatDate(date)).toBe("January 15, 2024");
    });
  });
});
```

## Related Guidelines

- [Hooks](./hooks.md) - React-specific logic
- [Types](./types.md) - Type definitions
- [Main Component](./main-component.md) - Using utils in components

## Validation Checklist

- [ ] Utils in `utils/` subfolder
- [ ] Constants in `constants/` subfolder
- [ ] Pure functions (no React features in utils)
- [ ] Immutable constants with `as const`
- [ ] JSDoc documentation for all exports
- [ ] Type-safe function signatures
- [ ] No side effects in utils
- [ ] Index files export all items
- [ ] Tests for complex utilities
- [ ] Meaningful, descriptive names

---

[← Back to Index](../component-guidelines.md) | [Previous: Hooks](./hooks.md) |
[Next: Context Files →](./context-files.md)
