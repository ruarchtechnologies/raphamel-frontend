import { test, expect } from '@playwright/test';
import { mockMedusaRoutes } from '../helpers/mock-routes';

test.describe('Reset password page', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page, { customer: null });
  });

  test('shows "Invalid reset link" when token is missing', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page.getByText(/invalid reset link/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /request.*new link/i })).toBeVisible();
  });

  test('shows "Invalid reset link" when email is missing', async ({ page }) => {
    await page.goto('/reset-password?token=abc');
    await expect(page.getByText(/invalid reset link/i)).toBeVisible();
  });

  test('shows the password form when both token and email are present', async ({ page }) => {
    await page.goto('/reset-password?token=tok_abc&email=ade@hospital.ng');
    await expect(page.getByRole('heading', { name: /set new password/i })).toBeVisible();
    await expect(page.getByLabel(/new password/i).first()).toBeVisible();
    await expect(page.getByLabel(/confirm/i)).toBeVisible();
  });

  test('shows error when passwords do not match', async ({ page }) => {
    await page.goto('/reset-password?token=tok_abc&email=ade@hospital.ng');
    await page.getByLabel(/new password/i).first().fill('NewPass123!');
    await page.getByLabel(/confirm/i).fill('DifferentPass!');
    await page.getByRole('button', { name: /reset password/i }).click();
    await expect(page.getByText(/do not match/i)).toBeVisible();
  });

  test('shows error when password is too short', async ({ page }) => {
    await page.goto('/reset-password?token=tok_abc&email=ade@hospital.ng');
    await page.getByLabel(/new password/i).first().fill('short');
    await page.getByLabel(/confirm/i).fill('short');
    await page.getByRole('button', { name: /reset password/i }).click();
    await expect(page.getByText(/8 characters/i).first()).toBeVisible();
  });

  test('shows password strength indicators as the user types', async ({ page }) => {
    await page.goto('/reset-password?token=tok_abc&email=ade@hospital.ng');
    await page.getByLabel(/new password/i).first().fill('Pass12');
    await expect(page.getByText(/8 characters/i).first()).toBeVisible();
    await expect(page.getByText(/uppercase/i).first()).toBeVisible();
    await expect(page.getByText(/number/i).first()).toBeVisible();
  });

  test('shows success screen and redirects to /login on valid reset', async ({ page }) => {
    await page.goto('/reset-password?token=tok_abc&email=ade@hospital.ng');
    await page.getByLabel(/new password/i).first().fill('NewPass123!');
    await page.getByLabel(/confirm/i).fill('NewPass123!');
    await page.getByRole('button', { name: /reset password/i }).click();

    await expect(page.getByText(/password reset/i)).toBeVisible({ timeout: 5000 });
    // After 2 seconds auto-redirect fires
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('shows error toast when token is expired', async ({ page }) => {
    await page.route('http://medusa-test.local/auth/customer/emailpass/update', (route) =>
      route.fulfill({ status: 400, json: { message: 'Invalid or expired token' } }),
    );

    await page.goto('/reset-password?token=expired&email=ade@hospital.ng');
    await page.getByLabel(/new password/i).first().fill('NewPass123!');
    await page.getByLabel(/confirm/i).fill('NewPass123!');
    await page.getByRole('button', { name: /reset password/i }).click();

    await expect(page.getByText(/expired|invalid/i)).toBeVisible({ timeout: 5000 });
  });
});
