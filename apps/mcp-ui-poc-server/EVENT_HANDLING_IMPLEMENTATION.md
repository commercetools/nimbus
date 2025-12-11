# Event Handling Implementation Guide

## Overview

This document explains how event handling works in the MCP-UI **proof of concept** application, including the custom implementation required due to limitations in the @mcp-ui/client library.

**⚠️ POC Status**: This implementation is a proof of concept to demonstrate feasibility. It is **not production-ready** and would require significant hardening, testing, and security review before production use.

## The Problem

The @mcp-ui/client library defines `eventMapping` in its TypeScript interfaces but **does not actually implement event forwarding**. The `UIActionType` only includes:

```typescript
type UIActionType = 'tool' | 'prompt' | 'link' | 'intent' | 'notify';
```

There is no built-in support for DOM events like `press`, `change`, or `focus`.

## The Solution: Custom Event Handling System

We implemented a custom event handling system using React Context and a prop mapping wrapper.

### Architecture

```
┌─────────────────────────────────────┐
│   Remote DOM (iframe)               │
│                                      │
│   User clicks button                │
│         ↓                            │
│   Browser dispatches native event   │
│         ↓                            │
│   Our custom event handler          │
└─────────────────┬───────────────────┘
                  │ Event forwarded via
                  │ React Context
                  ↓
┌─────────────────────────────────────┐
│   Host Application (React)          │
│                                      │
│   UIActionProvider provides handler │
│         ↓                            │
│   onUIAction handler called         │
│         ↓                            │
│   Event processed & action taken    │
└─────────────────────────────────────┘
```

## Implementation Details

### 1. React Context for Event Handler Injection

**File**: `src/utils/prop-mapping-wrapper.tsx`

We use React Context to inject the `onUIAction` callback into wrapped components:

```typescript
const UIActionContext = createContext<
  ((action: unknown) => void | Promise<void>) | null
>(null);

export const UIActionProvider = UIActionContext.Provider;

export function useUIAction() {
  return useContext(UIActionContext);
}
```

### 2. Custom Prop Mapping Wrapper with Event Handling

The `createPropMappingWrapper` function accepts three parameters:

1. `Component` - The React component to wrap
2. `propMapping` - Maps kebab-case attributes to camelCase props
3. `eventMapping` - Maps remote event names to React event props

**Key implementation**:

```typescript
export function createPropMappingWrapper<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  propMapping: Record<string, string>,
  eventMapping?: Record<string, string>
): React.ComponentType<Record<string, unknown>> {
  const WrapperComponent = (props: Record<string, unknown>) => {
    const onUIAction = useUIAction();

    // Create mapped props object
    const mappedProps: Record<string, unknown> = {};

    // Map prop names (kebab-case → camelCase)
    for (const [key, value] of Object.entries(props)) {
      const mappedKey = propMapping[key];
      if (mappedKey) {
        mappedProps[mappedKey] = value;
      } else {
        mappedProps[key] = value;
      }
    }

    // Add event handlers if eventMapping is provided
    if (eventMapping && onUIAction) {
      for (const [remoteEventName, reactEventProp] of Object.entries(eventMapping)) {
        // Create synthetic event handler
        mappedProps[reactEventProp] = (event: unknown) => {
          const target = (event as any)?.target;
          const properties: Record<string, unknown> = {};

          // Collect all element attributes
          if (target && target.getAttribute) {
            const attributes = target.attributes;
            for (let i = 0; i < attributes.length; i++) {
              const attr = attributes[i];
              properties[attr.name] = attr.value;
            }
          }

          // Include component props
          Object.assign(properties, props);

          // Trigger UI action with custom event format
          onUIAction({
            type: "event",
            event: remoteEventName,
            properties,
            target: target?.tagName?.toLowerCase(),
          });
        };
      }
    }

    return React.createElement(Component, mappedProps as P);
  };

  WrapperComponent.displayName = `PropMappingWrapper(${Component.displayName || Component.name || "Component"})`;

  return WrapperComponent;
}
```

### 3. Component Configuration with Event Mapping

