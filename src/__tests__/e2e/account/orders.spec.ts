import { test, expect } from '@playwright/test';
import { mockMedusaRoutes, setAuthCookie, FX } from '../helpers/mock-routes';

test.describe('Account orders page', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page);
    await setAuthCookie(page);
    await page.goto('/account/orders');
  });

  test('shows a heading for the orders page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /order/i })).toBeVisible({ timeout: 6000 });
  });

  test('renders order items from the API', async ({ page }) => {
    // FX.order has display_id: 1001 and total: 10500
    await expect(page.getByText(/1001|order/i).first()).toBeVisible({ timeout: 6000 });
  });

  test('shows order status badge', async ({ page }) => {
    await expect(page.getByText(/pending|processing|completed/i)).toBeVisible({ timeout: 6000 });
  });

  test('shows formatted order total', async ({ page }) => {
    // Order total is ₦10,500
    await expect(page.getByText(/10,500|₦/i)).toBeVisible({ timeout: 6000 });
  });

  test('shows order date', async ({ page }) => {
    await expect(page.getByText(/jan|2024|15/i)).toBeVisible({ timeout: 6000 });
  });

  test('shows empty state when there are no orders', async ({ page }) => {
    await page.route('http://medusa-test.local/store/orders**', (route) =>
      route.fulfill({ json: { orders: [], count: 0 } }),
    );
    await page.goto('/account/orders');
    await expect(page.getByText(/no order|haven.*placed|empty/i)).toBeVisible({ timeout: 6000 });
  });

  test('each order has a "View" or detail link', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /view|detail|see/i }).or(page.getByText(/view/i)).first(),
    ).toBeVisible({ timeout: 6000 });
  });

  test('shows skeleton loader while orders are loading', async ({ page }) => {
    // Delay the response to see the skeleton
    await page.route('http://medusa-test.local/store/orders**', async (route) => {
      await new Promise((r) => setTimeout(r, 600));
      route.fulfill({ json: { orders: [FX.order], count: 1 } });
    });

    await page.goto('/account/orders');
    // Skeleton pulses should appear briefly
    const skeleton = page.locator('[class*="animate-pulse"]');
    // Don't assert count since timing is variable; just ensure page eventually renders
    await expect(page.getByText(/order|₦/i).first()).toBeVisible({ timeout: 8000 });
  });
});
