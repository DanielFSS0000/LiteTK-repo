import { defineConfig } from '@playwright/test';

const shouldStartFrontend = process.env.PLAYWRIGHT_START_FRONTEND !== 'false';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  webServer: shouldStartFrontend ? {
    command: 'npm run dev -- --host 127.0.0.1',
    cwd: '../Semana_3/dia-4-kafka-docker/frontend',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
    timeout: 30_000
  } : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://127.0.0.1:5173',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
});
