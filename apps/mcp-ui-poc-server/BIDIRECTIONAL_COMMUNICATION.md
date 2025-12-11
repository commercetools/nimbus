# Bidirectional Communication: Event Handling Fix

## Problem

Button click events were not working. When users clicked buttons in the UI, nothing happened - no alerts, no console logs, no actions triggered.

### Root Cause

The button tool was setting up direct `onclick` handlers that bypassed Remote DOM's event system:

```javascript
// ❌ WRONG - Direct onclick bypasses Remote DOM
button.onclick = function() {
  if (typeof window.postUIActionResult === 'function') {
    window.postUIActionResult({
      type: 'button-clicked',
      payload: { label: 'Button Label' }
    });
  }
};
```

**Why this didn't work:**
1. Remote DOM manages its own event system through `remoteEvents` configuration
2. Direct DOM event handlers are not intercepted by Remote DOM
3. Events never reach the host application's `onUIAction` handler
4. The `window.postUIActionResult` function is part of the UI Action protocol, not Remote DOM events

---

## Solution: Use Remote DOM's Event System

Remote DOM provides a bidirectional communication channel where events flow naturally from the remote iframe to the host application.

### Architecture

```
┌─────────────────────────────────────┐
│   Remote DOM (iframe)               │
│                                      │
│   User clicks button                │
│         ↓                            │
│   Browser dispatches "press" event  │
│         ↓                            │
│   Remote DOM intercepts event       │
└─────────────────┬───────────────────┘
                  │ Event forwarded via
                  │ Remote DOM protocol
                  ↓
┌─────────────────────────────────────┐
│   Host Application (React)          │
│                                      │
│   UIResourceRenderer receives event │
│         ↓                            │
│   onUIAction handler called         │
│         ↓                            │
│   Event processed & action taken    │
└─────────────────────────────────────┘
```

### Implementation Steps

#### 1. Configure Remote Events in Library

Tell Remote DOM which events to listen for:

```typescript
// nimbus-library.tsx - remoteElements configuration
{
  tagName: "nimbus-button",
  remoteAttributes: [
    "variant",
    "color-palette",
    "width",
    "is-disabled",
    "margin-top",
    "data-label",  // ← Added to pass button label
  ],
  remoteEvents: ["press"],  // ← Remote DOM listens for this event
}
```

#### 2. Map Events to React Props

Tell Remote DOM how to forward events to React components:

```typescript
// nimbus-library.tsx - component configuration
{
  tagName: "nimbus-button",
  component: createWrappedComponent(Nimbus.Button, {
    variant: "variant",
    "color-palette": "colorPalette",
    "data-label": "data-label",  // ← Map attribute to prop
    // ... other props
  }),
  eventMapping: {
    press: "onPress",  // ← Map remote "press" to React "onPress"
  },
}
```

#### 3. Store Event Data in Attributes

Instead of onclick handlers, store data needed for event handling:

```typescript
// button.ts - Tool implementation
const remoteDomScript = `
  const button = document.createElement('nimbus-button');
  button.setAttribute('variant', '${variant}');
  button.setAttribute('color-palette', '${colorPalette}');
  button.textContent = '${escapedLabel}';

  // ✅ Store label as data attribute - no onclick handler
  button.setAttribute('data-label', '${escapedLabel}');

  root.appendChild(button);
`;
```

#### 4. Handle Events in Host Application

Receive and process events in the React application:

```typescript
// chat-interface.tsx
<UIResourceRenderer
  resource={resource.resource}
  remoteDomProps={{
    library: nimbusLibrary,
    remoteElements: nimbusRemoteElements,
  }}
  onUIAction={async (action: unknown) => {
    // Type guard
    if (!action || typeof action !== "object" || Array.isArray(action)) {
      return action;
    }

    const typedAction = action as Record<string, unknown>;
    console.log("🎬 UI Action received:", typedAction);

    // Handle Remote DOM events
    if (typedAction.type === "event") {
      console.log("🎯 Event:", typedAction.event, typedAction);

      // Handle button press events
      if (typedAction.event === "press") {
        const properties = typedAction.properties as Record<string, unknown> | undefined;
        const label = properties?.["data-label"] || "Unknown";
        console.log("🔘 Button pressed:", label);
        alert(`Button "${label}" was clicked!`);
      }
      return typedAction;
    }

    // Handle other action types (tool, notify, etc.)
    // ...

    return typedAction;
  }}
/>
```

---

## Event Structure

### Remote DOM Event Object

When a button is pressed, Remote DOM sends this structure:

```typescript
{
  type: "event",           // Identifies this as a Remote DOM event
  event: "press",          // The event name (from remoteEvents)
  properties: {            // Element attributes at event time
    "data-label": "Button Label",
    "variant": "solid",
    "color-palette": "primary",
    // ... other attributes
  },
  // Additional Remote DOM event metadata...
}
```

### Event Flow

1. **User Action**: User clicks button in iframe
2. **Browser Event**: Native DOM "click" event fires
3. **Remote DOM Intercepts**: Detects click on element with `remoteEvents: ["press"]`
4. **Event Translation**: Converts native click to Remote DOM "press" event
5. **Message Passing**: Sends event through iframe → host communication channel
6. **Host Reception**: `onUIAction` handler receives event object
7. **Action Processing**: Extract data from `properties` and handle accordingly

---

## Key Differences: Remote DOM Events vs UI Actions

