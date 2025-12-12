# PropMapping Fix for MCP-UI Remote DOM

## Problem Description

The MCP-UI POC application was not applying props specified in `setAttribute` calls in the server-side templates to the rendered React components on the client.

### Root Cause

The `@mcp-ui/client` library's component wrapper function (`_t`) was not utilizing the `propMapping` configuration from the `ComponentLibrary`.

When wrapping components, the library:
1. Takes attributes and properties from the remote DOM element
2. Spreads them directly onto the React component **without transformation**
3. Ignores the `propMapping` field in the component library configuration

This means kebab-case attributes like `color-palette` were being passed directly to React components instead of being converted to camelCase props like `colorPalette`.

### Evidence

In the `@mcp-ui/client` bundle (`index.mjs`), the `pt` function creates props:

```javascript
function pt(r, e) {
  const {
    children: t,
    properties: n,
    attributes: s,
    eventListeners: o
  } = r;
  const u = {
    ...n,    // properties spread as-is
    ...s,    // attributes spread as-is (NOT MAPPED!)
    children: a
  };
  // ... event handling
  return u;
}
```

The wrapper creation code:

```javascript
p.elements.forEach((E) => {
  const _ = _t(E.component);  // Only component passed, no propMapping!
  h.set(E.tagName, _);
});
```

## Solution

Created a custom prop mapping wrapper that transforms attribute names before passing them to React components.

### Implementation

1. **Created `prop-mapping-wrapper.tsx`**: A utility that wraps React components and applies the prop mapping transformation

```typescript
export function createPropMappingWrapper<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  propMapping: Record<string, string>
): React.ComponentType<Record<string, unknown>> {
  const WrapperComponent = (props: Record<string, unknown>) => {
    const mappedProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
      const mappedKey = propMapping[key];
      if (mappedKey) {
        mappedProps[mappedKey] = value;  // Transform key
      } else {
        mappedProps[key] = value;  // Keep original
      }
    }

    return React.createElement(Component, mappedProps as P);
  };

  return WrapperComponent;
}
```

2. **Updated `nimbus-library.tsx`**: Wrapped all components that have `propMapping` configurations

```typescript
{
  tagName: "nimbus-badge",
  component: createWrappedComponent(
    Nimbus.Badge,
    {
      "color-palette": "colorPalette",
      "margin-bottom": "marginBottom",
      width: "width",
    }
  ),
  propMapping: { /* ... */ },
}
```

## How It Works

1. **Server-side** (in `product-card.ts`):
   ```javascript
   badge.setAttribute('color-palette', 'positive');
   ```

2. **Remote DOM transmission**: Attribute `color-palette: "positive"` is sent to client

3. **Client-side wrapper**: `createPropMappingWrapper` intercepts the props:
   - Receives: `{ "color-palette": "positive", ... }`
   - Maps using: `{ "color-palette": "colorPalette" }`
   - Outputs: `{ colorPalette: "positive", ... }`

4. **React component**: `<Nimbus.Badge colorPalette="positive" />` renders correctly

## Testing

To verify the fix:

1. Start the MCP-UI server: `pnpm dev` (in `apps/mcp-ui-poc-server`)
2. Start the client: `pnpm dev` (in `apps/mcp-ui-poc-client`)
3. Use Claude to call the `createProductCard` tool
4. Verify that props like `colorPalette`, `isDisabled`, etc. are applied correctly

### Example Test

Ask Claude:
```
Create a product card for "Wireless Headphones" priced at "$99.99" that is in stock
```

The badge should render with `colorPalette="positive"` (green) and the button should be enabled.

Then ask:
```
Create a product card for "Gaming Mouse" priced at "$149.99" that is out of stock
```

The badge should render with `colorPalette="critical"` (red) and the button should be disabled.

## Alternative Approaches Considered

1. **Fork `@mcp-ui/client`**: Would require maintaining a fork
2. **Use web components directly**: Would lose React benefits
3. **Patch node_modules**: Would be lost on reinstall
4. **Use patch-package**: Adds complexity to the build process

The wrapper approach is clean, maintainable, and doesn't require modifying external dependencies.

## Related Documentation

- Remote DOM: https://github.com/Shopify/remote-dom
- Remote DOM React: https://github.com/Shopify/remote-dom/tree/main/packages/react
- MCP-UI Client: https://www.npmjs.com/package/@mcp-ui/client

## Files Modified

1. `apps/mcp-ui-poc-client/src/utils/prop-mapping-wrapper.tsx` (new file)
2. `apps/mcp-ui-poc-client/src/components/nimbus-library.tsx` (updated)
