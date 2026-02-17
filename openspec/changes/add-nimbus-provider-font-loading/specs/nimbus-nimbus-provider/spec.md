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
The component SHALL leverage React 19's automatic deduplication for font links.

#### Scenario: Multiple provider instances
- **WHEN** multiple NimbusProvider instances exist on same page with loadFonts enabled
- **THEN** React SHALL automatically deduplicate identical link tags
- **AND** SHALL result in single set of font links in document head
- **AND** deduplication SHALL be handled by React framework
- **AND** all providers SHALL share same font resources

#### Scenario: Automatic deduplication
- **WHEN** provider remounts or re-renders
- **THEN** React SHALL compare link props and deduplicate automatically
- **AND** SHALL not require manual existence checks
- **AND** font loading SHALL remain consistent across render cycles

### Requirement: SSR Compatibility
The component SHALL support server-side rendering without errors.

#### Scenario: Server-side rendering
- **WHEN** component renders on server
- **THEN** React SHALL handle link tag rendering for SSR automatically
- **AND** SHALL serialize links appropriately for server output
- **AND** SHALL not throw errors during server rendering
- **AND** font links SHALL be included in SSR HTML output

#### Scenario: Client-side hydration
- **WHEN** component hydrates on client after SSR
- **THEN** React SHALL hydrate links without mismatch warnings
- **AND** SHALL maintain consistency between server and client
- **AND** fonts SHALL be available immediately after hydration
- **AND** fallback fonts SHALL display during font download

### Requirement: Font Loading Cleanup
The component SHALL rely on React to manage link tag lifecycle.

#### Scenario: Provider unmount
- **WHEN** NimbusProvider unmounts
- **THEN** React SHALL remove associated link tags from document head
- **AND** SHALL handle cleanup automatically without manual intervention
- **AND** SHALL prevent memory leaks from orphaned DOM nodes
- **AND** cleanup SHALL not affect fonts cached by browser

#### Scenario: Hot module replacement
- **WHEN** component reloads during development
- **THEN** React SHALL manage link tag lifecycle across reloads
- **AND** SHALL remove old links and add new ones as needed
- **AND** SHALL maintain clean DOM state across reloads

### Requirement: Font Loading Component
The component SHALL use React 19 link hoisting for font loading.

#### Scenario: InterFontLoader component rendering
- **WHEN** NimbusProvider renders with loadFonts enabled
- **THEN** SHALL render InterFontLoader component
- **AND** component SHALL render link tags declaratively
- **AND** React SHALL automatically hoist links to document head
- **AND** component SHALL be internal implementation detail

#### Scenario: React 19 automatic hoisting
- **WHEN** InterFontLoader renders link tags
- **THEN** React SHALL automatically move links to document head
- **AND** SHALL handle SSR vs client rendering automatically
- **AND** SHALL deduplicate identical links automatically
- **AND** SHALL remove links when component unmounts

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
