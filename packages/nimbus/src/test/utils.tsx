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
// Note: This includes act from @testing-library/react, which is the correct
// act to use in tests (it wraps React's act with additional testing utilities)
// `render` is intentionally omitted here — it's overridden below with our
// NimbusProvider-wrapping version.
export {
  act,
  buildQueries,
  cleanup,
  computeHeadingLevel,
  configure,
  createEvent,
  findAllByAltText,
  findAllByDisplayValue,
  findAllByLabelText,
  findAllByPlaceholderText,
  findAllByRole,
  findAllByTestId,
  findAllByText,
  findAllByTitle,
  findByAltText,
  findByDisplayValue,
  findByLabelText,
  findByPlaceholderText,
  findByRole,
  findByTestId,
  findByText,
  findByTitle,
  fireEvent,
  getAllByAltText,
  getAllByDisplayValue,
  getAllByLabelText,
  getAllByPlaceholderText,
  getAllByRole,
  getAllByTestId,
  getAllByText,
  getAllByTitle,
  getByAltText,
  getByDisplayValue,
  getByLabelText,
  getByPlaceholderText,
  getByRole,
  getByTestId,
  getByText,
  getByTitle,
  getConfig,
  getDefaultNormalizer,
  getElementError,
  getNodeText,
  getQueriesForElement,
  getRoles,
  getSuggestedQuery,
  isInaccessible,
  logDOM,
  logRoles,
  prettyDOM,
  queries,
  queryAllByAltText,
  queryAllByAttribute,
  queryAllByDisplayValue,
  queryAllByLabelText,
  queryAllByPlaceholderText,
  queryAllByRole,
  queryAllByTestId,
  queryAllByText,
  queryAllByTitle,
  queryByAltText,
  queryByAttribute,
  queryByDisplayValue,
  queryByLabelText,
  queryByPlaceholderText,
  queryByRole,
  queryByTestId,
  queryByText,
  queryByTitle,
  queryHelpers,
  renderHook,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
export type * from "@testing-library/react";

// Export userEvent instance
export const userEvent = baseUserEvent.setup();

// Override the default render with our custom renderWithProvider
// This allows tests to just import { render } from "@/test/utils"
// and automatically get NimbusProvider wrapping
export { renderWithProvider as render };

// Also export the original RTL render as renderWithoutProvider
// in case tests specifically need it
export { rtlRender as renderWithoutProvider };
