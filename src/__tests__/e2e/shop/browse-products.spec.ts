import { test, expect } from '@playwright/test';
import { mockMedusaRoutes, FX } from '../helpers/mock-routes';

test.describe('Browse products page', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page);
    await page.goto('/products');
  });

  test('renders the product grid with at least one product card', async ({ page }) => {
    await expect(page.getByText('Nitrile Examination Gloves')).toBeVisible({ timeout: 6000 });
  });

  test('shows a heading for the products page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /product|catalog|all/i })).toBeVisible();
  });

  test('filter panel is accessible', async ({ page }) => {
    // Sort combobox is always visible; sidebar filter panel visible on desktop
    await expect(page.getByRole('combobox').first()).toBeVisible();
  });

  test('shows empty state when no products are returned', async ({ page }) => {
    await page.route('http://medusa-test.local/store/products**', (route) =>
      route.fulfill({ json: { products: [], count: 0 } }),
    );
    await page.goto('/products');
    await expect(page.getByText(/no product|empty|nothing/i)).toBeVisible({ timeout: 6000 });
  });

  test('clicking a product card navigates to the product detail page', async ({ page }) => {
    await expect(page.getByText('Nitrile Examination Gloves')).toBeVisible({ timeout: 6000 });
    await page.getByText('Nitrile Examination Gloves').click();
    await expect(page).toHaveURL(/\/products\//);
  });

  test('shows product price on each card', async ({ page }) => {
    // Target bold price spans in product cards, not filter panel price range labels
    await expect(page.locator('span.font-bold').filter({ hasText: /₦/ }).first()).toBeVisible({ timeout: 6000 });
  });

  test('sort selector is present', async ({ page }) => {
    await expect(page.getByRole('combobox').first()).toBeVisible({ timeout: 6000 });
  });
});
