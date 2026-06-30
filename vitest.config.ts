import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/__tests__/setup.ts'],
    include: [
      'src/__tests__/unit/**/*.test.{ts,tsx}',
      'src/__tests__/integration/**/*.test.{ts,tsx}',
    ],
    exclude: ['src/__tests__/e2e/**', 'node_modules/**'],
    globals: true,
  },
});
