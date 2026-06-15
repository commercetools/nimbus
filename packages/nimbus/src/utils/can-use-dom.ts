/**
 * Checks if we're running in a browser environment with a usable DOM.
 *
 * Returns `false` during server-side rendering (Node, RSC), where browser
 * globals like `window`/`document` are unavailable. Use this to guard code that
 * touches DOM-only APIs (e.g. `DOMParser`, `localStorage`) so it can run safely
 * on the server.
 */
export function canUseDOM(): boolean {
  return !!(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}
