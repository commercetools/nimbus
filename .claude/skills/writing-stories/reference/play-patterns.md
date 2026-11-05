# Play Function Patterns

## Play Function Patterns (CRITICAL)

### Structure Requirements

You MUST use this structure:

```typescript
play: async ({ canvasElement, args, step }) => {
  const canvas = within(canvasElement); // or parent for portals

  await step("Descriptive test name", async () => {
    // Test implementation
  });

  await step("Next test", async () => {
    // Test implementation
  });
};
```

### Query Strategy

**Prefer accessible queries (in order of preference):**

1. `canvas.getByRole()` - BEST for interactive elements
2. `canvas.getByLabelText()` - BEST for form inputs
3. `canvas.getByTestId()` - Use sparingly for non-interactive elements
4. `document.querySelector()` - ONLY for portal content when necessary

### Interaction Patterns

#### Click Testing

```typescript
await step("Test click interaction", async () => {
  const button = canvas.getByRole("button");
  await userEvent.click(button);
  await expect(args.onClick).toHaveBeenCalledTimes(1);
});
```

#### Typing Testing

```typescript
await step("Test text input", async () => {
  const input = canvas.getByRole("textbox");
  await userEvent.type(input, "Test value");
  await expect(input).toHaveValue("Test value");

  await userEvent.clear(input);
  await expect(input).toHaveValue("");
});
```

#### Keyboard Navigation

```typescript
await step("Test keyboard navigation", async () => {
  const element = canvas.getByRole("button");

  // Tab to focus
  await userEvent.tab();
  await expect(element).toHaveFocus();

  // Enter to activate
  await userEvent.keyboard("{Enter}");
  await expect(args.onPress).toHaveBeenCalled();

  // Space to activate
  await userEvent.keyboard(" ");
  await expect(args.onPress).toHaveBeenCalledTimes(2);
});
```

#### Arrow Key Navigation (Menu, Select, etc.)

```typescript
await step("Test arrow key navigation", async () => {
  // Navigate down
  await userEvent.keyboard("{ArrowDown}");
  await waitFor(() => {
    const secondItem = canvas.getByRole("menuitem", { name: /Item 2/ });
    expect(secondItem).toHaveFocus();
  });

  // Navigate up
  await userEvent.keyboard("{ArrowUp}");
  await waitFor(() => {
    const firstItem = canvas.getByRole("menuitem", { name: /Item 1/ });
    expect(firstItem).toHaveFocus();
  });
});
```

#### Async Operations

```typescript
await step("Test async state changes", async () => {
  await userEvent.click(triggerButton);

  // Wait for async content to appear
  await waitFor(() => {
    expect(canvas.getByText("Loaded content")).toBeInTheDocument();
  });
});
```

### Accessibility Testing

You MUST test these accessibility features:

```typescript
await step("Test ARIA attributes", async () => {
  const element = canvas.getByRole("button");

  // Required attribute
  await expect(element).toHaveAttribute("aria-label", "Close");

  // Disabled state
  await expect(element).toHaveAttribute("aria-disabled", "true");

  // Invalid state
  await expect(element).toHaveAttribute("data-invalid", "true");
});

await step("Test focus management", async () => {
  // Initial focus
  const firstButton = canvas.getByRole("button", { name: "First" });
  await userEvent.tab();
  await expect(firstButton).toHaveFocus();

  // Focus restoration after dialog close
  await userEvent.keyboard("{Escape}");
  await waitFor(
    () => {
      expect(firstButton).toHaveFocus();
    },
    { timeout: 1000 }
  );
});
```

### State Verification

```typescript
await step("Verify state changes", async () => {
  const checkbox = canvas.getByRole("checkbox");

  // Initial state
  await expect(checkbox).not.toBeChecked();

  // After interaction
  await userEvent.click(checkbox);
  await expect(checkbox).toBeChecked();

  // Visual indication (data attributes)
  await expect(checkbox).toHaveAttribute("data-selected");
});
```

## Common Testing Patterns by Component Type

### Form Inputs (TextInput, Select, Checkbox)

**MUST test:**

- Initial render and attributes
- Focus with Tab
- Type/input value
- Clear value
- Required state (aria-required)
- Disabled state (cannot focus, cannot input)
- Invalid state (can still interact, has data-invalid)
- Controlled state synchronization

### Buttons (Button, IconButton, ToggleButton)

**MUST test:**

- Click interaction
- Focus with Tab
- Keyboard activation (Enter, Space)
- Disabled state (cannot focus, cannot activate)
- Visual variants render correctly

### Overlays (Dialog, Menu, Popover)

**MUST test:**

- Open via trigger
- Portal content appears (use parent element)
- Keyboard navigation inside overlay
- Escape key dismissal
- Focus restoration to trigger
- Backdrop click (if dismissable)

### Navigation (Pagination, Tabs)

**MUST test:**

- Navigation between items
- Keyboard navigation (Arrow keys, Home, End)
- Current item indication
- Disabled navigation buttons at boundaries
- Input validation (for direct input components)

### Selection (RadioGroup, CheckboxGroup, Select)

**MUST test:**

- Single selection (radio) - only one selected
- Multiple selection (checkbox) - multiple selected
- Selection change callbacks
- Keyboard selection (Space, Enter)
- Disabled options cannot be selected
