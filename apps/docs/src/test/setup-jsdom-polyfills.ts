/**
 * Polyfills for JSDOM test environments
 *
 * These polyfills ensure Nimbus components and the docs app work correctly
 * in JSDOM (used by Vitest unit tests).
 *
 * Based on @commercetools/nimbus/setup-jsdom-polyfills with docs-specific additions.
 */

/**
 * Mock structuredClone - Required by Chakra UI and Nimbus
 */
if (typeof globalThis.structuredClone !== "function") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.structuredClone = function structuredClone(value: any) {
    if (value === null || value === undefined) {
      return value;
    }

    try {
      if (typeof value === "object") {
        return JSON.parse(JSON.stringify(value));
      }
      return value;
    } catch (error) {
      console.warn("structuredClone polyfill failed:", error);
      return Array.isArray(value) ? [...value] : { ...value };
    }
  };
}

/**
 * Mock window.matchMedia - Required for responsive design
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: unknown) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

/**
 * Mock ResizeObserver - Required for responsive components
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
 * Mock IntersectionObserver - Required for lazy loading
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
 * Mock Element scroll methods - Required for navigation and focus
 */
if (typeof Element !== "undefined") {
  Element.prototype.scrollTo = Element.prototype.scrollTo || (() => {});
  Element.prototype.scrollIntoView =
    Element.prototype.scrollIntoView || (() => {});
}

/**
 * Mock requestAnimationFrame - Required for animations
 */
if (typeof window !== "undefined" && !window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(
      () => callback(Date.now()),
      1000 / 60
    ) as unknown as number;
  };
}

/**
 * Mock window.scrollTo - Required for navigation scroll behavior
 */
if (typeof window !== "undefined") {
  window.scrollTo = window.scrollTo || (() => {});
}

/**
 * Mock HTMLElement.prototype.scrollIntoView - Used by React Router navigation
 */
if (typeof HTMLElement !== "undefined") {
  HTMLElement.prototype.scrollIntoView =
    HTMLElement.prototype.scrollIntoView || (() => {});
}
