import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Menu } from '../..';
import { configureAxe } from 'axe-core';

const axe = configureAxe({ rules: { region: { enabled: false } } });

function renderWithProviders(ui: any) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe('Menu accessibility', () => {
  it('has no a11y violations when open', async () => {
    const { container } = renderWithProviders(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="a">A</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    const results = await axe.run(container);
    expect(results.violations.length).toBe(0);
  });
});