/**
 * Unit test setup file for JSDOM-based tests.
 * This file is loaded before running unit tests.
 */

// Import JSDOM polyfills (structuredClone, matchMedia)
import "./setup-jsdom-polyfills";

// Import jest-dom matchers
import "@testing-library/jest-dom";

// Import cleanup utility
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

/**
 * Suppress "Could not parse CSS stylesheet" noise from JSDOM.
 *
 * JSDOM's CSSOM parser cannot handle CSS-in-JS stylesheets injected by
 * Emotion / Chakra UI. These errors are non-actionable and flood test output.
 *
 * Two suppression layers:
 * 1. Patch CSSStyleSheet.replaceSync to swallow parse errors at the source
 * 2. Filter console methods as a fallback for any that slip through
 */

// Patch CSSStyleSheet.replaceSync to suppress JSDOM parse errors at the source.
// JSDOM's CSSOM parser cannot handle modern CSS syntax (nesting, layers, etc.)
// used by Emotion/Chakra. When replaceSync throws, JSDOM emits the error
// directly to stderr via virtualConsole, bypassing console.error filtering.
const originalReplaceSync = CSSStyleSheet.prototype.replaceSync;
CSSStyleSheet.prototype.replaceSync = function (text: string) {
  try {
    originalReplaceSync.call(this, text);
  } catch {
    // Silently swallow CSS parse errors — non-actionable in JSDOM
  }
};

function isCssParseNoise(args: unknown[]): boolean {
  return (
    typeof args[0] === "string" &&
    args[0].includes("Could not parse CSS stylesheet")
  );
}

const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (isCssParseNoise(args)) return;
  originalConsoleError.apply(console, args);
};

const originalConsoleWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (isCssParseNoise(args)) return;
  originalConsoleWarn.apply(console, args);
};

const originalConsoleLog = console.log;
console.log = (...args: unknown[]) => {
  if (isCssParseNoise(args)) return;
  originalConsoleLog.apply(console, args);
};
