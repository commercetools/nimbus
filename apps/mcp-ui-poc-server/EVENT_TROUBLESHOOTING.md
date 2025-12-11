# Event Handling Troubleshooting Guide

Quick reference for diagnosing and fixing event handling issues in the MCP-UI POC.

## Quick Diagnostic Checklist

When events aren't working, check these items in order:

- [ ] Component configured with `createWrappedComponent` with event mapping
- [ ] `remoteEvents` array includes the event name
- [ ] `UIActionProvider` wraps the `UIResourceRenderer`
- [ ] Event handler checks for `type === "event"`
- [ ] Data attributes set in Remote DOM script
- [ ] Console logs showing event flow

## Common Issues and Solutions

### Issue 1: Button Click Does Nothing

**Symptoms**:
- Button renders correctly
- Click produces no console logs
- No alert or action happens

**Diagnosis**:
```typescript
// Check 1: Is the component wrapped?
// In nimbus-library.tsx, look for:
component: createWrappedComponent(
  Nimbus.Button,
  { /* props */ },
  { press: "onPress" }  // ✅ Event mapping present
)

// ❌ BAD - Not wrapped:
component: Nimbus.Button
```

**Fix**:
```typescript
// Add event mapping to wrapper
component: createWrappedComponent(
  Nimbus.Button,
  propMapping,
  { press: "onPress" }  // Add this parameter
)
```

### Issue 2: Console Shows No Event Logs

**Symptoms**:
- No "🎬 UI Action received" log
- No "🎯 Event:" log

**Diagnosis**:
```typescript
// Check 1: Is UIActionProvider wrapping the renderer?
// In chat-interface.tsx:

// ❌ BAD - Missing provider
<UIResourceRenderer
  resource={resource.resource}
  onUIAction={handleUIAction}
/>

// ✅ GOOD - Provider present
<UIActionProvider value={handleUIAction}>
  <UIResourceRenderer
    resource={resource.resource}
    onUIAction={handleUIAction}
  />
</UIActionProvider>
```

**Fix**: Wrap `UIResourceRenderer` with `UIActionProvider`

### Issue 3: Event Handler Not Called

**Symptoms**:
- Logs show "🎬 UI Action received"
- But no "🎯 Event:" or component-specific logs

**Diagnosis**:
```typescript
// Check: Event type handling in chat-interface.tsx

// ❌ BAD - Missing event handling
const handleUIAction = async (action: unknown) => {
  const typedAction = action as Record<string, unknown>;

  // Only handles tool, notify, etc.
  switch (typedAction.type) {
    case "tool": // ...
    case "notify": // ...
  }
};

// ✅ GOOD - Handles events
const handleUIAction = async (action: unknown) => {
  const typedAction = action as Record<string, unknown>;

  // Add this before the switch
  if (typedAction.type === "event") {
    console.log("🎯 Event:", typedAction.event);

    if (typedAction.event === "press") {
      // Handle press event
    }
    return;
  }

  switch (typedAction.type) { /* ... */ }
};
```

**Fix**: Add `type === "event"` handling before the switch statement

### Issue 4: Event Data Missing or Undefined

**Symptoms**:
- Event fires successfully
- `properties["data-label"]` is `undefined`

**Diagnosis**:
```javascript
// Check: Remote DOM script sets data attributes

// ❌ BAD - No data attributes
const button = document.createElement('nimbus-button');
button.textContent = 'Click me';
root.appendChild(button);

// ✅ GOOD - Data attribute set
const button = document.createElement('nimbus-button');
button.setAttribute('data-label', 'Click me');
button.textContent = 'Click me';
root.appendChild(button);
```

**Fix**: Set `data-*` attributes in the Remote DOM script

### Issue 5: TypeScript Errors on Event Handler

**Symptoms**:
- Build fails with type errors
- `Type 'X' is not assignable to type 'void | Promise<void>'`

**Diagnosis**:
```typescript
// ❌ BAD - Returning values
const handleUIAction = async (action: unknown) => {
  if (typedAction.type === "event") {
    return typedAction;  // ❌ Returns value
  }
  return action;  // ❌ Returns value
};

// ✅ GOOD - Returns void
const handleUIAction = async (action: unknown) => {
  if (typedAction.type === "event") {
    // Handle event
    return;  // ✅ Returns void
  }
  // No return at end
};
```

**Fix**: Remove return statements or change to `return;`

### Issue 6: Wrong Event Name in Handler

**Symptoms**:
- Logs show event type correctly
- But handler switch case doesn't match

**Diagnosis**:
```typescript
// Check: Event name matches configuration

// In nimbus-library.tsx:
eventMapping: {
  press: "onPress"  // Event name is "press"
}

// In chat-interface.tsx:
// ❌ BAD - Wrong event name
if (typedAction.event === "click") { /* ... */ }

// ✅ GOOD - Matching event name
if (typedAction.event === "press") { /* ... */ }
```

**Fix**: Use the same event name from `eventMapping` configuration

### Issue 7: Multiple Buttons, Can't Tell Which Was Clicked

**Symptoms**:
- All buttons trigger same action
- Can't differentiate which button was pressed

**Diagnosis**:
```javascript
// ❌ BAD - No unique identifiers
const button1 = document.createElement('nimbus-button');
button1.textContent = 'Button 1';

const button2 = document.createElement('nimbus-button');
button2.textContent = 'Button 2';

// ✅ GOOD - Unique data attributes
const button1 = document.createElement('nimbus-button');
button1.setAttribute('data-label', 'Button 1');
button1.setAttribute('data-action', 'action-1');
button1.textContent = 'Button 1';

const button2 = document.createElement('nimbus-button');
button2.setAttribute('data-label', 'Button 2');
button2.setAttribute('data-action', 'action-2');
button2.textContent = 'Button 2';
```