**File**: `src/components/nimbus-library.tsx`

Components are configured with both prop mapping AND event mapping:

```typescript
{
  tagName: "nimbus-button",
  component: createWrappedComponent(
    Nimbus.Button,
    {
      variant: "variant",
      "color-palette": "colorPalette",
      width: "width",
      "is-disabled": "isDisabled",
      "margin-top": "marginTop",
      "data-label": "data-label",  // Store button label for event handling
    },
    {
      press: "onPress",  // Map "press" event to React's "onPress" prop
    }
  ),
  propMapping: { /* ... */ },
  eventMapping: {
    press: "onPress",
  },
}
```

**Important**: Store event metadata in data attributes (like `data-label`) so it's available when the event fires.

### 4. Event Handler in Host Application

**File**: `src/components/chat-interface.tsx`

The host application provides the event handler through UIActionProvider:

```typescript
// Define the event handler
const handleUIAction = async (action: unknown) => {
  // Type guard
  if (!action || typeof action !== "object" || Array.isArray(action)) {
    return;
  }

  const typedAction = action as Record<string, unknown>;
  console.log("🎬 UI Action received:", typedAction);

  // Handle Remote DOM events (from our custom wrapper)
  if (typedAction.type === "event") {
    console.log("🎯 Event:", typedAction.event, typedAction);

    // Handle button press events
    if (typedAction.event === "press") {
      const properties = typedAction.properties as Record<string, unknown> | undefined;
      const label = properties?["data-label"] || "Unknown";
      console.log("🔘 Button pressed:", label);
      alert(`Button "${label}" was clicked!`);
    }
    return;
  }

  // Handle other action types (tool, notify, prompt, etc.)
  // ...
};

// Wrap UIResourceRenderer with the provider
return (
  <Box key={i} marginTop="300">
    <UIActionProvider value={handleUIAction}>
      <UIResourceRenderer
        resource={resource.resource}
        remoteDomProps={{
          library: nimbusLibrary,
          remoteElements: nimbusRemoteElements,
        }}
        onUIAction={handleUIAction}
      />
    </UIActionProvider>
  </Box>
);
```

## Event Structure

When a button is pressed, the custom event handler creates this structure:

```typescript
{
  type: "event",           // Identifies this as a custom DOM event
  event: "press",          // The event name (from eventMapping)
  properties: {            // Element attributes + component props
    "data-label": "View Details",
    "variant": "solid",
    "color-palette": "primary",
    // ... other attributes
  },
  target: "button"         // Element tag name
}
```

## Adding Event Support to New Components

### Step 1: Configure Event Mapping in nimbus-library.tsx

```typescript
{
  tagName: "nimbus-text-input",
  component: createWrappedComponent(
    Nimbus.TextInput,
    {
      name: "name",
      placeholder: "placeholder",
      "data-field-name": "data-field-name",  // Add data attributes
    },
    {
      change: "onChange",  // Map change event
      blur: "onBlur",      // Map blur event
    }
  ),
  propMapping: { /* ... */ },
  eventMapping: {
    change: "onChange",
    blur: "onBlur",
  },
}
```

### Step 2: Add Event Handling in chat-interface.tsx

```typescript
if (typedAction.type === "event") {
  switch (typedAction.event) {
    case "press":
      // Handle button clicks
      break;

    case "change":
      // Handle input changes
      const value = typedAction.value;
      const fieldName = typedAction.properties?.["data-field-name"];
      console.log(`Field ${fieldName} changed to: ${value}`);
      break;

    case "blur":
      // Handle focus loss
      break;
  }
}
```

### Step 3: Store Event Metadata in Attributes

```typescript
// In the MCP tool that generates the Remote DOM script
const remoteDomScript = `
  const input = document.createElement('nimbus-text-input');
  input.setAttribute('name', 'email');
  input.setAttribute('placeholder', 'Enter email');
  input.setAttribute('data-field-name', 'email');  // Store field name
  root.appendChild(input);
`;
```

## Differences from Standard Remote DOM

### Standard Remote DOM (Not Available in @mcp-ui/client)

