/**
 * Polyfills for JSDOM test environments
 *
 * These polyfills prevent `NimbusProvider` from crashing in JSDOM
 * environments (e.g., Jest, Vitest).
 *
 * **Usage with Jest:**
 * ```js
 * // jest.config.js
 * module.exports = {
 *   setupFiles: [
 *     '@commercetools/nimbus/setup-jsdom-polyfills'
 *   ]
 * };
 * ```
 *
 * **Usage with Vitest:**
 * ```ts
 * // vitest.config.ts
 * export default defineConfig({
 *   test: {
 *     setupFiles: [
 *       '@commercetools/nimbus/setup-jsdom-polyfills'
 *     ]
 *   }
 * });
 * ```

 */

/**
 * Mock structuredClone
 *
 * **Why**: Required by Chakra UI provider for deep cloning objects
 *
 * **Use cases**:
 * - NimbusProvider initialization
 * - Chakra UI theme configuration
 * - Deep cloning of component state
 * - React context value cloning
 */
if (typeof globalThis.structuredClone !== "function") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.structuredClone = function structuredClone(value: any) {
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

/**
 * Mock window.matchMedia
 *
 * **Why**: Required for responsive design and theme system
 *
 * **Use cases**:
 * - Chakra UI color mode and theme detection
 * - Responsive component behavior
 * - Media query hooks (useMediaQuery)
 * - Breakpoint-based rendering
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: unknown) => ({
    matches: false, // Default, can be overridden in tests
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated but needed
    removeListener: () => {}, // Deprecated but needed
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

/**
 * Mock ResizeObserver
 *
 * **Why**: Required for components that adjust based on size
 *
 * **Use cases**:
 * - Chakra UI responsive components
 * - React Aria components with responsive behavior
 * - Components that measure container dimensions
 */
if (typeof globalThis.ResizeObserver === "undefined") {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver =
    ResizeObserverMock as unknown as typeof ResizeObserver;
}

/**
 * Mock IntersectionObserver
 *
 * **Why**: Required for lazy loading and viewport-based effects
 *
 * **Use cases**:
 * - Components that trigger actions when entering viewport
 * - Infinite scroll implementations
 * - Lazy image loading
 * - Visibility tracking for analytics
 */
if (typeof globalThis.IntersectionObserver === "undefined") {
  class IntersectionObserverMock {
    readonly root: Element | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];

    disconnect() {}
    observe() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    unobserve() {}
  }
  globalThis.IntersectionObserver =
    IntersectionObserverMock as unknown as typeof IntersectionObserver;
}

/**
 * Mock Element.prototype scroll methods
 *
 * **Why**: Used by navigation, modals, and focus management
 *
 * **Use cases**:
 * - React Aria focus management
 * - Scroll-to-top features
 * - Dialog auto-focus and scroll behavior
 * - Dropdown and menu positioning
 */
if (typeof Element !== "undefined") {
  Element.prototype.scrollTo = Element.prototype.scrollTo || (() => {});
  Element.prototype.scrollIntoView =
    Element.prototype.scrollIntoView || (() => {});
}

/**
 * Mock requestAnimationFrame
 *
 * **Why**: Used in animations and transitions
 *
 * **Use cases**:
 * - Chakra UI animations and motion components
 * - React Aria transition hooks
 * - Smooth UI updates and state changes
 * - Custom animation implementations
 */
if (typeof window !== "undefined" && !window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(
      () => callback(Date.now()),
      1000 / 60
    ) as unknown as number;
  };
}
