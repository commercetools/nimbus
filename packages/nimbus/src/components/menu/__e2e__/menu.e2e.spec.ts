// @ts-nocheck
import { test, expect } from '@playwright/test';

// NOTE: This test assumes Storybook is running on http://localhost:6006
// or that the docs site is running. Adapt the URL as needed.

test.describe('Menu component (e2e)', () => {
  test('opens and selects an item', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=menu--basic');

    const trigger = page.locator('button', { hasText: 'Open menu' });
    await trigger.click();

    const item = page.locator('[role="menuitem"]', { hasText: 'New file' });
    await expect(item).toBeVisible();
    await item.click();

    await expect(item).not.toBeVisible();
  });
});