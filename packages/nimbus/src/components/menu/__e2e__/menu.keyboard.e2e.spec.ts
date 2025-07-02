// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Menu keyboard navigation (e2e)', () => {
  test('Arrow keys navigate and Enter selects', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=menu--basic');

    await page.locator('button', { hasText: 'Open menu' }).focus();
    await page.keyboard.press('Enter');

    // first item auto focused
    const firstItem = page.locator('[role="menuitem"]', { hasText: 'New file' });
    await expect(firstItem).toBeVisible();

    await page.keyboard.press('ArrowDown');
    const secondItem = page.locator('[role="menuitem"]', { hasText: 'Duplicate' });
    await expect(secondItem).toBeFocused();

    await page.keyboard.press('Enter');
    // menu should close
    await expect(secondItem).not.toBeVisible();
  });
});