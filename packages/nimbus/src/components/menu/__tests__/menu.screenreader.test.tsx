// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { Menu } from '../..';

function renderWithProviders(ui: JSX.Element) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe('Menu screen-reader interactions', () => {
  it('announces selection via an aria-live region', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="save">Save</Menu.Item>
          <Menu.Item id="delete">Delete</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    // Down arrow to highlight second item then press Enter
    await user.keyboard('[ArrowDown]');
    await user.keyboard('[Enter]');

    // React-Aria adds an aria-live container with role="status" hidden from layout.
    const liveRegion = screen.getByRole('status', { hidden: true });
    expect(liveRegion.textContent?.toLowerCase()).toMatch(/delete/);
  });
});