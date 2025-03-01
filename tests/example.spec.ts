import { test, expect } from '@playwright/test';

// テストタイムアウトを適切に設定
test.setTimeout(30000);

// WebKitに特化したテスト条件を追加
test('has title', async ({ page, browserName }) => {
  await page.goto('https://playwright.dev/');

  // WebKitの場合は異なる検証方法を使用
  if (browserName === 'webkit') {
    const title = await page.title();
    expect(title.includes('Playwright')).toBeTruthy();
  } else {
    // 他のブラウザ用
    await expect(page).toHaveTitle(/Playwright/);
  }
});

test('get started link', async ({ page, browserName }) => {
  await page.goto('https://playwright.dev/');

  // WebKit用の追加待機
  if (browserName === 'webkit') {
    await page.waitForTimeout(1000);
  }

  // リンクテキストをクリック
  await page.getByRole('link', { name: 'Get started' }).click();

  // WebKitの場合はより具体的なURL検証
  if (browserName === 'webkit') {
    // URLに含まれるパスのみを検証
    const url = page.url();
    expect(url.includes('/docs/intro')).toBeTruthy();
  } else {
    // 他のブラウザ用の検証
    await expect(page).toHaveURL(/.*intro/);
  }
});
