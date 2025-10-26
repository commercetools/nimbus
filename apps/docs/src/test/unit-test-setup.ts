/**
 * Unit test setup file for JSDOM-based tests.
 * This file is loaded before running unit tests.
 */

// Import JSDOM polyfills
import "./setup-jsdom-polyfills";

// Import jest-dom matchers for better assertions
import "@testing-library/jest-dom";

// Import cleanup utility
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Cleanup after each test to prevent memory leaks
afterEach(() => {
  cleanup();
});
