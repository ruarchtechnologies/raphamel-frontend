import { test, expect } from '@playwright/test';
import { mockMedusaRoutes, setAuthCookie } from '../helpers/mock-routes';

// Navigate to the product page and wait for the title to confirm React has
// hydrated and the API data has loaded before any test interaction.
async function gotoProduct(page: Parameters<typeof mockMedusaRoutes>[0]) {
  await page.goto('/products/nitrile-examination-gloves', { waitUntil: 'domcontentloaded' });
  // The page SSR-renders "Product not found" until React Query fetches on the client.
  // Wait for the h1 product title which only appears after data loads.
  await page.getByRole('heading', { name: 'Nitrile Examination Gloves', level: 1 }).waitFor({ timeout: 20000 });
}

test.describe('Add to cart', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page);
    await setAuthCookie(page);
  });

  test('clicking "Add to cart" on a product detail page triggers cart update', async ({ page }) => {
    await gotoProduct(page);

    const addBtn = page.getByRole('button', { name: /add.*cart|add to cart/i });
    await expect(addBtn).toBeVisible({ timeout: 6000 });

    let cartCallMade = false;
    await page.route('http://medusa-test.local/store/carts/**/line-items', (route) => {
      if (route.request().method() === 'POST') {
        cartCallMade = true;
      }
      route.continue();
    });

    await addBtn.click();
    // Give time for the request to fire
    await page.waitForTimeout(500);
    expect(cartCallMade).toBe(true);
  });

  test('add to cart button is disabled while the request is in-flight', async ({ page }) => {
    // Delay the cart line-items response
    await page.route('http://medusa-test.local/store/carts/**/line-items', async (route) => {
      await new Promise((r) => setTimeout(r, 1000));
      route.continue();
    });

    await gotoProduct(page);

    // Use aria-label so the locator stays stable while button shows a spinner
    const addBtn = page.getByRole('button', { name: 'Add to cart' });
    await expect(addBtn).toBeVisible({ timeout: 6000 });
    await addBtn.click();

    await expect(addBtn).toBeDisabled();
  });

  test('shows a success toast or feedback after adding to cart', async ({ page }) => {
    await gotoProduct(page);

    const addBtn = page.getByRole('button', { name: /add.*cart/i });
    await expect(addBtn).toBeVisible({ timeout: 6000 });
    await addBtn.click();

    // Toast notification shows "Added to cart" on success
    await expect(page.getByText('Added to cart')).toBeVisible({ timeout: 6000 });
  });

  test('variant selector is visible when multiple variants exist', async ({ page }) => {
    await gotoProduct(page);
    // At minimum the variant title should appear
    await expect(page.getByText(/box of 100|variant|sku/i)).toBeVisible({ timeout: 6000 });
  });

  test('shows out-of-stock message when inventory is zero', async ({ page }) => {
    await page.route('http://medusa-test.local/store/products**', (route) =>
      route.fulfill({
        json: {
          products: [
            {
              ...require('../helpers/mock-routes').FX?.product,
              variants: [
                {
                  id: 'var_e2e_oos',
                  title: 'Box of 100',
                  sku: 'GLV-NIR-OOS',
                  inventory_quantity: 0,
                  calculated_price: { calculated_amount: 4500, original_amount: 5000 },
                },
              ],
            },
          ],
          count: 1,
        },
      }),
    );

    await page.goto('/products/nitrile-examination-gloves', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'Nitrile Examination Gloves', level: 1 }).waitFor({ timeout: 20000 });
    await expect(page.getByText(/out.*stock|unavailable/i).first()).toBeVisible({ timeout: 6000 });
  });
});
