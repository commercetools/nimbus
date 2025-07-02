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

  it('cycles focus with Tab and Shift+Tab', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="first">First</Menu.Item>
          <Menu.Item id="second">Second</Menu.Item>
          <Menu.Item id="third">Third</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    // Tab should move out of menu and to document body (nothing focusable), so focus will blur
    await user.keyboard('[Tab]');
    expect(screen.getByRole('menuitem', { name: 'First' })).not.toHaveAttribute('data-highlighted');

    // Shift+Tab brings focus back into trigger (button)
    await user.keyboard('[Shift+Tab]');
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('Home and End move to first and last items', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="alpha">Alpha</Menu.Item>
          <Menu.Item id="beta">Beta</Menu.Item>
          <Menu.Item id="gamma">Gamma</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    // Move highlight away
    await user.keyboard('[ArrowDown]'); // now beta highlighted
    await user.keyboard('[End]');
    expect(screen.getByRole('menuitem', { name: 'Gamma' })).toHaveAttribute('data-highlighted');

    await user.keyboard('[Home]');
    expect(screen.getByRole('menuitem', { name: 'Alpha' })).toHaveAttribute('data-highlighted');
  });
});