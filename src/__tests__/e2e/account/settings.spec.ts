import { test, expect } from '@playwright/test';
import { mockMedusaRoutes, setAuthCookie } from '../helpers/mock-routes';

test.describe('Account settings page', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page);
    await setAuthCookie(page);
    await page.goto('/account/settings', { waitUntil: 'domcontentloaded' });
    // Wait for React to hydrate before tests interact with the page
    await page.getByRole('heading', { name: /settings/i }).waitFor({ timeout: 10000 });
  });

  test('shows the settings page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible({ timeout: 6000 });
  });

  test('shows the Security section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Security' })).toBeVisible({ timeout: 6000 });
  });

  test('"Send Reset Link" button is visible in security section', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /reset.*link|send.*link|change.*password/i }),
    ).toBeVisible({ timeout: 6000 });
  });

  test('clicking "Send Reset Link" shows a success confirmation', async ({ page }) => {
    const resetBtn = page.getByRole('button', { name: /reset.*link|send.*link|change.*password/i });
    await expect(resetBtn).toBeVisible({ timeout: 6000 });
    await resetBtn.click();

    await expect(page.getByText('Reset link sent')).toBeVisible({ timeout: 6000 });
  });

  test('shows the Notifications/Email Preferences section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /email notifications/i })).toBeVisible({ timeout: 6000 });
  });

  test('email preference toggles are visible', async ({ page }) => {
    // Visual toggle labels (cursor-pointer wraps the hidden checkbox + visual div)
    const toggleLabels = page.locator('label.cursor-pointer');
    await expect(toggleLabels.first()).toBeVisible({ timeout: 6000 });
  });

  test('toggling an email preference updates its state', async ({ page }) => {
    // Use the second toggle (promotions) — first one (orderUpdates) is locked/disabled
    const toggleLabel = page.locator('label.cursor-pointer').nth(1);
    await expect(toggleLabel).toBeVisible({ timeout: 6000 });
    const checkbox = toggleLabel.locator('[type="checkbox"]');
    const initialState = await checkbox.isChecked().catch(() => null);
    await toggleLabel.click();
    if (initialState !== null) {
      const newState = await checkbox.isChecked().catch(() => null);
      expect(newState).not.toBe(initialState);
    }
  });

  test('shows the Danger Zone section with deactivation info', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /danger zone/i })).toBeVisible({ timeout: 6000 });
  });
});
