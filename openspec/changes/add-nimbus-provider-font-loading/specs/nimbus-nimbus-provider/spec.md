# Specification Delta: NimbusProvider Font Loading

## ADDED Requirements

### Requirement: Inter Font Loading
The component SHALL load Inter font family by default for consistent typography.

#### Scenario: Default font loading enabled
- **WHEN** NimbusProvider renders without explicit loadFonts prop
- **THEN** SHALL inject Google Fonts preconnect links into document head
- **AND** SHALL inject Inter font stylesheet from Google Fonts CSS API v2
- **AND** SHALL use fonts.googleapis.com and fonts.gstatic.com origins
- **AND** fonts SHALL load in background without blocking render

#### Scenario: Font loading disabled
- **WHEN** loadFonts prop is set to false
- **THEN** SHALL NOT inject any font-related links
- **AND** SHALL rely on host application to provide Inter font
- **AND** SHALL fall back to system fonts if Inter unavailable

### Requirement: Google Fonts Integration
The component SHALL use Google Fonts CSS API v2 for font delivery.

#### Scenario: Preconnect optimization
- **WHEN** font loading is enabled
- **THEN** SHALL inject preconnect link for fonts.googleapis.com
- **AND** SHALL inject preconnect link for fonts.gstatic.com with crossorigin attribute
- **AND** preconnect links SHALL appear before stylesheet link in document head
- **AND** SHALL optimize DNS resolution and TLS handshake

#### Scenario: Stylesheet injection
- **WHEN** font loading is enabled
- **THEN** SHALL inject stylesheet link for Inter font from Google Fonts
- **AND** stylesheet URL SHALL use CSS API v2 format
- **AND** SHALL include explicit font weights: 100, 200, 300, 400, 500, 600, 700, 800, 900
- **AND** SHALL use display=swap parameter to minimize FOUT
- **AND** link element SHALL include data-nimbus-fonts attribute for identification

#### Scenario: Static font weight loading
- **WHEN** fonts load from Google Fonts
- **THEN** SHALL load specific static font weights matching Nimbus design tokens
- **AND** SHALL load all 9 weights (100, 200, 300, 400, 500, 600, 700, 800, 900)
- **AND** SHALL use explicit weight syntax for precise control over loaded fonts
- **AND** browser SHALL receive optimized font format based on capabilities

### Requirement: Font Deduplication
The component SHALL prevent duplicate font loading across multiple provider instances.

#### Scenario: Multiple provider instances
- **WHEN** multiple NimbusProvider instances exist on same page
- **THEN** SHALL check for existing [data-nimbus-fonts] attribute before injection
- **AND** SHALL only inject fonts once per document
- **AND** subsequent providers SHALL skip font injection
- **AND** all providers SHALL share same font resources

#### Scenario: Idempotent font loading
- **WHEN** provider remounts or re-renders
- **THEN** SHALL not inject duplicate font links
- **AND** SHALL verify existence before every injection attempt
- **AND** font loading SHALL remain consistent across render cycles

### Requirement: SSR Compatibility
The component SHALL support server-side rendering without errors.

#### Scenario: Server-side rendering
- **WHEN** component renders on server
- **THEN** SHALL detect server environment (typeof document === 'undefined')
- **AND** SHALL skip font injection during SSR
- **AND** SHALL not throw errors about missing document object
- **AND** server output SHALL not include font links

#### Scenario: Client-side hydration
- **WHEN** component hydrates on client after SSR
- **THEN** SHALL inject fonts during first client-side effect
- **AND** SHALL not cause hydration mismatch warnings
- **AND** fonts SHALL load after initial page render
- **AND** fallback fonts SHALL display during font download

### Requirement: Font Loading Cleanup
The component SHALL clean up injected font resources on unmount.

#### Scenario: Provider unmount
- **WHEN** NimbusProvider unmounts
- **THEN** SHALL remove injected preconnect links from document head
- **AND** SHALL remove injected stylesheet link from document head
- **AND** SHALL prevent memory leaks from orphaned DOM nodes
- **AND** cleanup SHALL not affect fonts cached by browser

