import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { Menu } from '../..';

function renderWithProviders(ui: any) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe('Menu component', () => {
  it('renders trigger and content without crashing', () => {
    renderWithProviders(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="a">A</Menu.Item>
          <Menu.Item id="b">B</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    expect(screen.getByRole('button', { name: /options/i })).toBeInTheDocument();
    // content items should be present since defaultOpen
    expect(screen.getByRole('menuitem', { name: 'A' })).toBeInTheDocument();
  });

  it('calls onAction with the selected key', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    renderWithProviders(
      <Menu.Root onAction={handleAction}>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="save">Save</Menu.Item>
          <Menu.Item id="delete">Delete</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    await user.click(screen.getByRole('button', { name: /options/i }));
    await user.click(screen.getByRole('menuitem', { name: 'Save' }));

    expect(handleAction).toHaveBeenCalledWith('save');
  });

  it('respects closeOnSelect={false}', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Menu.Root closeOnSelect={false}>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );

    await user.click(screen.getByRole('button', { name: /options/i }));
    await user.click(screen.getByRole('menuitem', { name: 'Copy' }));

    // menu should still be visible
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument();
  });
});