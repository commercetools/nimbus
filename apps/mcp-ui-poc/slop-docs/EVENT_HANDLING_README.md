# Event Handling Documentation

Complete guide to event handling in the MCP-UI POC application.

## Overview

This **proof of concept** implements a custom event handling system to enable bidirectional communication between Remote DOM UI elements and the host React application. Due to limitations in the @mcp-ui/client library, we built a custom solution using React Context and prop mapping wrappers.

**Important**: This is a POC to demonstrate feasibility, not production-ready code. It validates the approach and can inform future production implementation decisions.

## Quick Start

### For Component Users

If you're using the MCP tools to create UI, here's what you need to know:

1. **Buttons support click events** through the `press` event
2. **Store metadata in data attributes** for event identification
3. **The host application handles events** and triggers actions

Example:
```javascript
const button = document.createElement('nimbus-button');
button.setAttribute('variant', 'solid');
button.setAttribute('data-label', 'View Details');
button.setAttribute('data-item-id', '12345');
button.textContent = 'View Details';
root.appendChild(button);
```

### For Component Developers

If you're adding new interactive components:

1. Configure component with `createWrappedComponent` and event mapping
2. Add `remoteEvents` to remote element configuration
3. Update event handler in `chat-interface.tsx`
4. Test with Playwright or browser DevTools

## Documentation Structure

### 1. [EVENT_HANDLING_IMPLEMENTATION.md](./EVENT_HANDLING_IMPLEMENTATION.md)

**Audience**: Developers implementing or maintaining the event system

**Contents**:
- Architecture overview and diagrams
- Detailed implementation of each component
- Step-by-step adding event support to new components
- Differences from standard Remote DOM
- Best practices and known limitations

**When to read**: When you need to understand how the system works internally or add support for new event types.

### 2. [COMPONENT_EVENT_REFERENCE.md](./COMPONENT_EVENT_REFERENCE.md)

**Audience**: Developers using event-enabled components

**Contents**:
- List of all components with event support
- Event types and mappings for each component
- Code examples for Remote DOM scripts
- Event handler examples
- Future component candidates

**When to read**: When you need to use an existing event-enabled component or see what's available.

### 3. [EVENT_TROUBLESHOOTING.md](./EVENT_TROUBLESHOOTING.md)

**Audience**: Developers debugging event issues

**Contents**:
- Quick diagnostic checklist
- Common issues and solutions
- Step-by-step debugging workflow
- Prevention checklist
- Common pitfalls

**When to read**: When events aren't working and you need to diagnose the problem.

### 4. [BIDIRECTIONAL_COMMUNICATION.md](./BIDIRECTIONAL_COMMUNICATION.md)

**Audience**: General overview audience

**Contents**:
- Original concept documentation
- High-level architecture
- Event flow diagrams
- Files modified during implementation

**When to read**: For historical context and understanding the original approach (note: some concepts are outdated, prefer EVENT_HANDLING_IMPLEMENTATION.md).

## Key Concepts

### The Problem

@mcp-ui/client defines `eventMapping` in its TypeScript interfaces but doesn't actually implement event forwarding. The library only supports these UI action types:

```typescript
type UIActionType = 'tool' | 'prompt' | 'link' | 'intent' | 'notify';
```

There's no built-in support for DOM events like `press`, `change`, or `focus`.

### The Solution

We implemented a custom event handling system with three main parts:

1. **React Context** - Provides event handler to wrapped components
2. **Prop Mapping Wrapper** - Attaches synthetic event handlers
3. **Event Handler** - Processes events in the host application

### Event Flow

```
User clicks button
    ↓
Browser native event
    ↓
Our synthetic event handler (from wrapper)
    ↓
Collects element attributes & props
    ↓
Calls onUIAction via Context
    ↓
Event handler in host app
    ↓
Action performed (alert, navigation, etc.)
```

## Currently Supported Events

| Component | Event Name | React Prop | Purpose |
|-----------|------------|------------|---------|
| Button | `press` | `onPress` | Handle button clicks |
| Alert.DismissButton | `press` | `onPress` | Handle dismiss action |

## Example Usage

### 1. Create Button with Event in MCP Tool

```typescript
// button.ts
function createButton(label: string, action: string) {
  return `
    const button = document.createElement('nimbus-button');
    button.setAttribute('variant', 'solid');
    button.setAttribute('color-palette', 'primary');
    button.setAttribute('data-label', '${label}');
    button.setAttribute('data-action', '${action}');
    button.textContent = '${label}';
    root.appendChild(button);
  `;
}
```

### 2. Handle Event in Application

```typescript
// chat-interface.tsx
const handleUIAction = async (action: unknown) => {
  const typedAction = action as Record<string, unknown>;

  if (typedAction.type === "event" && typedAction.event === "press") {
    const properties = typedAction.properties as Record<string, unknown>;
    const label = properties["data-label"];
    const actionType = properties["data-action"];

    console.log(`Button pressed: ${label} (action: ${actionType})`);

    // Perform action based on data-action attribute
    switch (actionType) {
      case "view-details":
        // Show details modal
        break;
      case "delete-item":
        // Confirm and delete
        break;
    }
  }
};
```

## Development Workflow

### Adding Event Support to a Component

1. **Update nimbus-library.tsx**:
```typescript
{
  tagName: "nimbus-your-component",
  component: createWrappedComponent(
    Nimbus.YourComponent,
    { /* prop mappings */ },
    { eventName: "onEventProp" }  // Add event mapping
  ),
  eventMapping: {
    eventName: "onEventProp",
  },
}
```

