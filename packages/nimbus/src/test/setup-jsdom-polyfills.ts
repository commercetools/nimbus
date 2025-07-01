/**
 * Polyfills necessary for the `NimbusProvider` not to crash in JSDOM environments (e.g. jest)
 *
 * To use with jest, update jest config like so:
 * config = {
 *   ...
 *   setupFiles: [
 *     '@commercetools/nimbus/setup-jsdom-polyfills`,
 *     ...
 *  ]
 * }
 */

// TODO: document this somewhere besides this file

// implementation of structuredClone polyfill to satisfy the Nimbus (Chakra UI) provider
if (typeof global.structuredClone !== "function") {
  global.structuredClone = function structuredClone(value) {
    if (value === null || value === undefined) {
      return value;
    }

    try {
      // For objects and arrays, use JSON methods
      if (typeof value === "object") {
        return JSON.parse(JSON.stringify(value));
      }
      // For primitive values, return directly
      return value;
    } catch (error) {
      console.warn("structuredClone polyfill failed:", error);

      // Returns a shallow copy as fallback
      return Array.isArray(value) ? [...value] : { ...value };
    }
  };
}

// Polyfill window.matchMedia for JSDOM (used by Nimbus/Chakra for theming)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: unknown) => ({
    matches: false, // Default value, tests can override if needed
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated but needed for some libs
    removeListener: () => {}, // Deprecated but needed for some libs
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
