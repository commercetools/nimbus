# Component Event Reference

This document lists all components that support event handling in the MCP-UI POC application.

## Event-Enabled Components

### Button (`nimbus-button`)

**Supported Events**: `press`

**Event Mapping**: `press` → `onPress`

**Data Attributes**:
- `data-label` - Button label text (used in event handler to identify which button was pressed)

**Example Remote DOM Script**:
```javascript
const button = document.createElement('nimbus-button');
button.setAttribute('variant', 'solid');
button.setAttribute('color-palette', 'primary');
button.setAttribute('data-label', 'View Details');
button.textContent = 'View Details';
root.appendChild(button);
```

**Event Handler Example**:
```typescript
if (typedAction.type === "event" && typedAction.event === "press") {
  const properties = typedAction.properties as Record<string, unknown> | undefined;
  const label = properties?.["data-label"] || "Unknown";
  console.log("🔘 Button pressed:", label);
  alert(`Button "${label}" was clicked!`);
}
```

### Alert Dismiss Button (`nimbus-alert-dismiss-button`)

**Supported Events**: `press`

**Event Mapping**: `press` → `onPress`

**Data Attributes**:
- Standard button attributes apply

**Example Remote DOM Script**:
```javascript
const alert = document.createElement('nimbus-alert-root');
alert.setAttribute('tone', 'info');

const title = document.createElement('nimbus-alert-title');
title.textContent = 'Information';
alert.appendChild(title);

const description = document.createElement('nimbus-alert-description');
description.textContent = 'This is an informational alert.';
alert.appendChild(description);

const actions = document.createElement('nimbus-alert-actions');
const dismissButton = document.createElement('nimbus-alert-dismiss-button');
dismissButton.textContent = 'Dismiss';
dismissButton.setAttribute('data-action', 'dismiss-alert');
actions.appendChild(dismissButton);
alert.appendChild(actions);

root.appendChild(alert);
```

**Event Handler Example**:
```typescript
if (typedAction.type === "event" && typedAction.event === "press") {
  const properties = typedAction.properties as Record<string, unknown> | undefined;
  if (properties?.["data-action"] === "dismiss-alert") {
    console.log("🚫 Alert dismissed");
    // Handle alert dismissal
  }
}
```

## Future Event Support

These components are candidates for event support in future iterations:

### Text Input (`nimbus-text-input`)

**Potential Events**: `change`, `blur`, `focus`, `input`

**Example Implementation**:
```typescript
{
  tagName: "nimbus-text-input",
  component: createWrappedComponent(
    Nimbus.TextInput,
    {
      name: "name",
      placeholder: "placeholder",
      "data-field-name": "data-field-name",
    },
    {
      change: "onChange",
      blur: "onBlur",
      focus: "onFocus",
    }
  ),
}
```

### Number Input (`nimbus-number-input`)

**Potential Events**: `change`, `increment`, `decrement`

### Select/Dropdown Components

**Potential Events**: `change`, `open`, `close`

### Form Components

**Potential Events**: `submit`, `reset`, `validate`

## Event Handling Patterns

### Basic Click/Press Events

Use for buttons, links, and interactive elements:
- Store identifying data in `data-*` attributes
- Access via `properties["data-attribute-name"]`

### Form Input Events

Use for text inputs, selects, checkboxes:
- `change` - When value changes
- `blur` - When losing focus
- `focus` - When gaining focus
- `input` - On every keystroke (use sparingly)

### Complex State Events

Use for components with multiple states:
- `open/close` - For dialogs, menus, popovers
- `expand/collapse` - For accordions, disclosure panels
- `select/deselect` - For selectable items

## Adding Event Support to New Components

### Step 1: Update nimbus-library.tsx

Add the component with event mapping:

```typescript
{
  tagName: "nimbus-your-component",
  component: createWrappedComponent(
    Nimbus.YourComponent,
    {
      // Prop mappings
      "kebab-prop": "camelProp",
    },
    {
      // Event mappings
      eventName: "onEventName",
    }
  ),
  propMapping: {
    "kebab-prop": "camelProp",
  },
  eventMapping: {
    eventName: "onEventName",
  },
}
```

### Step 2: Add remoteEvents Configuration

Update the corresponding remote element configuration:

```typescript
{
  tagName: "nimbus-your-component",
  remoteAttributes: ["kebab-prop"],
  remoteEvents: ["eventName"],
}
```

### Step 3: Add Event Handler

Add handling logic in chat-interface.tsx:

```typescript
if (typedAction.type === "event") {
  switch (typedAction.event) {
    case "eventName":
      // Handle your event
      const properties = typedAction.properties as Record<string, unknown> | undefined;
      console.log("Event data:", properties);
      break;
  }
}
```

### Step 4: Document in Remote DOM Scripts

Add data attributes to store event metadata:

```javascript
const element = document.createElement('nimbus-your-component');
element.setAttribute('data-identifier', 'unique-id');
element.setAttribute('data-context', 'additional-info');
root.appendChild(element);
```

## Debugging Event Issues

### 1. Check Event Registration

Look for the component in `createWrappedComponent` calls with event mapping.

### 2. Verify Remote Configuration

Ensure `remoteEvents` array includes your event name.

### 3. Test Event Handler

Add console logs to verify event flow:

```typescript
if (typedAction.type === "event") {
  console.log("🎬 Event received:", typedAction.event, typedAction);
}
```

### 4. Inspect Element Attributes

Check that data attributes are present in the DOM:

```javascript
console.log("Element attributes:", element.attributes);
```

## Best Practices

1. **Always use data attributes** for event metadata
2. **Keep event names semantic** - `press`, `change`, `submit`, not generic names
3. **Log events during development** for debugging
4. **Type guard your event handlers** for safety
5. **Handle all configured events** to avoid silent failures
6. **Document event behavior** in tool descriptions

## Related Documentation

- [EVENT_HANDLING_IMPLEMENTATION.md](./EVENT_HANDLING_IMPLEMENTATION.md) - Detailed implementation guide
- [BIDIRECTIONAL_COMMUNICATION.md](./BIDIRECTIONAL_COMMUNICATION.md) - Original concept documentation
- [nimbus-library.tsx](../mcp-ui-poc-client/src/components/nimbus-library.tsx) - Component configurations
- [chat-interface.tsx](../mcp-ui-poc-client/src/components/chat-interface.tsx) - Event handling examples