#### Scenario: Hot module replacement
- **WHEN** component reloads during development
- **THEN** cleanup SHALL remove old font links
- **AND** new mount SHALL inject fresh font links
- **AND** SHALL maintain clean DOM state across reloads

### Requirement: Font Loading Hook
The component SHALL use dedicated hook for font loading logic.

#### Scenario: useFontLoader hook integration
- **WHEN** NimbusProvider renders with loadFonts enabled
- **THEN** SHALL call useFontLoader hook with enabled parameter
- **AND** hook SHALL handle all font injection logic
- **AND** hook SHALL return cleanup function for unmount
- **AND** hook SHALL be located in hooks/ directory

#### Scenario: Hook testability
- **WHEN** testing font loading behavior
- **THEN** hook SHALL be independently testable
- **AND** SHALL accept enabled boolean parameter
- **AND** SHALL allow mocking of document.head operations
- **AND** test isolation SHALL be straightforward

### Requirement: loadFonts Prop
The component SHALL accept loadFonts prop for font loading control.

#### Scenario: Prop type definition
- **WHEN** component props are typed
- **THEN** loadFonts SHALL be optional boolean type
- **AND** SHALL default to true when not provided
- **AND** SHALL have JSDoc: "Load Inter font from Google Fonts. Set to false if fonts are loaded by host application."
- **AND** SHALL be exported in NimbusProviderProps interface

#### Scenario: Prop forwarding
- **WHEN** loadFonts prop is provided
- **THEN** SHALL forward to useFontLoader hook
- **AND** hook SHALL respect prop value for font injection
- **AND** prop changes SHALL trigger font loading/cleanup cycle

### Requirement: Font Fallback Support
The component SHALL ensure graceful fallback when fonts fail to load.

#### Scenario: Google Fonts unavailable
- **WHEN** Google Fonts service is unavailable
- **THEN** SHALL fall back to design token font stack
- **AND** SHALL use system fonts: -apple-system, BlinkMacSystemFont, sans-serif
- **AND** application SHALL remain functional without Inter
- **AND** no JavaScript errors SHALL be thrown

#### Scenario: Network failure
- **WHEN** font stylesheet fails to download
- **THEN** browser SHALL use fallback fonts immediately (display=swap)
- **AND** application SHALL render with system fonts
- **AND** layout SHALL remain stable with fallback fonts
- **AND** no blocking or hanging states SHALL occur

### Requirement: Font Loading Performance
The component SHALL optimize font loading for performance.

#### Scenario: Non-blocking font load
- **WHEN** fonts are loading
- **THEN** SHALL not block initial page render
- **AND** content SHALL appear with fallback fonts immediately
- **AND** display=swap parameter SHALL enable instant text rendering
- **AND** fonts SHALL swap in when loaded without layout shift

#### Scenario: Preconnect performance
- **WHEN** preconnect links are injected
- **THEN** SHALL establish early connection to font origins
- **AND** SHALL reduce DNS lookup and TLS handshake latency
- **AND** font download SHALL start faster than without preconnect
- **AND** perceived loading time SHALL improve

### Requirement: Font Loading Documentation
The component SHALL document font loading behavior in JSDoc and guides.

#### Scenario: JSDoc documentation
- **WHEN** loadFonts prop is documented
- **THEN** SHALL include description of default behavior
- **AND** SHALL explain when to set to false (e.g., Merchant Center)
- **AND** SHALL mention Google Fonts dependency
- **AND** SHALL note fallback behavior

#### Scenario: Migration documentation
- **WHEN** existing applications upgrade
- **THEN** documentation SHALL explain opt-out for apps with existing font loading
- **AND** SHALL provide Merchant Center migration example
- **AND** SHALL clarify no changes needed for standalone usage
- **AND** SHALL document testing recommendations
