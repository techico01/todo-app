import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// 環境変数から設定を読み込み
const BASE_URL = process.env.TODO_URL || process.env.BASE_URL || 'http://localhost:3000';
const CI_MODE = !!process.env.CI;
// WebKitは明示的に有効化した場合のみ実行（デフォルトはスキップ）
const WEBKIT_ENABLED = process.env.WEBKIT_ENABLED === 'true';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: CI_MODE,
  /* Retry on CI only */
  retries: CI_MODE ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: CI_MODE ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    // グローバルタイムアウトを延長
    actionTimeout: 15000,
    navigationTimeout: 30000,

    // より大きなビューポートサイズの設定
    viewport: { width: 1280, height: 720 },

    // スクリーンショットを自動的に撮影
    screenshot: 'only-on-failure',
  },

  // テスト全体のタイムアウト設定を延長
  timeout: 60000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    // WebKitのテスト設定 - デフォルトでスキップ
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        // WebKit固有の設定
        actionTimeout: 30000, // WebKitでは長めのタイムアウト
      },
      // WebKitテストは明示的に有効化した場合のみ実行（デフォルトはスキップ）
      grepInvert: WEBKIT_ENABLED ? undefined : /.*/,
    },

    /* モバイルビューポートでのテスト */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* 特定のブラウザでのテスト */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* ローカル開発サーバーの自動起動設定 */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000, // 2分のタイムアウト
  // },
});