**Fix**: Add unique `data-*` attributes to differentiate elements

### Issue 8: Event Fires Multiple Times

**Symptoms**:
- Single click triggers multiple alerts/actions
- Console shows duplicate event logs

**Diagnosis**:
This can happen if:
1. Multiple `UIActionProvider` instances wrap the same content
2. Event handler is attached multiple times
3. Component re-renders and re-attaches handlers

**Fix**:
```typescript
// Ensure single UIActionProvider per UIResourceRenderer
<UIActionProvider value={handleUIAction}>
  <UIResourceRenderer
    resource={resource.resource}
    onUIAction={handleUIAction}
  />
</UIActionProvider>

// Don't nest multiple providers:
// ❌ BAD
<UIActionProvider value={handler1}>
  <UIActionProvider value={handler2}>
    <UIResourceRenderer />
  </UIActionProvider>
</UIActionProvider>
```

## Debugging Workflow

### Step 1: Add Debug Logging

Add these logs to trace event flow:

```typescript
const handleUIAction = async (action: unknown) => {
  console.log("🔍 handleUIAction called with:", action);

  if (!action || typeof action !== "object" || Array.isArray(action)) {
    console.log("⚠️ Invalid action format");
    return;
  }

  const typedAction = action as Record<string, unknown>;
  console.log("🎬 UI Action type:", typedAction.type);

  if (typedAction.type === "event") {
    console.log("🎯 Event name:", typedAction.event);
    console.log("📦 Event properties:", typedAction.properties);

    if (typedAction.event === "press") {
      const properties = typedAction.properties as Record<string, unknown> | undefined;
      const label = properties?.["data-label"];
      console.log("🔘 Button label:", label);
    }
  }
};
```

### Step 2: Verify Component Configuration

Check `nimbus-library.tsx`:

```bash
# Search for your component
grep -A 20 "nimbus-your-component" apps/mcp-ui-poc-client/src/components/nimbus-library.tsx
```

Verify:
- Uses `createWrappedComponent`
- Has event mapping as third parameter
- `eventMapping` object includes your event

### Step 3: Check Remote DOM Script

In your tool file, verify:

```javascript
// 1. Element created
const element = document.createElement('nimbus-your-component');

// 2. Attributes set
element.setAttribute('data-identifier', 'value');

// 3. Element appended
root.appendChild(element);
```

### Step 4: Test in Browser Console

Open browser DevTools and test:

```javascript
// Find the element
const button = document.querySelector('button[data-label="Your Label"]');

// Check attributes
console.log([...button.attributes].map(a => ({ name: a.name, value: a.value })));

// Manually trigger click
button.click();
```

### Step 5: Check React DevTools

1. Install React DevTools extension
2. Find `UIResourceRenderer` component
3. Check props include `onUIAction`
4. Find `UIActionProvider` in tree
5. Verify `value` prop is the handler function

## Prevention Checklist

When adding a new interactive component:

- [ ] Add component with `createWrappedComponent` in `nimbus-library.tsx`
- [ ] Include event mapping as third parameter
- [ ] Add `remoteEvents` to corresponding remote element config
- [ ] Update `handleUIAction` with event handling logic
- [ ] Set data attributes in Remote DOM script
- [ ] Test with browser DevTools before committing
- [ ] Add console logs for debugging
- [ ] Document in `COMPONENT_EVENT_REFERENCE.md`

## Common Pitfalls

### 1. Forgetting the Third Parameter

```typescript
// ❌ WRONG - Only two parameters
createWrappedComponent(Component, propMapping)

// ✅ RIGHT - Three parameters
createWrappedComponent(Component, propMapping, eventMapping)
```

### 2. Wrong Event Property Name

```typescript
// React Aria uses onPress, not onClick
// ❌ WRONG
{ press: "onClick" }

// ✅ RIGHT
{ press: "onPress" }
```

### 3. Not Wrapping with Provider

```typescript
// ❌ WRONG - Missing provider
<UIResourceRenderer onUIAction={handler} />

// ✅ RIGHT - Wrapped with provider
<UIActionProvider value={handler}>
  <UIResourceRenderer onUIAction={handler} />
</UIActionProvider>
```

### 4. Returning Values from Handler

```typescript
// ❌ WRONG - Handler returns value
const handler = (action: unknown) => {
  return action;  // Type error!
};

// ✅ RIGHT - Handler returns void
const handler = (action: unknown) => {
  // Handle action
  return;  // or no return
};
```

## Getting Help

If issues persist after following this guide:

1. **Check the logs**: Look for errors in browser console
2. **Review the docs**: See `EVENT_HANDLING_IMPLEMENTATION.md`
3. **Compare working examples**: Check the Button implementation
4. **Use Playwright**: Test interactions programmatically
5. **Check git history**: See how event handling was added to other components

## Related Documentation

- [EVENT_HANDLING_IMPLEMENTATION.md](./EVENT_HANDLING_IMPLEMENTATION.md) - Implementation details
- [COMPONENT_EVENT_REFERENCE.md](./COMPONENT_EVENT_REFERENCE.md) - Component-specific guide
- [BIDIRECTIONAL_COMMUNICATION.md](./BIDIRECTIONAL_COMMUNICATION.md) - Architecture overview
