import { test, expect } from '@playwright/test';
import { mockMedusaRoutes, setAuthCookie } from '../helpers/mock-routes';

test.describe('Account profile page', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page);
    await setAuthCookie(page);
    await page.goto('/account');
  });

  test('shows the customer name', async ({ page }) => {
    await expect(page.getByText('Ade Okafor').first()).toBeVisible({ timeout: 6000 });
  });

  test('shows the customer email', async ({ page }) => {
    await expect(page.getByText('ade@hospital.ng').first()).toBeVisible({ timeout: 6000 });
  });

  test('renders the personal information form', async ({ page }) => {
    await expect(page.getByLabel(/first name/i)).toBeVisible({ timeout: 6000 });
    await expect(page.getByLabel(/last name/i)).toBeVisible({ timeout: 6000 });
  });

  test('shows verification status badge', async ({ page }) => {
    await expect(page.getByText(/verified|under review|pending/i)).toBeVisible({ timeout: 6000 });
  });

  test('Save changes button is present', async ({ page }) => {
    await expect(page.getByRole('button', { name: /save|update/i })).toBeVisible({ timeout: 6000 });
  });

  test('shows success feedback after saving profile changes', async ({ page }) => {
    await page.route('http://medusa-test.local/store/customers/me**', async (route) => {
      if (route.request().method() === 'POST' || route.request().method() === 'PATCH') {
        route.fulfill({ status: 200, json: { customer: { id: 'cus_e2e_01', email: 'ade@hospital.ng', first_name: 'Adewale', last_name: 'Okafor', phone: '+2348012345678', metadata: { verification_status: 'approved' } } } });
      } else {
        route.fallback();
      }
    });

    const firstNameInput = page.getByLabel(/first name/i);
    await expect(firstNameInput).toBeVisible({ timeout: 6000 });
    await firstNameInput.clear();
    await firstNameInput.fill('Adewale');

    await page.getByRole('button', { name: /save|update/i }).click();

    await expect(page.getByText(/saved|updated|success/i)).toBeVisible({ timeout: 6000 });
  });

  test('unauthenticated user is redirected away from /account', async ({ page }) => {
    // New page context without auth cookie — middleware should redirect to /login
    const ctx = await page.context().browser()!.newContext({ baseURL: 'http://localhost:3000' });
    const unauthPage = await ctx.newPage();
    await mockMedusaRoutes(unauthPage, { customer: null });
    await unauthPage.goto('/account', { waitUntil: 'domcontentloaded' });
    await expect(unauthPage).toHaveURL(/login/, { timeout: 8000 });
    await ctx.close();
  });

  test('nav links to addresses and orders are visible', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /address/i }).first(),
    ).toBeVisible({ timeout: 6000 });
    await expect(
      page.getByRole('link', { name: /order/i }).first(),
    ).toBeVisible({ timeout: 6000 });
  });
});
