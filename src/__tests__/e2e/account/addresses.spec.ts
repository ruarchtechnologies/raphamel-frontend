import { test, expect } from '@playwright/test';
import { mockMedusaRoutes, setAuthCookie, FX } from '../helpers/mock-routes';

test.describe('Account addresses page', () => {
  test.beforeEach(async ({ page }) => {
    await mockMedusaRoutes(page);
    await setAuthCookie(page);
    await page.goto('/account/addresses', { waitUntil: 'domcontentloaded' });
    // Wait for address data to render — useAddresses only fires client-side, so
    // visible address data confirms React has fully hydrated and onClick handlers
    // are attached. The SSR-rendered button appearing is NOT sufficient.
    await page.getByText('12 Hospital Road').waitFor({ timeout: 10000 });
  });

  test('shows a heading for the addresses page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /address/i })).toBeVisible({ timeout: 6000 });
  });

  test('renders an existing address', async ({ page }) => {
    await expect(page.getByText('12 Hospital Road')).toBeVisible({ timeout: 6000 });
    await expect(page.getByText('Lagos').first()).toBeVisible({ timeout: 6000 });
  });

  test('shows "Default Shipping" badge on the default address', async ({ page }) => {
    await expect(page.getByText(/default shipping/i)).toBeVisible({ timeout: 6000 });
  });

  test('"Add new address" button opens the form modal', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add.*address|new address/i });
    await expect(addBtn).toBeVisible({ timeout: 6000 });
    await addBtn.click();

    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 6000 });
  });

  test('address form modal has all required fields', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add.*address|new address/i });
    await expect(addBtn).toBeVisible({ timeout: 6000 });
    await addBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 6000 });

    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByLabel(/address/i).first()).toBeVisible();
    await expect(page.getByLabel(/city/i)).toBeVisible();
  });

  test('closing the modal hides the form', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /add.*address|new address/i });
    await expect(addBtn).toBeVisible({ timeout: 6000 });
    await addBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 6000 });

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 6000 });
  });

  test('submitting a new address fires a POST request', async ({ page }) => {
    // Open the modal BEFORE registering the POST interceptor to avoid interference
    const addBtn = page.getByRole('button', { name: /add.*address|new address/i });
    await expect(addBtn).toBeVisible({ timeout: 6000 });
    await addBtn.click();
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 6000 });

    let postMade = false;
    await page.route('http://medusa-test.local/store/customers/me/addresses**', (route) => {
      if (route.request().method() === 'POST') {
        postMade = true;
        route.fulfill({ json: { address: FX.address } });
      } else {
        route.continue();
      }
    });

    await page.getByLabel(/first name/i).fill('Ade');
    await page.getByLabel(/last name/i).fill('Okafor');
    await page.getByLabel(/address/i).first().fill('12 Hospital Road');
    await page.getByLabel(/city/i).fill('Lagos');

    const stateSelect = page.getByRole('combobox').first();
    await stateSelect.selectOption({ index: 1 });

    const saveBtn = page.getByRole('dialog').getByRole('button', { name: /save|add|submit/i });
    await saveBtn.click();

    await page.waitForTimeout(500);
    expect(postMade).toBe(true);
  });

  test('"Edit" button pre-fills the address form', async ({ page }) => {
    const editBtn = page.getByRole('button', { name: /edit/i }).first();
    await expect(editBtn).toBeVisible({ timeout: 6000 });
    await editBtn.click();

    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 6000 });
    const firstNameInput = page.getByLabel(/first name/i);
    await expect(firstNameInput).toHaveValue('Ade');
  });

  test('"Remove" button fires a DELETE request', async ({ page }) => {
    let deleteMade = false;
    await page.route('http://medusa-test.local/store/customers/me/addresses/**', (route) => {
      if (route.request().method() === 'DELETE') {
        deleteMade = true;
        route.fulfill({ json: { id: 'addr_e2e_01', deleted: true } });
      } else {
        route.continue();
      }
    });

    const removeBtn = page.getByRole('button', { name: /remove|delete/i }).first();
    await expect(removeBtn).toBeVisible({ timeout: 6000 });
    await removeBtn.click();

    await page.waitForTimeout(500);
    expect(deleteMade).toBe(true);
  });

  test('shows empty state when no addresses exist', async ({ page }) => {
    await page.route('http://medusa-test.local/store/customers/me/addresses**', (route) =>
      route.fulfill({ json: { addresses: [], count: 0 } }),
    );
    await page.goto('/account/addresses', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/no addresses yet/i)).toBeVisible({ timeout: 6000 });
  });
});
