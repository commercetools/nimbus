# Toast Architecture Review — Action Items

Findings from a Senior Architect review of the Toast implementation. Work
through these top-down; they're ordered by priority.

---

## Medium Priority

- [x] **Memory leak: `toastPlacements` map never cleans up on dismiss**
      `toast.manager.ts:118-133` — `dismiss()` removes the toast from the UI but
      never calls `this.toastPlacements.delete(id)`. Only `remove()` cleans up
      the map. In long-lived SPAs this grows unboundedly. **Fix:** Delete the
      entry in `dismiss()` after forwarding to the toaster.

- [ ] **i18n placeholder in production code** `toast.outlet.tsx:108` — The close
      button uses `aria-label="__Dismiss"` (hardcoded). `toast.messages.ts`
      defines a full `LocalizedStrings` dictionary that is never consumed.
      Screen readers will announce "underscore underscore Dismiss". **Fix:**
      Wire `useLocalizedStringFormatter` in the outlet and consume
      `toastMessagesStrings`.

## Low Priority

- [ ] **`meta` spread order allows consumer override of internals**
      `toast.manager.ts:88-91` — `...safeOptions.meta` is spread _after_
      `closable` and `variant`, meaning a consumer passing
      `meta: { variant: "bogus" }` silently overrides the intended variant.
      **Fix:** Spread `safeOptions.meta` first, then set `closable` and
      `variant`.

- [ ] **Stale describe block title in unit tests** `toast.spec.tsx:220` — Says
      `"Action Button → Duration:0 Enforcement"` but the actual behavior is
      `duration: Infinity`. **Fix:** Rename to
      `"Action Button → Duration:Infinity Enforcement"`.

- [ ] **Fixed 400px width is not responsive** `toast.recipe.ts:41` —
      `width: "400px"` will overflow on viewports narrower than 400px. **Fix:**
      Change to `maxWidth: "400px"` and add `width: "100%"` or use
      `min(400px, calc(100vw - 2rem))`.

- [ ] **`description` is required in types but optional in rendering**
      `toast.types.ts:53` marks `description` as required, but
      `toast.outlet.tsx:78` guards with `toast.description &&`. Either make the
      type optional or remove the guard.

## Worth Documenting / Future Consideration

- [ ] **Module-level side effects in `toast.toasters.ts`** Importing anything
      from the toast module eagerly creates 4 Zag.js state machines via
      `createToaster`. This affects tree-shaking, SSR, and test isolation. No
      immediate fix needed, but document the constraint. If SSR support becomes
      a goal, this will need lazy initialization behind a `typeof window` guard.

- [ ] **Hotkeys are undiscoverable** `Alt+Shift+7/9/1/3` focus the toast regions
      but are not mentioned in consumer-facing docs (`toast.dev.mdx`). Add a
      section to the dev docs.

- [ ] **z-index layering not explicitly managed** Chakra's `<Toaster>` handles
      z-index, but there's no guarantee toasts layer above Nimbus
      modals/dialogs. Verify and document the stacking behavior.