### Remote DOM Events (`type: "event"`)

- **Source**: User interactions in the Remote DOM iframe
- **Examples**: `press`, `change`, `submit`, `focus`, `blur`
- **Purpose**: Forward UI events from remote environment to host
- **Data Location**: Element attributes in `properties` object
- **When**: Real-time as user interacts with UI

### UI Actions (other types)

- **Source**: Application logic, workflows, tool integrations
- **Examples**: `notify`, `tool`, `prompt`, `link`, `intent`
- **Purpose**: Trigger specific application behaviors
- **Data Location**: Structured `payload` object
- **When**: Programmatically triggered by application

```typescript
// Example: Remote DOM Event
{
  type: "event",
  event: "press",
  properties: { "data-label": "Save" }
}

// Example: UI Action
{
  type: "tool",
  payload: {
    toolName: "submitForm",
    params: { formData: {...} }
  }
}
```

---

## Files Modified

### 1. `/apps/mcp-ui-poc-server/src/tools/button.ts`

**Before:**
```typescript
button.onclick = function() {
  if (typeof window.postUIActionResult === 'function') {
    window.postUIActionResult({
      type: 'button-clicked',
      payload: { label: '${escapedLabel}' }
    });
  }
};
```

**After:**
```typescript
// Store label as data attribute for event handling
button.setAttribute('data-label', '${escapedLabel}');
```

### 2. `/apps/mcp-ui-poc-server/src/tools/shared-types.ts`

Updated button child element generation - removed onclick handler, added data-label attribute.

### 3. `/apps/mcp-ui-poc-client/src/components/nimbus-library.tsx`

**Added to component configuration:**
```typescript
{
  tagName: "nimbus-button",
  component: createWrappedComponent(Nimbus.Button, {
    // ...
    "data-label": "data-label",  // Added
  }),
  propMapping: {
    // ...
    "data-label": "data-label",  // Added
  },
  eventMapping: {
    press: "onPress",
  },
}
```

**Added to remote elements configuration:**
```typescript
{
  tagName: "nimbus-button",
  remoteAttributes: [
    // ...
    "data-label",  // Added
  ],
  remoteEvents: ["press"],
}
```

### 4. `/apps/mcp-ui-poc-client/src/components/chat-interface.tsx`

**Added event handling:**
```typescript
onUIAction={async (action: unknown) => {
  // ... validation ...

  const typedAction = action as Record<string, unknown>;
  console.log("🎬 UI Action received:", typedAction);

  // Handle Remote DOM events
  if (typedAction.type === "event") {
    console.log("🎯 Event:", typedAction.event, typedAction);

    // Handle button press events
    if (typedAction.event === "press") {
      const properties = typedAction.properties as Record<string, unknown> | undefined;
      const label = properties?.["data-label"] || "Unknown";
      console.log("🔘 Button pressed:", label);
      alert(`Button "${label}" was clicked!`);
    }
    return typedAction;
  }

  // Handle other action types...
}
```

---

## Benefits

### Before Fix
- ❌ Button clicks did nothing
- ❌ Events bypassed Remote DOM
- ❌ No communication between iframe and host
- ❌ Direct DOM handlers conflicted with Remote DOM

### After Fix
- ✅ Button clicks work correctly
- ✅ Events flow through Remote DOM's event system
- ✅ Proper bidirectional communication established
- ✅ Can capture and handle all button interactions
- ✅ Event data (button label) accessible in event handler
- ✅ Architecture supports adding more event types easily

---

## Adding More Event Types

To add support for other interactive elements:

### 1. Configure in Library

```typescript
{
  tagName: "nimbus-text-input",
  remoteAttributes: ["value", "placeholder", "data-field-name"],
  remoteEvents: ["change", "blur"],  // Listen for multiple events
}
```

### 2. Handle in Application

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

---

## Best Practices

1. **Store Event Metadata in Data Attributes**: Use `data-*` attributes to store information needed during event handling
2. **Let Remote DOM Handle Events**: Don't set onclick/onchange handlers directly - let Remote DOM intercept native events
3. **Use Semantic Event Names**: `press` for buttons, `change` for inputs, `submit` for forms
4. **Type Your Event Handlers**: Use TypeScript type guards to safely access event properties
5. **Log Events During Development**: Keep `console.log` statements to debug event flow
6. **Document Event Contracts**: Clearly specify what data each event type provides

---

## Debugging Event Issues

### Common Problems

**Problem: Events not reaching handler**
- ✓ Check `remoteEvents` is configured for element
- ✓ Check `eventMapping` maps to correct React prop
- ✓ Check `onUIAction` handler is attached to UIResourceRenderer
- ✓ Check browser console for Remote DOM errors

**Problem: Event data is undefined**
- ✓ Check attribute is in `remoteAttributes` array
- ✓ Check attribute is set in Remote DOM script
- ✓ Check property name matches in event handler

**Problem: Events fire but handler doesn't run**
- ✓ Check `if (typedAction.type === "event")` condition
- ✓ Check `if (typedAction.event === "eventName")` matches configured name
- ✓ Add logging to verify event structure

### Helpful Console Logs

```typescript
// Log everything to understand event structure
console.log("🎬 UI Action received:", typedAction);
console.log("🎯 Event:", typedAction.event, typedAction);
console.log("📦 Properties:", typedAction.properties);
```

This helps you understand exactly what Remote DOM is sending and debug any issues.
