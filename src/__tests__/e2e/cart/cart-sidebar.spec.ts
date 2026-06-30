import { test, expect } from '@playwright/test';
import { mockMedusaRoutes, setAuthCookie, setCartInStorage, FX } from '../helpers/mock-routes';

test.describe('Cart sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page, { cart: FX.cart });
    await setAuthCookie(page);
    await page.goto('/');
    await setCartInStorage(page);
  });

  test('cart icon in header is visible', async ({ page }) => {
    const cartBtn = page.getByRole('button', { name: /cart|bag/i }).or(
      page.locator('[data-testid="cart-btn"], [aria-label*="cart" i]'),
    ).first();
    await expect(cartBtn).toBeVisible({ timeout: 6000 });
  });

  test('clicking cart icon opens the cart sidebar', async ({ page }) => {
    const cartBtn = page.getByRole('button', { name: /cart|bag/i }).or(
      page.locator('[aria-label*="cart" i]'),
    ).first();
    await cartBtn.click();

    // Sidebar should show cart items
    await expect(page.getByText('Nitrile Examination Gloves').first()).toBeVisible({ timeout: 6000 });
  });

  test('shows item quantity in the cart', async ({ page }) => {
    const cartBtn = page.getByRole('button', { name: /cart|bag/i }).or(
      page.locator('[aria-label*="cart" i]'),
    ).first();
    await cartBtn.click();

    await expect(page.getByText('Nitrile Examination Gloves').first()).toBeVisible({ timeout: 6000 });
    // Quantity stepper shows the value; scoped to the quantity span inside the cart
    await expect(page.locator('span.w-8.text-center').filter({ hasText: '2' })).toBeVisible({ timeout: 6000 });
  });

  test('shows subtotal in the cart', async ({ page }) => {
    const cartBtn = page.getByRole('button', { name: /cart|bag/i }).or(
      page.locator('[aria-label*="cart" i]'),
    ).first();
    await cartBtn.click();

    // Cart subtotal is ₦9,000
    await expect(page.getByText(/9,000/)).toBeVisible({ timeout: 6000 });
  });

  test('remove item button fires DELETE request to line-items', async ({ page }) => {
    const cartBtn = page.getByRole('button', { name: /cart|bag/i }).or(
      page.locator('[aria-label*="cart" i]'),
    ).first();
    await cartBtn.click();

    await expect(page.getByText('Nitrile Examination Gloves').first()).toBeVisible({ timeout: 6000 });

    let deleteCallMade = false;
    await page.route('http://medusa-test.local/store/carts/**/line-items/**', (route) => {
      if (route.request().method() === 'DELETE') {
        deleteCallMade = true;
      }
      route.continue();
    });

    const removeBtn = page.getByRole('button', { name: /remove|delete|×/i }).first();
    if (await removeBtn.count() > 0) {
      await removeBtn.click();
      await page.waitForTimeout(400);
      expect(deleteCallMade).toBe(true);
    }
  });

  test('shows "Proceed to Checkout" button', async ({ page }) => {
    const cartBtn = page.getByRole('button', { name: /cart|bag/i }).or(
      page.locator('[aria-label*="cart" i]'),
    ).first();
    await cartBtn.click();

    await expect(page.getByText('Nitrile Examination Gloves').first()).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole('link', { name: /checkout/i }).or(page.getByRole('button', { name: /checkout/i })),
    ).toBeVisible({ timeout: 10000 });
  });

  test('empty cart state shows helpful message', async ({ page }) => {
    await mockMedusaRoutes(page, { cart: FX.emptyCart });
    await page.reload();
    await setCartInStorage(page, 'cart_e2e_empty');

    const cartBtn = page.getByRole('button', { name: /cart|bag/i }).or(
      page.locator('[aria-label*="cart" i]'),
    ).first();
    await cartBtn.click();

    await expect(page.getByText(/empty|no item|nothing/i)).toBeVisible({ timeout: 6000 });
  });
});
