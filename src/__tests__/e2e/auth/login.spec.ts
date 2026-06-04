import { test, expect } from '@playwright/test';
import { mockMedusaRoutes, setAuthCookie, FX } from '../helpers/mock-routes';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page, { customer: null });
  });

  test('renders the login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('shows validation error for invalid email format', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('not-an-email');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('shows validation error when password is empty', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('ade@hospital.ng');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/at least 6 characters/i)).toBeVisible();
  });

  test('successful login redirects to /account', async ({ page }) => {
    await page.goto('/login');
    // Override customer route AFTER page load so post-login retrieve succeeds
    await page.route('http://medusa-test.local/store/customers/me**', (route) =>
      route.fulfill({ status: 200, json: { customer: FX.customer } }),
    );
    await page.getByLabel(/email/i).fill('ade@hospital.ng');
    await page.getByLabel(/password/i).fill('Pass123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/account/, { timeout: 10000 });
  });

  test('shows error toast on wrong credentials', async ({ page }) => {
    // Override login to return 401
    await page.route('http://medusa-test.local/auth/customer/emailpass', (route) =>
      route.fulfill({ status: 401, json: { message: 'Unauthorized' } }),
    );

    await page.goto('/login');
    await page.getByLabel(/email/i).fill('wrong@test.com');
    await page.getByLabel(/password/i).fill('badpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('submit button shows spinner while submitting', async ({ page }) => {
    await page.goto('/login');

    // Delay the auth response to catch the loading state
    await page.route('http://medusa-test.local/auth/customer/emailpass', async (route) => {
      await new Promise((r) => setTimeout(r, 1000));
      route.fulfill({ status: 200, json: { token: 'tok' } });
    });
    // Override customer so post-login retrieve doesn't fail
    await page.route('http://medusa-test.local/store/customers/me**', (route) =>
      route.fulfill({ status: 200, json: { customer: FX.customer } }),
    );

    await page.getByLabel(/email/i).fill('ade@hospital.ng');
    await page.getByLabel(/password/i).fill('Pass123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    // While submitting, the button should show a spinner (disabled).
    // Use aria-label locator so it stays findable when text is replaced by a spinner.
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeDisabled();
  });

  test('already logged-in user is redirected to /account', async ({ page }) => {
    await setAuthCookie(page);
    await page.goto('/login');
    await expect(page).toHaveURL(/\/account/);
  });

  test('shows pending verification screen for pending accounts', async ({ page }) => {
    // Intercept customer route: unauthenticated requests (no Bearer token) → 401 so
    // the login form stays visible; post-login requests (with Bearer token) → pending customer.
    await page.route('http://medusa-test.local/store/customers/me**', (route) => {
      const auth = route.request().headers()['authorization'] ?? '';
      if (auth.startsWith('Bearer ')) {
        route.fulfill({ json: { customer: FX.pendingCustomer } });
      } else {
        route.fulfill({ status: 401, json: { message: 'Unauthorized' } });
      }
    });

    await page.goto('/login');
    await page.getByLabel(/email/i).fill('pending@hospital.ng');
    await page.getByLabel(/password/i).fill('Pass123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByRole('heading', { name: /under review|account.*review/i })).toBeVisible({ timeout: 5000 });
  });

  test('link to /register is visible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /create one free/i })).toBeVisible();
  });

  test('link to /forgot-password is visible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /forgot/i })).toBeVisible();
  });
});
