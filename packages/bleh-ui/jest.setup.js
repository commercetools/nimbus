
import '@testing-library/jest-dom';

// React 18 setup
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Polyfill for structuredClone
if (typeof structuredClone === 'undefined') {
  global.structuredClone = obj => {
    return JSON.parse(JSON.stringify(obj));
  };
}

// Add any other required polyfills here
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});