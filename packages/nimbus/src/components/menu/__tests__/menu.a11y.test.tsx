import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { Menu } from '../..';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

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

    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });

  it('has no a11y violations when closed', async () => {
    const { container, getByRole } = renderWithProviders(
      <Menu.Root>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="a">A</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    // menu closed: should not render menu in DOM
    expect(container.querySelector('[role="menu"]')).toBeNull();

    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });
});