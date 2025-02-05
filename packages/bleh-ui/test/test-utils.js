import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from "@chakra-ui/react/preset";

const customRender = (
  node,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    ...rtlOptions
  } = {}
) => ({
  ...render(
    <ChakraProvider value={system}>
      <MemoryRouter initialEntries={[route]}>{node}</MemoryRouter>
    </ChakraProvider>,
    rtlOptions
  ),
  history,
});

// re-export everything
export {
  act,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';

// override render method
export { customRender as render };

const originalFireEvent = fireEvent;

export { originalFireEvent as fireEvent };