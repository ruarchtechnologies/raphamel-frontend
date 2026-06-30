import { test, expect } from '@playwright/test';
import { mockMedusaRoutes } from '../helpers/mock-routes';

test.describe('Register page', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page, { customer: null });
    await page.goto('/register');
  });

  test('renders the registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /create|register|join/i })).toBeVisible();
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
  });

  test('shows inline validation errors on submit with empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click();
    // Expect at least one validation message
    const errors = page.locator('p.text-rose-600, [class*="rose"]');
    await expect(errors.first()).toBeVisible();
  });

  test('shows error for invalid email', async ({ page }) => {
    await page.getByLabel(/first name/i).fill('Ade');
    await page.getByLabel(/last name/i).fill('Okafor');
    await page.getByLabel(/email/i).fill('not-an-email');
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('shows "email already exists" toast on duplicate email', async ({ page }) => {
    // OTP send-otp returns 409 with "already exists" — shows toast immediately
    await page.route('http://medusa-test.local/store/auth/send-otp', (route) =>
      route.fulfill({
        status: 409,
        json: { message: 'Customer with this email already exists' },
      }),
    );

    await page.getByLabel(/first name/i).fill('Ade');
    await page.getByLabel(/last name/i).fill('Okafor');
    await page.getByLabel(/phone/i).fill('08012345678');
    await page.getByLabel(/email/i).fill('ade@hospital.ng');
    await page.getByLabel(/password/i).first().fill('Pass1234!');
    await page.getByLabel(/confirm password/i).fill('Pass1234!');
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page.getByText(/already exists/i)).toBeVisible({ timeout: 5000 });
  });

  test('link to /login is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /sign in|log in/i })).toBeVisible();
  });
});
