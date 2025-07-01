# Router Configuration for NimbusProvider

## Overview

The NimbusProvider has been extended with router configuration capabilities that
enable seamless client-side navigation for all Nimbus components that support
links (Button with href, Link, etc.). This integration leverages react-aria's
RouterProvider to provide consistent routing behavior across the component
library.

## Design Decisions & Rationale

### 1. **API Consistency**

- **Decision**: Use the same interface as react-aria's RouterProvider
  (`{navigate, useHref?}`)
- **Rationale**: Maintains consistency with the underlying react-aria ecosystem,
  making it familiar to developers already using react-aria components directly
- **Benefits**: No cognitive overhead for teams already familiar with react-aria
  patterns

### 2. **Framework Agnostic**

- **Decision**: Accept any router implementation that provides a navigate
  function
- **Rationale**: Different projects use different routers (React Router,
  Next.js, TanStack Router, custom solutions)
- **Benefits**: Works with any router without vendor lock-in

### 3. **Optional Integration**

- **Decision**: Make router configuration completely optional
- **Rationale**: Maintains backward compatibility and allows gradual adoption
- **Benefits**: Existing code continues to work unchanged; teams can opt-in when
  ready

### 4. **Provider-Level Configuration**

- **Decision**: Configure routing at the provider level rather than
  per-component
- **Rationale**: Centralized configuration reduces boilerplate and ensures
  consistency
- **Benefits**: Single configuration point affects all components; no need to
  pass router props to individual components

### 5. **TypeScript Enhancement**

- **Decision**: Support module augmentation for router-specific type safety
- **Rationale**: Different routers have different option types for navigation
- **Benefits**: Compile-time type checking for router-specific options

## Technical Implementation

### Core Architecture

```typescript
// 1. Router configuration interface
interface NimbusRouterConfig {
  navigate: (href: string, routerOptions?: any) => void;
  useHref?: (href: string) => string;
}

// 2. Provider integration
function NimbusProvider({ router, children, ...props }) {
  const content = (
    <ChakraProvider>
      <ColorModeProvider>
        <I18nProvider>{children}</I18nProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );

  // Conditionally wrap with RouterProvider when router config is provided
  if (router) {
    return <RouterProvider {...router}>{content}</RouterProvider>;
  }

  return content;
}
```

### Type Safety Enhancement

The implementation includes a sophisticated type system that allows
framework-specific type augmentation:

```typescript
// Consumers can augment types for their specific router
declare module "@commercetools/nimbus" {
  interface NimbusRouterConfig {
    routerOptions?: NavigateOptions; // Router-specific options
  }
}
```

## Usage Patterns

### React Router Integration

```typescript
import { useNavigate, useHref } from 'react-router-dom';
import { NimbusProvider } from '@commercetools/nimbus';

function App() {
  const navigate = useNavigate();

  return (
    <NimbusProvider router={{ navigate, useHref }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </NimbusProvider>
  );
}
```

### Next.js App Router Integration

```typescript
'use client';
import { useRouter } from 'next/navigation';
import { NimbusProvider } from '@commercetools/nimbus';

export function ClientProviders({ children }) {
  const router = useRouter();

  return (
    <NimbusProvider router={{ navigate: router.push }}>
      {children}
    </NimbusProvider>
  );
}
```

### Custom Router Integration

```typescript
function CustomApp() {
  const handleNavigate = (href: string) => {
    // Custom navigation logic
    window.history.pushState(null, '', href);
    // Update app state, trigger re-render, etc.
  };

  return (
    <NimbusProvider router={{ navigate: handleNavigate }}>
      <App />
    </NimbusProvider>
  );
}
```

## Benefits

### 1. **Automatic Integration**

Once configured, ALL Nimbus components with href props automatically use
client-side routing:

- `<Button href="/page">` becomes client-side navigation
- `<Link href="/page">` becomes client-side navigation
- External links (`href="https://..."`) continue to use normal navigation

### 2. **Progressive Enhancement**

- Components work with or without router configuration
- External links and special cases (target="\_blank", download, etc.)
  automatically fall back to browser navigation
- No changes needed to existing component usage

### 3. **Developer Experience**

- Single configuration point
- TypeScript support with framework-specific types
- Consistent behavior across all components
- No additional props needed on individual components

### 4. **Performance**

- Client-side navigation avoids full page reloads
- Maintains React state between route transitions
- Leverages router-specific optimizations (prefetching, etc.)

## Migration Guide

### Existing Apps (No Router)

No changes needed. Components continue to work with standard browser navigation.

### Apps Adding Router Support

1. Install your preferred router
2. Add router configuration to NimbusProvider
3. All existing Nimbus components automatically gain client-side routing

```typescript
// Before
<NimbusProvider>
  <App />
</NimbusProvider>

// After
<NimbusProvider router={{ navigate: yourNavigateFunction }}>
  <App />
</NimbusProvider>
```

## Security Considerations

- External URLs automatically use browser navigation (no router.navigate call)
- Links with special attributes (target, download) use browser navigation
- Router options are properly typed to prevent injection attacks
- Integration respects react-aria's built-in security patterns

## Future Extensibility

The design supports future enhancements:

- Additional router configuration options
- Router-specific optimizations
- Enhanced type safety features
- Integration with additional router frameworks

## Testing Strategy

Components can be tested with or without router configuration:

```typescript
// Test without router (browser navigation)
render(
  <NimbusProvider>
    <Button href="/test">Test</Button>
  </NimbusProvider>
);

// Test with mock router
const mockNavigate = jest.fn();
render(
  <NimbusProvider router={{ navigate: mockNavigate }}>
    <Button href="/test">Test</Button>
  </NimbusProvider>
);
```

## Conclusion

This implementation provides a robust, flexible, and type-safe router
integration that enhances the Nimbus component library without compromising
existing functionality. The design prioritizes developer experience, type
safety, and framework flexibility while maintaining the high standards of
accessibility and usability that define the Nimbus library.
