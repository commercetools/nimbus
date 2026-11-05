# Writing i18n: Message Patterns

## Message Patterns by Use Case

### Accessibility Labels

```typescript
export const messages = {
  increment: {
    id: "Nimbus.NumberInput.increment",
    description: "aria-label for increment button in number input",
    defaultMessage: "Increment",
  },
  decrement: {
    id: "Nimbus.NumberInput.decrement",
    description: "aria-label for decrement button in number input",
    defaultMessage: "Decrement",
  },
});
```

### Button Labels

```typescript
export const messages = {
  dismiss: {
    id: "Nimbus.Alert.dismiss",
    description: "Label for dismiss button in alert component",
    defaultMessage: "Dismiss",
  },
  close: {
    id: "Nimbus.Dialog.close",
    description: "Label for close button in dialog header",
    defaultMessage: "Close",
  },
});
```

### Placeholder Text

```typescript
export const messages = {
  selectDate: {
    id: "Nimbus.DatePicker.selectDate",
    description: "Placeholder text for date input field",
    defaultMessage: "Select date",
  },
  enterText: {
    id: "Nimbus.TextInput.enterText",
    description: "Default placeholder for text input field",
    defaultMessage: "Enter text",
  },
});
```

### State Indicators

```typescript
export const messages = {
  showPassword: {
    id: "Nimbus.PasswordInput.show",
    description: "Button label to reveal password text",
    defaultMessage: "Show password",
  },
  hidePassword: {
    id: "Nimbus.PasswordInput.hide",
    description: "Button label to conceal password text",
    defaultMessage: "Hide password",
  },
});
```

### Dynamic Messages (with values)

```typescript
export const messages = {
  itemsSelected: {
    id: "Nimbus.Select.itemsSelected",
    description: "Announces number of selected items to screen readers",
    defaultMessage:
      "{count, plural, one {# item selected} other {# items selected}}",
  },
  pageIndicator: {
    id: "Nimbus.Pagination.pageIndicator",
    description: "Current page indicator for pagination",
    defaultMessage: "Page {current} of {total}",
  },
});
```
