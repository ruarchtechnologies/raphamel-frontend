import { test, expect } from '@playwright/test';
import { mockMedusaRoutes } from '../helpers/mock-routes';

test.describe('Forgot password page', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page, { customer: null });
    await page.goto('/forgot-password');
  });

  test('renders the email form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /forgot/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send.*link/i })).toBeVisible();
  });

  test('shows validation error for invalid email', async ({ page }) => {
    await page.getByLabel(/email/i).fill('not-valid');
    await page.getByRole('button', { name: /send.*link/i }).click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('shows "Check your inbox" screen after submitting a valid email', async ({ page }) => {
    await page.getByLabel(/email/i).fill('ade@hospital.ng');
    await page.getByRole('button', { name: /send.*link/i }).click();
    await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 5000 });
  });

  test('shows the submitted email in the success screen', async ({ page }) => {
    await page.getByLabel(/email/i).fill('ade@hospital.ng');
    await page.getByRole('button', { name: /send.*link/i }).click();
    await expect(page.getByText('ade@hospital.ng')).toBeVisible({ timeout: 5000 });
  });

  test('"Try a different email" returns to the form', async ({ page }) => {
    await page.getByLabel(/email/i).fill('ade@hospital.ng');
    await page.getByRole('button', { name: /send.*link/i }).click();
    await expect(page.getByText(/inbox/i)).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: /different email/i }).click();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test('shows success even when the API returns an error (anti-enumeration)', async ({ page }) => {
    await page.route('http://medusa-test.local/auth/customer/emailpass/reset-password', (route) =>
      route.fulfill({ status: 404, json: { message: 'Not found' } }),
    );

    await page.getByLabel(/email/i).fill('unknown@nobody.com');
    await page.getByRole('button', { name: /send.*link/i }).click();
    // Should still show success (the hook catches and ignores errors)
    await expect(page.getByText(/check your inbox/i)).toBeVisible({ timeout: 5000 });
  });

  test('link back to /login is visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /back.*sign in/i })).toBeVisible();
  });
});
