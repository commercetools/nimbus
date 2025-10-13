import { type ReactNode } from "react";
import {
  render as rtlRender,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { NimbusProvider } from "@/components";
import { userEvent as baseUserEvent } from "@testing-library/user-event";

/**
 * Custom render function that wraps components with NimbusProvider.
 * This is the default render export from this module.
 */
const renderWithProvider = (
  ui: ReactNode,
  options?: RenderOptions
): RenderResult => {
  return rtlRender(<NimbusProvider>{ui}</NimbusProvider>, options);
};

// Re-export everything from @testing-library/react
export * from "@testing-library/react";

// Export userEvent instance
export const userEvent = baseUserEvent.setup();

// Export act from react
export { act } from "react";

// Override the default render with our custom renderWithProvider
// This allows tests to just import { render } from "@/test/utils"
// and automatically get NimbusProvider wrapping
export { renderWithProvider as render };

// Also export the original RTL render as renderWithoutProvider
// in case tests specifically need it
export { rtlRender as renderWithoutProvider };
