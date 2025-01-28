import { act } from 'react'
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from "@chakra-ui/react/preset";

const getMessagesForLocale = (locale) => {
  switch (locale) {
    case 'de':
      return require('@commercetools-uikit/i18n/compiled-data/de.json');
    case 'es':
      return require('@commercetools-uikit/i18n/compiled-data/es.json');
    case 'fr-FR':
      return require('@commercetools-uikit/i18n/compiled-data/fr-FR.json');
    case 'pt-BR':
      return require('@commercetools-uikit/i18n/compiled-data/pt-BR.json');
    default:
      return require('@commercetools-uikit/i18n/compiled-data/en.json');
  }
};

const customRender = (
  node,
  {
    locale = 'en',
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    ...rtlOptions
  } = {}
) => ({
  ...render(
    <ChakraProvider value={system}>
      <IntlProvider locale={locale} messages={getMessagesForLocale(locale)}>
        <MemoryRouter initialEntries={[route]}>{node}</MemoryRouter>
      </IntlProvider>
    </ChakraProvider>,
    rtlOptions
  ),
  history,
});

// re-export everything
export {
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';

// override render method
export { customRender as render };

const originalFireEvent = fireEvent;
originalFireEvent.asyncFocus = (element) => {
  return act(async () => element.focus());
};
originalFireEvent.asyncBlur = (element) => {
  return act(async () => element.blur());
};
export { originalFireEvent as fireEvent };