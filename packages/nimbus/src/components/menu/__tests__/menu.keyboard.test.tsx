import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { Menu } from '../..';

function renderWithProviders(ui: any) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe('Menu keyboard navigation', () => {
  it('moves highlight with arrow keys and selects with Enter', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    renderWithProviders(
      <Menu.Root onAction={handleAction} defaultOpen>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="one">One</Menu.Item>
          <Menu.Item id="two">Two</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    // initial highlight should be first item (autofocus="first")
    expect(screen.getByRole('menuitem', { name: 'One' })).toHaveAttribute('data-highlighted');

    // arrow down to next item
    await user.keyboard('[ArrowDown]');
    expect(screen.getByRole('menuitem', { name: 'Two' })).toHaveAttribute('data-highlighted');

    // press Enter to activate
    await user.keyboard('[Enter]');
    expect(handleAction).toHaveBeenCalledWith('two');
  });
});