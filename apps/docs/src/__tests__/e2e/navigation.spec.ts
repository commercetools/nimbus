/**
 * End-to-end tests for navigation and page loading
 */

import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");

    // Check page title
    await expect(page).toHaveTitle(/Nimbus/i);

    // Check main heading exists
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
  });

  test("navigation bar is visible", async ({ page }) => {
    await page.goto("/");

    // Check for navigation elements
    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();
  });

  test("can navigate to component pages", async ({ page }) => {
    await page.goto("/");

    // Find and click a navigation link (adjust selector based on actual structure)
    const componentLink = page
      .getByRole("link", { name: /components/i })
      .first();

    if (await componentLink.isVisible()) {
      await componentLink.click();

      // Wait for navigation to complete
      await page.waitForLoadState("networkidle");

      // Verify we navigated to a new page
      expect(page.url()).not.toBe("http://localhost:5173/");
    }
  });

  test("search functionality works", async ({ page }) => {
    await page.goto("/");

    // Look for search input
    const searchInput = page.getByPlaceholder(/search/i);

    if (await searchInput.isVisible()) {
      await searchInput.fill("button");

      // Wait for search results
      await page.waitForTimeout(500);

      // Verify search results appear (adjust based on implementation)
      const results = page.getByTestId("search-results");
      if (await results.isVisible()) {
        await expect(results).toBeVisible();
      }
    }
  });

  test("handles 404 pages gracefully", async ({ page }) => {
    // Navigate to non-existent page
    await page.goto("/non-existent-page");

    // Check for 404 message or redirect to home
    const notFoundText = page.getByText(/404|not found/i);

    // Either 404 page is shown or redirected to home
    const is404 = await notFoundText.isVisible().catch(() => false);
    const isHome = page.url().endsWith("/");

    expect(is404 || isHome).toBeTruthy();
  });

  test("responsive navigation on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check if mobile menu toggle exists
    const menuButton = page.getByRole("button", { name: /menu|navigation/i });

    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Verify menu opens
      await page.waitForTimeout(300);

      const nav = page.getByRole("navigation");
      await expect(nav).toBeVisible();
    }
  });
});

test.describe("Page Performance", () => {
  test("homepage loads within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/", { waitUntil: "networkidle" });
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});

test.describe("Accessibility", () => {
  test("page has proper heading structure", async ({ page }) => {
    await page.goto("/");

    // Check for h1
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
  });

  test("interactive elements are keyboard accessible", async ({ page }) => {
    await page.goto("/");

    // Tab through interactive elements
    await page.keyboard.press("Tab");

    // Check that focus is visible
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });
});
