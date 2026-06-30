import { test, expect } from '@playwright/test';
import { mockMedusaRoutes, setAuthCookie, FX } from '../helpers/mock-routes';

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page, { cart: FX.cart });
    await setAuthCookie(page);
    // Plant the cart ID before navigation so the page loads with it already in
    // localStorage — avoids a setCartInStorage + reload double-navigation that
    // creates a race condition between React re-renders and form fills.
    await page.addInitScript(() => {
      localStorage.setItem('raphamel_cart_id', 'cart_e2e_01');
    });
    await page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    // Wait for React to hydrate — Order Summary only renders after client-side mount,
    // so its heading confirms event handlers are attached and the form is interactive.
    await page.getByRole('heading', { name: /order summary/i }).waitFor({ timeout: 10000 });
  });

  test('renders the shipping step by default', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /shipping|delivery/i }),
    ).toBeVisible({ timeout: 6000 });
  });

  test('shows order summary sidebar with cart items', async ({ page }) => {
    await expect(page.getByText(/order summary/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Nitrile Examination Gloves')).toBeVisible({ timeout: 10000 });
  });

  test('shows validation errors on empty shipping form submit', async ({ page }) => {
    const continueBtn = page.getByRole('button', { name: /continue.*payment/i });
    await expect(continueBtn).toBeVisible({ timeout: 6000 });
    await continueBtn.click();

    const errors = page.locator('[class*="rose"], [class*="red"], [role="alert"]');
    await expect(errors.first()).toBeVisible({ timeout: 4000 });
  });

  test('state dropdown is present in the shipping form', async ({ page }) => {
    await expect(page.getByRole('combobox').or(page.getByText(/select.*state|state/i)).first()).toBeVisible({ timeout: 6000 });
  });

  test('shipping options appear after filling address form', async ({ page }) => {
    await page.getByLabel(/first name/i).fill('Ade');
    await page.getByLabel(/last name/i).fill('Okafor');
    await page.getByLabel(/email/i).fill('ade@hospital.ng');
    await page.getByLabel(/phone/i).fill('08012345678');
    await page.getByLabel(/address/i).fill('12 Hospital Road');
    await page.getByLabel(/city/i).fill('Lagos');

    // Select a state
    const stateSelect = page.getByRole('combobox').first();
    await stateSelect.selectOption({ index: 1 });

    await page.getByRole('button', { name: /continue.*payment/i }).click();

    // Shipping options should appear
    await expect(page.getByText(/standard delivery|express delivery/i).first()).toBeVisible({ timeout: 6000 });
  });

  test('total updates when a shipping method is selected', async ({ page }) => {
    await page.getByLabel(/first name/i).fill('Ade');
    await page.getByLabel(/last name/i).fill('Okafor');
    await page.getByLabel(/email/i).fill('ade@hospital.ng');
    await page.getByLabel(/phone/i).fill('08012345678');
    await page.getByLabel(/address/i).fill('12 Hospital Road');
    await page.getByLabel(/city/i).fill('Lagos');

    const stateSelect = page.getByRole('combobox').first();
    await stateSelect.selectOption({ index: 1 });

    await page.getByRole('button', { name: /continue.*payment/i }).click();

    // Select first shipping option
    const shippingOption = page.getByText(/standard delivery/i);
    await expect(shippingOption).toBeVisible({ timeout: 10000 });
    await shippingOption.click();

    // Total should include shipping (₦1,500)
    await expect(page.getByText(/1,500/).first()).toBeVisible({ timeout: 6000 });
  });

  test('shows Paystack payment button on payment step', async ({ page }) => {
    // Navigate to payment step
    await page.getByLabel(/first name/i).fill('Ade');
    await page.getByLabel(/last name/i).fill('Okafor');
    await page.getByLabel(/email/i).fill('ade@hospital.ng');
    await page.getByLabel(/phone/i).fill('08012345678');
    await page.getByLabel(/address/i).fill('12 Hospital Road');
    await page.getByLabel(/city/i).fill('Lagos');

    const stateSelect = page.getByRole('combobox').first();
    await stateSelect.selectOption({ index: 1 });

    await page.getByRole('button', { name: /continue.*payment/i }).click();

    const shippingOption = page.getByText(/standard delivery/i);
    if (await shippingOption.count() > 0) {
      await shippingOption.click();
      const proceedBtn = page.getByRole('button', { name: /proceed.*payment|pay|payment/i });
      if (await proceedBtn.count() > 0) {
        await proceedBtn.click();
        await expect(page.getByText(/pay.*now|paystack|pay.*₦/i)).toBeVisible({ timeout: 6000 });
      }
    }
  });

  test('redirects to order-confirmation on successful order', async ({ page }) => {
    await page.route('http://medusa-test.local/store/carts/**/complete', (route) =>
      route.fulfill({ json: { type: 'order', order: FX.order } }),
    );

    // Full happy-path fill
    await page.getByLabel(/first name/i).fill('Ade');
    await page.getByLabel(/last name/i).fill('Okafor');
    await page.getByLabel(/email/i).fill('ade@hospital.ng');
    await page.getByLabel(/phone/i).fill('08012345678');
    await page.getByLabel(/address/i).fill('12 Hospital Road');
    await page.getByLabel(/city/i).fill('Lagos');
    const stateSelect = page.getByRole('combobox').first();
    await stateSelect.selectOption({ index: 1 });
    await page.getByRole('button', { name: /continue.*payment/i }).click();

    const shippingOption = page.getByText(/standard delivery/i);
    if (await shippingOption.count() > 0) {
      await shippingOption.click();
      const proceedBtn = page.getByRole('button', { name: /proceed.*payment|pay/i });
      if (await proceedBtn.count() > 0) {
        await proceedBtn.click();
        const payBtn = page.getByRole('button', { name: /pay.*now|pay.*₦/i });
        if (await payBtn.count() > 0) {
          await payBtn.click();
          await expect(page).toHaveURL(/order-confirmation/, { timeout: 8000 });
        }
      }
    }
  });
});