2. **Update remote element configuration**:
```typescript
{
  tagName: "nimbus-your-component",
  remoteEvents: ["eventName"],
}
```

3. **Add event handler**:
```typescript
if (typedAction.event === "eventName") {
  // Handle event
}
```

4. **Test with Playwright**:
```typescript
await page.click('[data-label="Your Label"]');
await expect(page.locator('role=alertdialog')).toBeVisible();
```

## Testing

### Manual Testing

1. Start the development servers:
```bash
pnpm start
```

2. Open browser DevTools console

3. Send a message that creates interactive UI

4. Click elements and watch for logs:
```
🎬 UI Action received: {...}
🎯 Event: press {...}
🔘 Button pressed: Label
```

### Automated Testing

Use Playwright for automated testing:

```typescript
import { test, expect } from '@playwright/test';

test('button press event', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Type message to create UI
  await page.fill('[aria-label="chat input"]', 'create button');
  await page.click('[aria-label="send message"]');

  // Wait for button to render
  await page.waitForSelector('[data-label="Button Label"]');

  // Click button
  await page.click('[data-label="Button Label"]');

  // Verify action occurred
  await expect(page.locator('role=alertdialog')).toBeVisible();
});
```

## Common Issues

### Events Not Firing

**Check**:
- Component uses `createWrappedComponent` with event mapping
- `UIActionProvider` wraps `UIResourceRenderer`
- Event handler checks for `type === "event"`

**See**: [EVENT_TROUBLESHOOTING.md](./EVENT_TROUBLESHOOTING.md#issue-1-button-click-does-nothing)

### Can't Identify Which Element Was Clicked

**Solution**: Add unique `data-*` attributes to elements

**See**: [EVENT_TROUBLESHOOTING.md](./EVENT_TROUBLESHOOTING.md#issue-7-multiple-buttons-cant-tell-which-was-clicked)

### TypeScript Errors

**Common cause**: Handler returning values instead of `void`

**See**: [EVENT_TROUBLESHOOTING.md](./EVENT_TROUBLESHOOTING.md#issue-5-typescript-errors-on-event-handler)

## Architecture Decisions

### Why Not Use Standard Remote DOM?

The @mcp-ui/client library doesn't implement the event forwarding specified in Remote DOM. We would need to either:

1. **Wait for library update** - Not feasible for POC timeline
2. **Fork and modify library** - Too much maintenance overhead
3. **Implement custom solution** - Chosen approach, minimal complexity

### Why React Context?

React Context provides clean dependency injection without prop drilling. It allows deeply nested components to access the event handler without passing it through every level.

### Why Store Data in Attributes?

Data attributes are:
- Accessible in event handlers via `event.target.attributes`
- Visible in browser DevTools for debugging
- Part of the DOM specification
- Simple to set in Remote DOM scripts

## Future Enhancements

### Planned

- [ ] Input change events (TextInput, NumberInput)
- [ ] Selection events (Select, ComboBox)
- [ ] Form submission events
- [ ] Focus/blur events

### Under Consideration

- [ ] Custom event data validation
- [ ] Event bubbling/capturing support
- [ ] Event handler middleware
- [ ] TypeScript types for event data

## Contributing

When adding event support:

1. Follow existing patterns in `nimbus-library.tsx`
2. Add comprehensive documentation
3. Include Playwright tests
4. Update all relevant documentation files
5. Add troubleshooting entries for common issues

## Related Code

### Key Files

- `apps/mcp-ui-poc-client/src/utils/prop-mapping-wrapper.tsx` - Event system implementation
- `apps/mcp-ui-poc-client/src/components/nimbus-library.tsx` - Component configurations
- `apps/mcp-ui-poc-client/src/components/chat-interface.tsx` - Event handler implementation
- `apps/mcp-ui-poc-server/src/tools/button.ts` - Button tool example
- `apps/mcp-ui-poc-server/src/tools/product-card.ts` - Product card with events

### Key Functions

- `createPropMappingWrapper()` - Creates event-enabled component wrapper
- `createWrappedComponent()` - Helper for configuring components
- `handleUIAction()` - Main event handler in chat interface

## Additional Resources

- [React Aria Documentation](https://react-spectrum.adobe.com/react-aria/) - For understanding `onPress` and other React Aria events
- [Remote DOM Specification](https://github.com/Shopify/remote-dom) - Original Remote DOM concept (for reference)
- [MCP-UI Client](https://github.com/modelcontextprotocol/mcp-ui) - Official MCP-UI library
- [Nimbus Design System](https://nimbus-documentation.vercel.app/) - Component documentation

## Getting Help

1. Check [EVENT_TROUBLESHOOTING.md](./EVENT_TROUBLESHOOTING.md) for common issues
2. Review [COMPONENT_EVENT_REFERENCE.md](./COMPONENT_EVENT_REFERENCE.md) for usage examples
3. Read [EVENT_HANDLING_IMPLEMENTATION.md](./EVENT_HANDLING_IMPLEMENTATION.md) for implementation details
4. Look at existing working examples (Button, Alert.DismissButton)
5. Use browser DevTools to inspect elements and events

## Changelog

### 2024-01-XX - Initial Implementation

- Implemented custom event handling system
- Added support for button press events
- Created comprehensive documentation
- Fixed Alert.DismissButton event configuration
- Added Playwright testing examples

---

**Last Updated**: January 2024

**Maintainers**: MCP-UI POC Team