In a full Remote DOM implementation, events would be handled automatically:

```typescript
// This DOES NOT work with @mcp-ui/client
remoteElements: [{
  tagName: "nimbus-button",
  remoteEvents: ["press"],  // Would automatically forward events
}]
```

### Our Custom Implementation

We manually attach event handlers through the prop mapping wrapper:

```typescript
// This DOES work
createWrappedComponent(
  Component,
  propMapping,
  { press: "onPress" }  // We manually map and attach handlers
)
```

## Debugging Event Issues

### Check 1: Event Handler Attached?

Look for console logs when clicking:
```
🎬 UI Action received: {type: event, event: press, ...}
```

If missing, check:
- Is `eventMapping` configured in nimbus-library.tsx?
- Is the component wrapped with `createWrappedComponent`?
- Is `UIActionProvider` wrapping the UIResourceRenderer?

### Check 2: Event Data Available?

Check the properties object in console:
```
properties: {
  "data-label": "Button Label",
  "variant": "solid"
}
```

If attributes are missing:
- Are data attributes set in the Remote DOM script?
- Are they included in `remoteAttributes` configuration?

### Check 3: Handler Executing?

Check for event-specific logs:
```
🎯 Event: press {type: event, event: press, ...}
🔘 Button pressed: Button Label
```

If missing:
- Is the event type handled in the switch statement?
- Are there any TypeScript errors in the handler?

## Best Practices

1. **Store metadata in data attributes**: Use `data-*` attributes for information needed during event handling
2. **Use descriptive event names**: `press` for buttons, `change` for inputs, `submit` for forms
3. **Type guard your event handlers**: Use TypeScript type guards to safely access event properties
4. **Log events during development**: Keep console.log statements to debug event flow
5. **Handle all configured events**: Every event in `eventMapping` should have a handler

## Known Limitations

1. **No automatic event forwarding**: @mcp-ui/client doesn't implement eventMapping - we must do it manually
2. **Event bubbling**: Our implementation doesn't support event bubbling/capturing
3. **Event object access**: We don't have access to the native event object properties beyond the target
4. **Async event handling**: Event handlers can be async, but we don't wait for completion

## Production Readiness Considerations

**This is a POC implementation**. Before production use, the following would need to be addressed:

### Security
- **XSS Prevention**: Validate and sanitize all data attributes
- **CSRF Protection**: Add token validation for state-changing actions
- **Input Validation**: Strict validation of event properties
- **Rate Limiting**: Prevent event handler abuse

### Performance
- **Event Handler Optimization**: Profile and optimize handler execution
- **Memory Leaks**: Ensure proper cleanup of event handlers
- **Throttling/Debouncing**: Add for high-frequency events
- **Bundle Size**: Optimize wrapper implementation

### Testing
- **Unit Tests**: Comprehensive test coverage for all event handlers
- **Integration Tests**: Test event flow end-to-end
- **E2E Tests**: Full user interaction scenarios
- **Accessibility Tests**: Verify keyboard navigation and screen readers

### Reliability
- **Error Boundaries**: Graceful degradation when handlers fail
- **Error Reporting**: Track and report event handling failures
- **Fallback Behavior**: Define behavior when events fail
- **Browser Compatibility**: Test across all supported browsers

### Monitoring
- **Analytics**: Track event usage patterns
- **Performance Metrics**: Measure event handling latency
- **Error Tracking**: Monitor event handler errors
- **User Behavior**: Understand how events are used

## Related Documentation

- [BIDIRECTIONAL_COMMUNICATION.md](./BIDIRECTIONAL_COMMUNICATION.md) - Original documentation (some concepts outdated)
- [prop-mapping-wrapper.tsx](../mcp-ui-poc-client/src/utils/prop-mapping-wrapper.tsx) - Implementation
- [nimbus-library.tsx](../mcp-ui-poc-client/src/components/nimbus-library.tsx) - Component configuration
- [chat-interface.tsx](../mcp-ui-poc-client/src/components/chat-interface.tsx) - Event handling examples
