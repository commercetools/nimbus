# Implementation Tasks: Inter Font Loading

## 1. Type Definitions

- [ ] 1.1 Add `loadFonts?: boolean` prop to `NimbusProviderProps` interface in `nimbus-provider.types.ts`
- [ ] 1.2 Add JSDoc comment: "Load Inter font from Google Fonts. Set to false if fonts are loaded by host application. @default true"
- [ ] 1.3 Verify types build correctly with `pnpm --filter @commercetools/nimbus typecheck`

## 2. Font Loading Hook

- [ ] 2.1 Create `packages/nimbus/src/components/nimbus-provider/hooks/` directory
- [ ] 2.2 Create `use-font-loader.ts` with `useFontLoader(enabled: boolean): void` signature
- [ ] 2.3 Implement SSR check: `if (typeof document === 'undefined') return;`
- [ ] 2.4 Implement deduplication check: `if (document.querySelector('[data-nimbus-fonts]')) return;`
- [ ] 2.5 Create helper function to create link elements with proper attributes
- [ ] 2.6 Inject preconnect link for `https://fonts.googleapis.com`
- [ ] 2.7 Inject preconnect link for `https://fonts.gstatic.com` with `crossorigin` attribute
- [ ] 2.8 Inject stylesheet link with Google Fonts CSS API v2 URL: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`
- [ ] 2.9 Add `data-nimbus-fonts` attribute to stylesheet link for identification
- [ ] 2.10 Implement cleanup function that removes all injected links on unmount
- [ ] 2.11 Wrap font injection in `useEffect` with `[enabled]` dependency
- [ ] 2.12 Add TypeScript types and JSDoc documentation

## 3. Provider Integration

- [ ] 3.1 Import `useFontLoader` hook in `nimbus-provider.tsx`
- [ ] 3.2 Destructure `loadFonts = true` from props with default value
- [ ] 3.3 Call `useFontLoader(loadFonts)` at top of component
- [ ] 3.4 Ensure hook runs before all other effects
- [ ] 3.5 Verify no changes needed to existing provider logic
- [ ] 3.6 Add component-level comment explaining font loading behavior

## 4. Unit Tests

- [ ] 4.1 Create `use-font-loader.spec.ts` in hooks directory
- [ ] 4.2 Mock `document.head.append` and `document.head.querySelector`
- [ ] 4.3 Test: Font links injected when enabled=true
- [ ] 4.4 Test: No injection when enabled=false
- [ ] 4.5 Test: SSR safety - no errors when document is undefined
- [ ] 4.6 Test: Deduplication - no duplicate injection when links exist
- [ ] 4.7 Test: Cleanup - links removed on unmount
- [ ] 4.8 Test: Link attributes are correct (href, rel, crossorigin, data-nimbus-fonts)
- [ ] 4.9 Run tests: `pnpm test use-font-loader.spec.ts`
- [ ] 4.10 Ensure all tests pass

## 5. Storybook Stories

- [ ] 5.1 Add story in `nimbus-provider.stories.tsx` demonstrating font loading
- [ ] 5.2 Add story showing `loadFonts={false}` opt-out
- [ ] 5.3 Add play function to verify font links injected in DOM
- [ ] 5.4 Add visual test showing Inter font rendering
- [ ] 5.5 Verify stories render correctly: `pnpm start:storybook`
- [ ] 5.6 Run story tests: `pnpm test nimbus-provider.stories.tsx`
- [ ] 5.7 Ensure all story tests pass

## 6. Documentation

- [ ] 6.1 Update `nimbus-provider.dev.mdx` with font loading section
- [ ] 6.2 Document default behavior (fonts load automatically)
- [ ] 6.3 Document opt-out scenario (Merchant Center example)
- [ ] 6.4 Document fallback behavior when Google Fonts unavailable
- [ ] 6.5 Add code examples for both default and opt-out usage
- [ ] 6.6 Update component JSDoc comment in `nimbus-provider.tsx` to mention font loading
- [ ] 6.7 Create migration guide section for Merchant Center integration

## 7. Integration Testing

- [ ] 7.1 Test in Storybook: Verify Inter font loads in browser DevTools Network tab
- [ ] 7.2 Test multiple provider instances: Ensure only one set of font links
- [ ] 7.3 Test with `loadFonts={false}`: Verify no font links injected
- [ ] 7.4 Test SSR: Render provider in Node environment, verify no errors
- [ ] 7.5 Test cleanup: Mount/unmount provider, verify links removed from DOM
- [ ] 7.6 Visual regression: Compare rendered text with and without fonts

## 8. Build & Type Checking

- [ ] 8.1 Build nimbus package: `pnpm --filter @commercetools/nimbus build`
- [ ] 8.2 Run strict type checking: `pnpm --filter @commercetools/nimbus typecheck:strict`
- [ ] 8.3 Verify no type errors in generated `.d.ts` files
- [ ] 8.4 Check bundle size impact (fonts loaded at runtime, minimal JS impact)

## 9. Full Test Suite

- [ ] 9.1 Run all unit tests: `pnpm test:unit`
- [ ] 9.2 Run all story tests: `pnpm test:storybook`
- [ ] 9.3 Run lint: `pnpm lint`
- [ ] 9.4 Ensure all checks pass

## 10. Documentation Site

- [ ] 10.1 Build documentation site: `pnpm build:docs`
- [ ] 10.2 Start docs site: `pnpm start:docs`
- [ ] 10.3 Verify NimbusProvider documentation updated correctly
- [ ] 10.4 Test font loading in docs site (check Network tab)
- [ ] 10.5 Verify visual appearance of components with Inter font

## 11. Changeset

- [ ] 11.1 Create changeset: `pnpm changeset`
- [ ] 11.2 Select `@commercetools/nimbus` as changed package
- [ ] 11.3 Choose `minor` version bump (new feature)
- [ ] 11.4 Write changeset description:
  ```
  Add automatic Inter font loading to NimbusProvider via new `loadFonts` prop (default: true).
  Fonts load from Google Fonts CSS API v2 with preconnect optimization.
  Set `loadFonts={false}` in contexts where fonts are already loaded (e.g., Merchant Center).
  ```
