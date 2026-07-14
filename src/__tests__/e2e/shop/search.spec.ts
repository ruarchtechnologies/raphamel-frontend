import { test, expect } from '@playwright/test';
import { mockMedusaRoutes, FX } from '../helpers/mock-routes';

test.describe('Search page', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page);
  });

  test('shows "Search Products" heading when no query is provided', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('heading', { name: /search products/i })).toBeVisible();
  });

  test('shows query in heading when ?q= is set', async ({ page }) => {
    await page.goto('/search?q=gloves');
    await expect(page.getByText(/gloves/i)).toBeVisible({ timeout: 6000 });
  });

  test('displays product results for a matching query', async ({ page }) => {
    await page.goto('/search?q=gloves');
    await expect(page.getByText('Nitrile Examination Gloves')).toBeVisible({ timeout: 6000 });
  });

  test('shows empty state when no products match', async ({ page }) => {
    await page.route('http://medusa-test.local/store/products**', (route) =>
      route.fulfill({ json: { products: [], count: 0 } }),
    );
    await page.goto('/search?q=doesnotexist');
    await expect(page.getByText(/no.*result|nothing|found/i)).toBeVisible({ timeout: 6000 });
  });

  test('inline search form allows refining the query', async ({ page }) => {
    await page.goto('/search?q=gloves');
    // Target the search refinement input on the page (not the header search)
    const input = page.getByPlaceholder(/refine.*search/i);
    await expect(input).toBeVisible({ timeout: 6000 });
    await input.fill('syringe');
    await input.press('Enter');
    await expect(page).toHaveURL(/q=syringe/);
  });

  test('shows error state and retry button on API failure', async ({ page }) => {
    await page.route('http://medusa-test.local/store/products**', (route) =>
      route.fulfill({ status: 500, json: { message: 'Server error' } }),
    );
    await page.goto('/search?q=gloves');
    await expect(page.getByRole('button', { name: /retry|try again/i })).toBeVisible({ timeout: 6000 });
  });
});
