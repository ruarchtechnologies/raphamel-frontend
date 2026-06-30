import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'src/__tests__/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: [['html', { open: 'never' }], ['list']],

  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: {
      // Use a dedicated test URL so page.route() patterns are predictable
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: 'http://medusa-test.local',
      NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: 'pk_test_placeholder',
      NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: 'pk_test_placeholder',
    },
  },

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
