# Design: Inter Font Loading

## Context

Nimbus defines Inter as its primary font family in design tokens (`packages/tokens/src/base/tokens.json`), but provides no mechanism to load it. This works in Merchant Center because app-kit loads Inter via preconnect links in `application.html`, following [ADR 54: Loading fonts from Google Fonts CSS API v2](https://github.com/commercetools/merchant-center-application-kit/blob/main/website/content/adr/0054-load-fonts-from-google-fonts-css-api-v2.md).

However, standalone Nimbus usage (Custom Applications, Storybook, documentation site, consumer apps) falls back to system fonts, breaking visual consistency.

### Constraints

- Must use **Google Fonts CSS API v2** (Merchant Center's established approach)
- Must support **variable fonts** (Inter supports weight variations)
- Must avoid **duplicate loading** when fonts already exist (Merchant Center context)
- Must be **SSR-compatible** (Next.js, Remix, etc.)
- Must handle **multiple NimbusProvider instances** gracefully
- Should minimize **FOUT** (Flash of Unstyled Text) and **FOIT** (Flash of Invisible Text)

### Stakeholders

- **Nimbus consumers**: Need fonts to work out-of-the-box
- **Merchant Center**: Already loads fonts, needs opt-out to avoid duplicates
- **Custom Applications**: Standalone usage, needs automatic font loading

## Goals / Non-Goals

### Goals

- Provide Inter font loading by default in `NimbusProvider`
- Match Merchant Center's font loading approach (Google Fonts API v2 with preconnect)
- Support opt-out for contexts with existing font loading
- Ensure SSR compatibility and proper cleanup
- Handle multiple provider instances without duplicate link injection

### Non-Goals

- Self-hosting fonts (ruled out per MC ADR 54 - adds complexity, no significant benefit for Custom Apps)
- Auto-detecting font availability (unreliable, race conditions, complex)
- Loading fonts outside of `NimbusProvider` (separate package, utility function)
- Supporting custom font families (Inter is Nimbus's standard)

## Decisions

### Decision 1: Opt-Out Pattern (Default Enabled)

**Choice**: `loadFonts` prop defaults to `true`

**Rationale**:
- **Better DX**: Standalone apps work immediately without configuration
- **Principle of least surprise**: Fonts "just work" by default
- **Simpler migration**: MC adds one prop (`loadFonts={false}`) vs all consumers remembering to enable
- **Consistent with provider patterns**: Providers typically enable features by default (color mode, i18n, etc.)

**Alternatives Considered**:
1. **Opt-in (`loadFonts={true}` required)**: Worse DX, easy to forget, breaks standalone usage
2. **Auto-detect font availability**: Fragile, race conditions, unreliable `document.fonts` API
3. **Always load (no flag)**: No escape hatch for MC, causes duplicate network requests
4. **Separate package**: Extra setup burden, multiple imports, over-engineering

### Decision 2: Google Fonts API v2 with Preconnect

**Choice**: Inject preconnect links + stylesheet link dynamically via `useEffect`

**Rationale**:
- **Consistency**: Matches MC's approach exactly (ADR 54)
- **Performance**: Preconnect optimizes DNS/TLS handshake before font download
- **Variable fonts**: API v2 supports Inter's variable font format
- **Browser optimization**: Google serves optimal font variants per browser
- **Zero maintenance**: Google handles browser compatibility and optimization

**Implementation**:
```typescript
// Inject these links into document.head:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
  data-nimbus-fonts
/>
```

**Font Weights**: Load 400, 500, 600, 700 (weights used in Nimbus design tokens)
**Display Strategy**: `display=swap` minimizes FOUT by showing fallback immediately, swapping when Inter loads

### Decision 3: Custom Hook for Font Loading

**Choice**: Extract logic into `use-font-loader.ts` hook

**Rationale**:
- **Separation of concerns**: Provider orchestrates, hook handles font logic
- **Testability**: Hook can be unit tested independently
- **Reusability**: Could be used outside provider if needed in future
- **Follows Nimbus patterns**: Hooks in `hooks/` folder, not component files

**Hook Signature**:
```typescript
function useFontLoader(enabled: boolean): void
```

### Decision 4: Deduplication Strategy

**Choice**: Check for `[data-nimbus-fonts]` attribute before injecting

**Rationale**:
- **Multiple provider instances**: Apps might nest providers for different locales
- **Prevents duplicate network requests**: Only inject once per page
- **Simple implementation**: Single `querySelector` check
- **Idempotent**: Safe to call multiple times

**Implementation**:
```typescript
if (document.querySelector('[data-nimbus-fonts]')) {
  return; // Already loaded
}
```

### Decision 5: Cleanup on Unmount

**Choice**: Remove injected links in `useEffect` cleanup function

**Rationale**:
- **Memory leaks**: Prevent accumulating DOM nodes
- **Testing**: Clean state between test renders
- **Hot reload**: Works correctly during development

**Caveat**: If fonts are still in use by other components, browser caches them. Removal just cleans up DOM, doesn't unload fonts from memory.

## Risks / Trade-offs

### Risk: FOUT (Flash of Unstyled Text)
- **Impact**: Users briefly see system font before Inter loads
- **Mitigation**: Using `display=swap` minimizes impact, shows text immediately with fallback
- **Alternative**: `display=block` hides text during load (worse UX, causes FOIT)

### Risk: Duplicate Fonts in Merchant Center
- **Impact**: Two sets of preconnect/stylesheet links if MC forgets opt-out
- **Mitigation**: Clear documentation in migration guide, deduplication logic prevents duplicate loads
- **Severity**: Low - deduplication handles gracefully, browser dedupes network requests

### Risk: Google Fonts Dependency
- **Impact**: Font loading fails if Google Fonts is unavailable
- **Mitigation**: Fallback fonts in design tokens (`-apple-system`, `BlinkMacSystemFont`, etc.)
- **Trade-off**: Accepted per MC ADR 54 - self-hosting adds complexity without meaningful benefit

### Risk: SSR Mismatch
- **Impact**: Server renders without fonts, client injects them (hydration warning)
- **Mitigation**: Only run in browser (`typeof document !== 'undefined'`), no DOM manipulation on server
- **Severity**: Low - standard pattern for client-only effects

### Trade-off: No Custom Font Support
- **Decision**: Only support Inter (Nimbus's standard font)
- **Rationale**: Adding font customization increases API surface, maintenance burden
- **Future**: Could add `fontFamily` prop if strong use case emerges, but unlikely

## Migration Plan

### For Merchant Center

Add opt-out prop to prevent duplicate font loading:

```tsx
// Before
<NimbusProvider locale={locale}>
  <App />
</NimbusProvider>

// After
<NimbusProvider locale={locale} loadFonts={false}>
  <App />
</NimbusProvider>
```

**Timeline**: Should be added when MC upgrades to Nimbus version with font loading
**Testing**: Visual regression tests should catch any font loading issues
**Rollback**: Remove `loadFonts={false}` to use Nimbus's font loading (if app-kit font loading removed)

### For Custom Applications

No changes required - fonts load automatically:

```tsx
// Works out of the box
<NimbusProvider>
  <App />
</NimbusProvider>
```

### For Storybook/Documentation

No changes required - fonts load automatically in preview

### Testing Strategy

1. **Unit tests**: Mock `document.head` operations in `use-font-loader.spec.ts`
2. **Integration tests**: Verify links injected in `nimbus-provider.stories.tsx`
3. **Visual regression**: Ensure fonts render correctly in Storybook
4. **SSR tests**: Verify no errors in server-side rendering environments

## Open Questions

None - design is well-scoped and constraints are clear.
